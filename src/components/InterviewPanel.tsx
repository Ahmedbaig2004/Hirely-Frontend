"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type React from "react";
import {
  Mic,
  BrainCircuit,
  CheckCircle,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { KaraokeText } from "../components/lib/karaoketext";
import { toast } from "react-toastify";
import { VoiceVisualizer } from "./ui/voice-visualizer";

type ProcessingStage =
  | "evaluating"
  | "analyzing_voice"
  | "generating_report"
  | "done";

export default function InterviewPanel() {
  const router = useRouter();

  // 1. Get State
  const {
    sessionId,
    currentQuestion,
    setQuestion,
    setFeedback,
    firstQuestionAudio,
    setFirstQuestionAudio,
    isTtsEnabled,
    toggleTts,
  } = useInterviewStore();

  // 2. Local State
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  // Audio State
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Report Processing State
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState({ completed: 0, total: 9 });
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("evaluating");

  // 3. Hooks
  const {
    isRecording,
    volume,
    getAudioBlob,
    resetRecorder,
    stopRecordingManual,
  } = useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // LOGIC SECTIONS (Startup, Audio, Submission)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (firstQuestionAudio && isTtsEnabled) {
      setIsAIThinking(true);
      setCurrentAudioData(firstQuestionAudio);
      playAudio(firstQuestionAudio);
    } else {
      setFirstQuestionAudio(null);
      setCurrentAudioData(null);
    }
  }, []);

  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  useEffect(() => {
    if (
      !isAIThinking &&
      prevRecordingState.current === true &&
      isRecording === false
    ) {
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  const playAudio = async (base64String: string) => {
    if (!audioRef.current || !isTtsEnabled) return;

    try {
      // 1. Force stop any previous audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // 2. Set new source
      audioRef.current.src = `data:audio/mp3;base64,${base64String}`;

      // 3. Setup Listeners
      audioRef.current.onended = () => {
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      };

      audioRef.current.onerror = (e) => {
        console.error("Audio playback error", e);
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      };

      // 4. Play with Promise Handling (The Fix)
      setIsPlaying(true); // Optimistic UI update

      try {
        await audioRef.current.play();
      } catch (err: any) {
        // Ignore "Interrupted" errors (common in React Strict Mode)
        if (err.name === "AbortError" || err.message.includes("interrupted")) {
          console.log("Audio playback interrupted (harmless)");
        } else {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        }
      }
    } catch (e) {
      console.error("Audio setup error", e);
      setIsAIThinking(false);
      setIsPlaying(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // VOICE PROGRESS POLLING + FINALIZATION
  // ─────────────────────────────────────────────────────────────
  const pollVoiceProgress = useCallback(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";

    const poll = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/voice-progress/${sessionId}`
        );
        setVoiceProgress({ completed: data.completed, total: data.total });

        if (data.allDone) {
          // All voice analyses complete -> generate the combined report
          setProcessingStage("generating_report");
          try {
            await axios.post(`${backendUrl}/api/finalize-interview`, {
              sessionId,
            });
            setProcessingStage("done");
            // Brief pause so user sees the completed state before redirect
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 1200);
          } catch (finalizeErr: any) {
            console.error("Finalize error:", finalizeErr);
            toast.error("Failed to generate report. Please try again.");
            // Redirect to dashboard anyway - the data may still be available
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 2000);
          }
        } else {
          setTimeout(poll, 2000);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setTimeout(poll, 3000); // retry on error with longer delay
      }
    };

    poll();
  }, [sessionId, router]);

  const handleSubmission = async (manualBlob?: Blob) => {
    const audioBlob = manualBlob || getAudioBlob();
    if (audioBlob.size < 3000) {
      resetRecorder();
      return;
    }

    setIsAIThinking(true);
    setHasSpoken(false);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("sessionId", sessionId || "");
    formData.append("question", currentQuestion || "");

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/submit-answer`, formData);
      const { evaluation, nextQuestion, isFinished, audio } = res.data;

      setFeedback(evaluation.feedback);

      if (isFinished) {
        // Enter the report processing flow
        setIsProcessingReport(true);
        setProcessingStage("analyzing_voice");
        pollVoiceProgress();
        return;
      }

      setQuestion(nextQuestion?.question);
      setQuestionCount((prev) => prev + 1);

      if (audio) setCurrentAudioData(audio);
      else setCurrentAudioData(null);

      if (audio && isTtsEnabled) {
        playAudio(audio);
      } else {
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to submit answer";
      toast.error(`Error: ${errorMsg}`);
      console.error(err);
      setIsAIThinking(false);
      resetRecorder();
    }
  };

  const handleManualStop = async () => {
    if (isAIThinking) return;
    const blob = await stopRecordingManual();
    await handleSubmission(blob);
  };

  // ─────────────────────────────────────────────────────────────
  // REPORT PROCESSING SCREEN
  // ─────────────────────────────────────────────────────────────
  if (isProcessingReport) {
    const pct =
      voiceProgress.total > 0
        ? Math.round((voiceProgress.completed / voiceProgress.total) * 100)
        : 0;

    const stages: {
      key: ProcessingStage;
      label: string;
      subtitle: string;
    }[] = [
      {
        key: "evaluating",
        label: "Answer Evaluated",
        subtitle: "Your response has been graded",
      },
      {
        key: "analyzing_voice",
        label: "Analyzing Voice Patterns",
        subtitle: `${voiceProgress.completed} of ${voiceProgress.total} audio samples processed`,
      },
      {
        key: "generating_report",
        label: "Generating Combined Report",
        subtitle: "Merging technical + communication scores",
      },
      {
        key: "done",
        label: "Preparing Your Dashboard",
        subtitle: "Redirecting...",
      },
    ];

    const stageOrder: ProcessingStage[] = [
      "evaluating",
      "analyzing_voice",
      "generating_report",
      "done",
    ];
    const currentIdx = stageOrder.indexOf(processingStage);

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">

        {/* Ambient orb — violet while processing, emerald when done */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none flex items-center justify-center"
          style={{ zIndex: 0 }}
        >
          <motion.div
            className="rounded-full blur-[160px]"
            animate={{
              opacity: processingStage === "done" ? 0.25 : 0.15,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              width: 700,
              height: 700,
              background:
                processingStage === "done"
                  ? "radial-gradient(circle, #10B981 0%, transparent 60%)"
                  : "radial-gradient(circle, var(--md-sys-color-primary) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Glass modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-md rounded-2xl glass-card-raised p-8"
          style={{ zIndex: 2 }}
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                border: "1px solid color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
                boxShadow: "0 0 30px color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)",
              }}
            >
              <BrainCircuit size={26} style={{ color: "var(--md-sys-color-primary)" }} />
            </motion.div>
            <h2 className="text-xl font-semibold text-on-surface tracking-tight opacity-90">
              Building Your Report
            </h2>
            <p className="text-xs text-on-surface-variant mt-1.5 tracking-wide opacity-45">
              Analyzing your full interview session
            </p>
          </div>

          {/* Stage list */}
          <div className="space-y-5">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentIdx;
              const isActive = idx === currentIdx;

              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3.5"
                >
                  {/* Step circle */}
                  <div
                    className="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isCompleted
                        ? "rgba(16,185,129,0.15)"
                        : isActive
                        ? "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)"
                        : "var(--md-sys-color-surface-container)",
                      border: isCompleted
                        ? "1px solid rgba(16,185,129,0.4)"
                        : isActive
                        ? "1px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)"
                        : "1px solid var(--md-sys-color-outline-variant)",
                      boxShadow: isActive
                        ? "0 0 12px color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)"
                        : "none",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={14} style={{ color: "#10B981" }} />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                      >
                        <Loader2 size={14} style={{ color: "var(--md-sys-color-primary)" }} />
                      </motion.div>
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--md-sys-color-surface-container-high)" }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium transition-colors duration-500"
                      style={{
                        color: isCompleted
                          ? "#10B981"
                          : isActive
                          ? "#ffffff"
                          : "var(--md-sys-color-on-surface-variant)",
                      }}
                    >
                      {stage.label}
                    </p>
                    <p
                      className="text-xs mt-0.5 transition-colors duration-500"
                      style={{
                        color: isActive
                          ? "var(--md-sys-color-on-surface-variant)"
                          : "var(--md-sys-color-on-surface-variant)",
                      }}
                    >
                      {stage.subtitle}
                    </p>

                    {/* Voice analysis progress bar */}
                    {stage.key === "analyzing_voice" && (isActive || isCompleted) && (
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <div
                          className="flex-1 h-1 rounded-full overflow-hidden"
                          style={{ background: "var(--md-sys-color-surface-container-high)" }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: isCompleted
                                ? "#10B981"
                                : "linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))",
                              boxShadow: isCompleted
                                ? "none"
                                : "0 0 8px color-mix(in srgb, var(--md-sys-color-primary) 50%, transparent)",
                            }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${isCompleted ? 100 : pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <span
                          className="text-xs font-mono shrink-0 tabular-nums"
                          style={{ color: isCompleted ? "#10B981" : "var(--md-sys-color-tertiary)" }}
                        >
                          {isCompleted ? "100" : pct}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // NORMAL INTERVIEW RENDER
  // ─────────────────────────────────────────────────────────────
  const showKaraokeMode = isTtsEnabled && currentAudioData;

  return (
    <div className="relative min-h-screen flex flex-col items-center z-10">

      {/* Dynamic ambient orb — color shifts with interview state */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="rounded-full blur-[180px]"
          animate={{
            opacity: isAIThinking ? 0.2 : isRecording ? 0.18 : 0.12,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            width: 700,
            height: 700,
            background: isAIThinking
              ? "radial-gradient(circle, var(--md-sys-color-primary) 0%, transparent 60%)"
              : isRecording
              ? "radial-gradient(circle, var(--md-sys-color-tertiary) 0%, transparent 60%)"
              : "radial-gradient(circle, var(--md-sys-color-secondary) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── TOP BAR — glass pill ────────────────────────────── */}
      <div className="w-full flex justify-center pt-6 pb-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-6 px-5 py-2.5 rounded-full glass-card"
        >
          {/* Question counter */}
          <div className="flex items-center gap-2">
            <span className="label-caps">Question</span>
            <span className="text-sm font-bold text-on-surface tabular-nums">
              #{questionCount}
            </span>
          </div>

          {/* Divider */}
          <div
            className="w-px h-4"
            style={{ background: "var(--md-sys-color-outline-variant)" }}
          />

          {/* TTS toggle */}
          <button
            onClick={toggleTts}
            className="flex items-center gap-1.5 transition-all duration-200"
            style={{ color: isTtsEnabled ? "var(--md-sys-color-tertiary)" : "var(--md-sys-color-on-surface-variant)" }}
            aria-label={isTtsEnabled ? "Disable voice" : "Enable voice"}
          >
            {isTtsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-xs font-medium">
              {isTtsEnabled ? "Voice On" : "Voice Off"}
            </span>
          </button>
        </motion.div>
      </div>

      {/* ── CENTER — Question text ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center w-full px-6 py-10 relative z-10">
        <div className="w-full max-w-2xl">
          {currentQuestion && (
            showKaraokeMode ? (
              <div className="w-full [&_p]:!text-2xl [&_p]:md:!text-3xl [&_p]:!leading-relaxed">
                <KaraokeText
                  text={currentQuestion}
                  isPlaying={isPlaying}
                  audioRef={audioRef as React.RefObject<HTMLAudioElement>}
                />
              </div>
            ) : (
              <motion.p
                key={currentQuestion}
                className="text-2xl md:text-3xl leading-relaxed font-medium text-center text-on-surface opacity-90"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
              >
                {currentQuestion.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.3em]"
                    variants={{
                      hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.4, ease: "easeOut" },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            )
          )}
        </div>
      </div>

      {/* ── BOTTOM DOCK — floating glass pill ───────────────── */}
      <div className="w-full flex justify-center pb-10 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-5 px-8 py-6 rounded-2xl glass-card"
          style={{
            boxShadow: isRecording
              ? "0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary) 12%, transparent), 0 8px 40px rgba(0,0,0,0.4)"
              : isAIThinking
              ? "0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent), 0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(0,0,0,0.3)",
            transition: "box-shadow 0.8s ease",
          }}
        >
          {/* State indicator */}
          <div className="flex flex-col items-center">
            {isAIThinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  {/* Shimmer ring */}
                  <div
                    className="absolute inset-0 rounded-full shimmer-ring"
                    style={{
                      border: "1px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                      boxShadow: "0 0 16px color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
                    }}
                  />
                  {/* Inner orb */}
                  <div
                    className="w-8 h-8 rounded-full orb-breathe flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-primary) 50%, transparent), color-mix(in srgb, var(--md-sys-color-primary-container) 25%, transparent))",
                      boxShadow: "0 0 20px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                    }}
                  >
                    <BrainCircuit size={14} style={{ color: "var(--md-sys-color-on-primary-container)" }} />
                  </div>
                </div>
                <span className="label-caps" style={{ color: "var(--md-sys-color-primary)" }}>
                  Analyzing
                </span>
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  {/* Expanding rings */}
                  {[0, 1].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent)" }}
                      animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: ring * 0.55,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent), color-mix(in srgb, var(--md-sys-color-tertiary) 12%, transparent))",
                      border: "1px solid color-mix(in srgb, var(--md-sys-color-tertiary) 45%, transparent)",
                      boxShadow: "0 0 18px color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent)",
                    }}
                  >
                    <Mic size={14} style={{ color: "var(--md-sys-color-tertiary)" }} />
                  </div>
                </div>
                <span className="label-caps" style={{ color: "var(--md-sys-color-tertiary)" }}>
                  Listening
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded-full orb-breathe"
                  style={{
                    background: "var(--md-sys-color-surface-container)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                  }}
                />
                <span className="label-caps">Ready — start speaking</span>
              </motion.div>
            )}
          </div>

          {/* Voice visualizer */}
          <VoiceVisualizer
            volume={volume}
            isRecording={isRecording}
            isAIThinking={isAIThinking}
          />

          {/* Done Speaking button */}
          <motion.button
            onClick={handleManualStop}
            disabled={!hasSpoken || isAIThinking}
            whileHover={hasSpoken && !isAIThinking ? { scale: 1.02 } : {}}
            whileTap={hasSpoken && !isAIThinking ? { scale: 0.98 } : {}}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
            style={
              hasSpoken && !isAIThinking
                ? {
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                    color: "#ffffff",
                  }
                : {
                    background: "var(--md-sys-color-surface-container)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                    color: "var(--md-sys-color-on-surface-variant)",
                    opacity: 0.4,
                    cursor: "not-allowed",
                  }
            }
          >
            <CheckCircle size={16} />
            Done Speaking
          </motion.button>
        </motion.div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
