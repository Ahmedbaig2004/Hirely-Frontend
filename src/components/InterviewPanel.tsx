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
  X,
  AlertTriangle,
  MessageSquare,
  Video,
  Send,
} from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { KaraokeText } from "../components/lib/karaoketext";
import { toast } from "react-toastify";
import { VoiceVisualizer } from "./ui/voice-visualizer";

type ProcessingStage =
  | "evaluating"
  | "analyzing_voice"
  | "generating_report"
  | "done";

type InterviewMode = "audio" | "chat" | "video";

type ChatMessage = {
  role: "ai" | "user";
  content: string;
};

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
    resetSession,
  } = useInterviewStore();

  // 2. Local State
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  // Audio State
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Exit modal state
  const [showExitModal, setShowExitModal] = useState(false);

  // Interview mode state
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("audio");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Report Processing State
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState({ completed: 0, total: 9 });
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("evaluating");

  // Track whether any audio turns have been submitted (for smart finalization)
  const [hasAudioTurns, setHasAudioTurns] = useState(false);

  // Abort ref for voice polling — set to true on unmount to stop recursive setTimeout
  const pollingAbortRef = useRef(false);
  useEffect(() => {
    return () => { pollingAbortRef.current = true; };
  }, []);

  // 3. Hooks
  const {
    isRecording,
    volume,
    getAudioBlob,
    resetRecorder,
    stopRecordingManual,
    isSwitchingModeRef,
  } = useVoiceActivity(isAIThinking, interviewMode);
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

  // Initialize chat with first question
  useEffect(() => {
    if (currentQuestion && chatMessages.length === 0) {
      setChatMessages([{ role: "ai", content: currentQuestion }]);
    }
  }, [currentQuestion]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  useEffect(() => {
    if (
      !isAIThinking &&
      prevRecordingState.current === true &&
      isRecording === false &&
      interviewMode === "audio" &&
      !isSwitchingModeRef.current
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

    pollingAbortRef.current = false;

    const poll = async () => {
      if (pollingAbortRef.current) return;
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/voice-progress/${sessionId}`
        );
        if (pollingAbortRef.current) return;
        setVoiceProgress({ completed: data.completed, total: data.total });

        if (data.allDone) {
          // All voice analyses complete -> generate the combined report
          setProcessingStage("generating_report");
          try {
            await axios.post(`${backendUrl}/api/finalize-interview`, {
              sessionId,
            });
            if (pollingAbortRef.current) return;
            setProcessingStage("done");
            // Brief pause so user sees the completed state before redirect
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 1200);
          } catch (finalizeErr: any) {
            if (pollingAbortRef.current) return;
            console.error("Finalize error:", finalizeErr);
            toast.error("Failed to generate report. Please try again.");
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 2000);
          }
        } else {
          setTimeout(poll, 2000);
        }
      } catch (err) {
        if (pollingAbortRef.current) return;
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
      const { evaluation, nextQuestion, isFinished, audio, transcript } = res.data;

      setFeedback(evaluation.feedback);
      setHasAudioTurns(true);

      // Sync audio transcript into chat history so switching to chat shows full conversation
      if (transcript) {
        setChatMessages((prev) => [...prev, { role: "user", content: transcript }]);
      }

      if (isFinished) {
        setIsProcessingReport(true);
        // Only poll voice progress if there were audio turns
        setProcessingStage("analyzing_voice");
        pollVoiceProgress();
        return;
      }

      setQuestion(nextQuestion?.question);
      setQuestionCount((prev) => prev + 1);

      // Add next AI question to chat history
      if (nextQuestion?.question) {
        setChatMessages((prev) => [...prev, { role: "ai", content: nextQuestion.question }]);
      }

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

  const handleExitConfirm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    resetSession();
    router.replace("/start");
  };

  const handleManualStop = async () => {
    if (isAIThinking) return;
    const blob = await stopRecordingManual();
    await handleSubmission(blob);
  };

  // ─────────────────────────────────────────────────────────────
  // CHAT MODE SUBMISSION
  // ─────────────────────────────────────────────────────────────
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isAIThinking) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsAIThinking(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/submit-answer`, {
        sessionId,
        question: currentQuestion,
        answer: userMessage,
      });
      const { evaluation, nextQuestion, isFinished } = res.data;

      setFeedback(evaluation.feedback);

      if (isFinished) {
        setIsProcessingReport(true);
        if (hasAudioTurns) {
          // Mixed mode: poll for voice analysis on audio turns
          setProcessingStage("analyzing_voice");
          pollVoiceProgress();
        } else {
          // Chat-only: skip voice polling, finalize immediately
          setProcessingStage("generating_report");
          const backendUrl2 =
            process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
          try {
            await axios.post(`${backendUrl2}/api/finalize-interview`, { sessionId });
            setProcessingStage("done");
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 1200);
          } catch (finalizeErr: any) {
            console.error("Finalize error:", finalizeErr);
            toast.error("Failed to generate report. Please try again.");
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 2000);
          }
        }
        return;
      }

      setQuestion(nextQuestion?.question);
      setQuestionCount((prev) => prev + 1);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: nextQuestion?.question },
      ]);
      setIsAIThinking(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to submit answer";
      toast.error(`Error: ${errorMsg}`);
      setIsAIThinking(false);
    }
  };

  const handleModeSwitch = (newMode: InterviewMode) => {
    if (newMode === interviewMode || isAIThinking) return;

    // Switching FROM audio: cleanup is handled by useVoiceActivity's interviewMode effect
    if (interviewMode === "audio") {
      setHasSpoken(false);
    }

    setInterviewMode(newMode);

    // Switching TO chat: ensure current question is in chat messages
    if (newMode === "chat" && currentQuestion) {
      setChatMessages((prev) => {
        const lastAI = prev.filter((m) => m.role === "ai").pop();
        if (lastAI?.content !== currentQuestion) {
          return [...prev, { role: "ai", content: currentQuestion }];
        }
        return prev;
      });
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
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

          {/* Divider */}
          <div
            className="w-px h-4"
            style={{ background: "var(--md-sys-color-outline-variant)" }}
          />

          {/* Exit button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 transition-all duration-200"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
            aria-label="Exit interview"
          >
            <X size={16} />
            <span className="text-xs font-medium">Exit</span>
          </button>
        </motion.div>
      </div>

      {/* ── MODE SELECTOR — segmented control ────────────────── */}
      <div className="w-full flex justify-center pt-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="flex items-center rounded-full p-1 gap-1"
          style={{
            background: "var(--md-sys-color-surface-container)",
            border: "1px solid var(--md-sys-color-outline-variant)",
          }}
        >
          {([
            { id: "audio" as InterviewMode, label: "Audio", icon: <Mic size={14} /> },
            { id: "chat" as InterviewMode, label: "Chat", icon: <MessageSquare size={14} /> },
            { id: "video" as InterviewMode, label: "Video", icon: <Video size={14} />, disabled: true },
          ]).map((mode) => {
            const isActive = interviewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => !mode.disabled && handleModeSwitch(mode.id)}
                disabled={mode.disabled || isAIThinking}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={
                  mode.disabled
                    ? {
                        color: "var(--md-sys-color-on-surface-variant)",
                        opacity: 0.3,
                        cursor: "not-allowed",
                      }
                    : isActive
                    ? {
                        background: "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                        color: "var(--md-sys-color-primary)",
                        border: "1px solid color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent)",
                        boxShadow: "0 0 12px color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)",
                      }
                    : {
                        color: "var(--md-sys-color-on-surface-variant)",
                        border: "1px solid transparent",
                      }
                }
              >
                {mode.icon}
                {mode.label}
                {mode.disabled && (
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-0.5"
                    style={{
                      background: "var(--md-sys-color-surface-container-high)",
                      color: "var(--md-sys-color-on-surface-variant)",
                      opacity: 0.6,
                    }}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* ── CENTER — Question text (Audio mode) ────────────── */}
      {interviewMode === "audio" && (
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
      )}

      {/* ── CENTER — Chat thread (Chat mode) ──────────────── */}
      {interviewMode === "chat" && (
        <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto relative z-10 pt-4 pb-4 px-4 min-h-0">
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1 scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "var(--md-sys-color-outline-variant) transparent" }}
          >
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i === chatMessages.length - 1 ? 0.1 : 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "ai"
                      ? {
                          background: "var(--md-sys-color-surface-container)",
                          border: "1px solid var(--md-sys-color-outline-variant)",
                          color: "var(--md-sys-color-on-surface)",
                          borderBottomLeftRadius: "6px",
                        }
                      : {
                          background: "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent)",
                          color: "var(--md-sys-color-on-surface)",
                          borderBottomRightRadius: "6px",
                        }
                  }
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BrainCircuit size={12} style={{ color: "var(--md-sys-color-primary)" }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--md-sys-color-primary)" }}>
                        Interviewer
                      </span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isAIThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                  style={{
                    background: "var(--md-sys-color-surface-container)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                    borderBottomLeftRadius: "6px",
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--md-sys-color-primary)" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: dot * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="pt-3">
            <div
              className="flex items-end gap-2 rounded-2xl px-4 py-3"
              style={{
                background: "var(--md-sys-color-surface-container)",
                border: "1px solid var(--md-sys-color-outline-variant)",
              }}
            >
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Type your answer..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "var(--md-sys-color-on-surface)",
                  maxHeight: "120px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
                disabled={isAIThinking}
              />
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isAIThinking}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={
                  chatInput.trim() && !isAIThinking
                    ? {
                        background: "var(--md-sys-color-primary)",
                        color: "var(--md-sys-color-on-primary)",
                        boxShadow: "0 2px 8px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                      }
                    : {
                        background: "var(--md-sys-color-surface-container-high)",
                        color: "var(--md-sys-color-on-surface-variant)",
                        opacity: 0.4,
                        cursor: "not-allowed",
                      }
                }
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM DOCK — floating glass pill (Audio mode) ──── */}
      {interviewMode === "audio" && (
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
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />

      {/* Exit confirmation modal */}
      <AnimatePresence>
        {showExitModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowExitModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div
                className="glass-card-raised rounded-2xl p-8 w-full max-w-sm pointer-events-auto"
                style={{ border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertTriangle size={22} className="text-rose-400" />
                </div>

                <h3 className="text-lg font-semibold text-white/90 text-center mb-2">
                  Exit Interview?
                </h3>
                <p className="text-sm text-white/50 text-center mb-7 leading-relaxed">
                  Your progress will be lost and this session cannot be resumed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: "var(--md-sys-color-surface-container)",
                      border: "1px solid var(--md-sys-color-outline-variant)",
                      color: "var(--md-sys-color-on-surface-variant)",
                    }}
                  >
                    Keep Going
                  </button>
                  <button
                    onClick={handleExitConfirm}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                      boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
                      color: "#ffffff",
                    }}
                  >
                    Exit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
