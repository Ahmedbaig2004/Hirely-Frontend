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
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { StartFlowBackdrop } from "@/components/start/StartFlowBackdrop";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { VoiceVisualizer } from "./ui/voice-visualizer";
import { useCoordinatedQuestionText } from "../hooks/useCoordinatedQuestionText";

function submitAnswerErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error ?? err.message ?? "Failed to submit answer";
  }
  if (err instanceof Error) return err.message;
  return "Failed to submit answer";
}

const SESSION_TIPS = [
  "Structure answers: one sentence to frame, then a few crisp supporting points.",
  "If a question is broad, name your role, goal, and outcome before the details.",
  "Silence is fine—one breath beats rambling. The mic stays open until you tap Done.",
] as const;

type ProcessingStage =
  | "evaluating"
  | "analyzing_voice"
  | "generating_report"
  | "done";

type ChatMessage = {
  role: "ai" | "user";
  content: string;
};

const REPORT_BUILDER_TIPS = [
  "Your report blends what you said with how you said it—clarity and pace matter for hiring signals.",
  "Audio samples are processed in order; the bar reflects real queue progress, not a guess.",
  "You will land on a dashboard with scores, talk-time, and question-by-question notes.",
] as const;

export default function InterviewPanel() {
  const router = useRouter();

  // 1. Get State
  const {
    sessionId,
    currentQuestion,
    questionCount,
    setQuestion,
    setQuestionCount,
    setFeedback,
    firstQuestionAudio,
    firstQuestionAudioMime,
    setFirstQuestionAudio,
    isTtsEnabled,
    toggleTts,
    resetSession,
    interviewMode,
    interviewType,
    config,
    selectedMicId,
    selectedCameraId,
  } = useInterviewStore();

  // 2. Local State
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  // Audio State
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Exit modal state
  const [showExitModal, setShowExitModal] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Report Processing State
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState({
    completed: 0,
    total: 9,
  });
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>("evaluating");
  const [voiceRetryCount, setVoiceRetryCount] = useState(0);
  const [finalizeRetryCount, setFinalizeRetryCount] = useState(0);

  // Track whether any audio turns have been submitted (for smart finalization)
  const [hasAudioTurns, setHasAudioTurns] = useState(false);
  const [reportTipIdx, setReportTipIdx] = useState(0);
  const [sessionTipIdx, setSessionTipIdx] = useState(0);

  // Abort ref for voice polling — set to true on unmount to stop recursive setTimeout
  const pollingAbortRef = useRef(false);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceRetryRef = useRef(0);
  const finalizeRetryRef = useRef(0);
  const MAX_POLL_RETRIES = 125;
  useEffect(() => {
    return () => {
      pollingAbortRef.current = true;
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isProcessingReport) return;
    setReportTipIdx(0);
    const t = setInterval(() => {
      setReportTipIdx((i) => (i + 1) % REPORT_BUILDER_TIPS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [isProcessingReport]);

  /** Hard fallback if primary redirect never runs (e.g. rare promise/timer issues). */
  useEffect(() => {
    if (!isProcessingReport || processingStage !== "done" || !sessionId) return;
    const id = window.setTimeout(() => {
      router.replace(`/dashboard/${sessionId}`);
    }, 8000);
    return () => window.clearTimeout(id);
  }, [isProcessingReport, processingStage, sessionId, router]);

  useEffect(() => {
    if (interviewMode !== "audio" && interviewMode !== "video") return;
    const t = setInterval(() => {
      setSessionTipIdx((i) => (i + 1) % SESSION_TIPS.length);
    }, 8000);
    return () => clearInterval(t);
  }, [interviewMode]);

  // 3. Hooks
  const {
    isRecording,
    volume,
    isCameraReady,
    getAudioBlob,
    resetRecorder,
    stopRecordingManual,
    startVideoRecording,
    stopVideoRecording,
    setVideoPreviewElement,
  } = useVoiceActivity(
    isAIThinking,
    interviewMode,
    selectedMicId,
    selectedCameraId,
  );
  const prevRecordingState = useRef(false);

  const typewriterEnabled =
    interviewMode === "audio" || interviewMode === "video";
  const syncToAudioTts = isTtsEnabled && !!currentAudioData;
  const { displayedText, isComplete: isQuestionTextRevealed } =
    useCoordinatedQuestionText(currentQuestion, {
      syncToAudio: syncToAudioTts,
      audioRef,
      isAudioActive: isPlaying,
      typewriterEnabled,
      msPerChar: 20,
    });

  // ─────────────────────────────────────────────────────────────
  // LOGIC SECTIONS (Startup, Audio, Submission)
  // ─────────────────────────────────────────────────────────────
  const playAudio = useCallback(
    async (base64String: string, mime?: string | null) => {
      if (!audioRef.current || !isTtsEnabled) return;

      const audioMime = mime || "audio/mpeg";

      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current.src = `data:${audioMime};base64,${base64String}`;
        audioRef.current.load();

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

        setIsPlaying(true);

        try {
          await audioRef.current.play();
        } catch (err: unknown) {
          const isAbort =
            (err instanceof DOMException && err.name === "AbortError") ||
            (err instanceof Error && err.message.includes("interrupted"));
          if (isAbort) {
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
    },
    [isTtsEnabled, resetRecorder],
  );

  useEffect(() => {
    if (firstQuestionAudio && isTtsEnabled) {
      setIsAIThinking(true);
      setCurrentAudioData(firstQuestionAudio);
      void playAudio(firstQuestionAudio, firstQuestionAudioMime);
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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isRecording) {
      setHasSpoken(true);
      // Start video recording alongside audio when in video mode
      if (interviewMode === "video") {
        startVideoRecording();
      }
    }
  }, [isRecording]);

  useEffect(() => {
    if (
      !isAIThinking &&
      prevRecordingState.current === true &&
      isRecording === false &&
      (interviewMode === "audio" || interviewMode === "video")
    ) {
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  // ─────────────────────────────────────────────────────────────
  // VOICE PROGRESS POLLING + FINALIZATION
  // ─────────────────────────────────────────────────────────────
  const pollVoiceProgress = useCallback(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";

    pollingAbortRef.current = false;
    voiceRetryRef.current = 0;
    finalizeRetryRef.current = 0;
    setVoiceRetryCount(0);
    setFinalizeRetryCount(0);

    const handlePollTimeout = () => {
      if (pollingAbortRef.current) return;
      pollingAbortRef.current = true;
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
      toast.error(
        "Report generation is taking longer than expected. We'll notify you when it's ready.",
      );
      router.push("/dashboard");
    };

    const bumpVoiceRetry = () => {
      voiceRetryRef.current += 1;
      setVoiceRetryCount(voiceRetryRef.current);
      if (voiceRetryRef.current >= MAX_POLL_RETRIES) {
        handlePollTimeout();
        return true;
      }
      return false;
    };

    const bumpFinalizeRetry = () => {
      finalizeRetryRef.current += 1;
      setFinalizeRetryCount(finalizeRetryRef.current);
      if (finalizeRetryRef.current >= MAX_POLL_RETRIES) {
        handlePollTimeout();
        return true;
      }
      return false;
    };

    const poll = async () => {
      if (pollingAbortRef.current) return;
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/voice-progress/${sessionId}`,
        );
        if (pollingAbortRef.current) return;
        const sampleDone =
          typeof data.samplesCompleted === "number"
            ? data.samplesCompleted
            : data.completed + (data.video?.completed ?? 0);
        const sampleTotal =
          typeof data.samplesTotal === "number"
            ? data.samplesTotal
            : data.total + (data.video?.total ?? 0);
        setVoiceProgress({ completed: sampleDone, total: sampleTotal });

        if (data.allDone) {
          setProcessingStage("generating_report");
          seedFinalizeReportProgress();
          try {
            await axios.post(`${backendUrl}/api/finalize-interview`, {
              sessionId,
            });
            if (pollingAbortRef.current) return;
            // Poll finalize status until completed/failed
            const pollStatus = async () => {
              if (pollingAbortRef.current) return;
              try {
                const { data: statusData } = await axios.get(
                  `${backendUrl}/api/finalize-status/${sessionId}`,
                );
                if (pollingAbortRef.current) return;
                if (statusData.status === "completed") {
                  setProcessingStage("done");
                  setTimeout(
                    () => router.replace(`/dashboard/${sessionId}`),
                    1200,
                  );
                } else if (statusData.status === "failed") {
                  toast.error(
                    statusData.error ||
                      "Failed to generate report. Please try again.",
                  );
                  setTimeout(
                    () => router.replace(`/dashboard/${sessionId}`),
                    2000,
                  );
                } else {
                  mergeFinalizeProgressFromResponse(
                    statusData as Record<string, unknown>,
                  );
                  if (bumpFinalizeRetry()) return;
                  pollingTimerRef.current = setTimeout(pollStatus, 2000);
                }
              } catch {
                if (pollingAbortRef.current) return;
                if (bumpFinalizeRetry()) return;
                pollingTimerRef.current = setTimeout(pollStatus, 3000);
              }
            };
            pollStatus();
            return;
          } catch (finalizeErr: unknown) {
            if (pollingAbortRef.current) return;
            console.error("Finalize error:", finalizeErr);
            toast.error("Failed to generate report. Please try again.");
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 2000);
          }
        } else {
          if (bumpVoiceRetry()) return;
          pollingTimerRef.current = setTimeout(poll, 2000);
        }
      } catch (err) {
        if (pollingAbortRef.current) return;
        console.error("Polling error:", err);
        if (bumpVoiceRetry()) return;
        pollingTimerRef.current = setTimeout(poll, 3000);
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

    // In video mode, also attach the video blob
    if (interviewMode === "video") {
      const videoBlob = await stopVideoRecording();
      if (videoBlob.size > 0) {
        formData.append("video", videoBlob);
        formData.append("answerMode", "video");
      }
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/submit-answer`, formData);
      const { nextQuestion, isFinished, audio, audioMime, transcript } =
        res.data;
      setHasAudioTurns(true);

      // Sync audio transcript into chat history so switching to chat shows full conversation
      if (transcript) {
        setChatMessages((prev) => [
          ...prev,
          { role: "user", content: transcript },
        ]);
      }

      if (isFinished) {
        setIsProcessingReport(true);
        setProcessingStage("analyzing_voice");
        pollVoiceProgress();
        return;
      }

      setQuestion(nextQuestion?.question);
      setQuestionCount(questionCount + 1);

      // Add next AI question to chat history
      if (nextQuestion?.question) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: nextQuestion.question },
        ]);
      }

      if (audio) setCurrentAudioData(audio);
      else setCurrentAudioData(null);

      if (audio && isTtsEnabled) {
        void playAudio(audio, audioMime);
      } else {
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      }
    } catch (err: unknown) {
      const errorMsg = submitAnswerErrorMessage(err);
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

  useEffect(() => {
    if (interviewMode !== "audio" && interviewMode !== "video") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if (!hasSpoken || isAIThinking) return;

      const active = document.activeElement as HTMLElement | null;
      if (active) {
        const tag = active.tagName.toLowerCase();
        const isTypingTarget =
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          active.isContentEditable;
        if (isTypingTarget) return;
      }

      event.preventDefault();
      void handleManualStop();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [interviewMode, hasSpoken, isAIThinking]);

  // ─────────────────────────────────────────────────────────────
  // CHAT MODE SUBMISSION
  // ─────────────────────────────────────────────────────────────
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isAIThinking) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setIsAIThinking(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/submit-answer`, {
        sessionId,
        question: currentQuestion,
        answer: userMessage,
      });
      const { nextQuestion, isFinished } = res.data;

      if (isFinished) {
        setIsProcessingReport(true);
        if (hasAudioTurns) {
          setProcessingStage("analyzing_voice");
          pollVoiceProgress();
        } else {
          setProcessingStage("generating_report");
          // CONFLICT 1 RESOLVED: keep HEAD — initializes finalize progress properly
          seedFinalizeReportProgress();
          setVoiceProgress({ completed: 0, total: 0 });
          const backendUrl2 =
            process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
          try {
            await axios.post(`${backendUrl2}/api/finalize-interview`, {
              sessionId,
            });
            finalizeRetryRef.current = 0;
            setFinalizeRetryCount(0);
            const handleFinalizeTimeout = () => {
              if (pollingAbortRef.current) return;
              pollingAbortRef.current = true;
              if (pollingTimerRef.current)
                clearTimeout(pollingTimerRef.current);
              toast.error(
                "Report generation is taking longer than expected. We'll notify you when it's ready.",
              );
              router.push("/dashboard");
            };
            const bumpFinalizeRetry = () => {
              finalizeRetryRef.current += 1;
              setFinalizeRetryCount(finalizeRetryRef.current);
              if (finalizeRetryRef.current >= MAX_POLL_RETRIES) {
                handleFinalizeTimeout();
                return true;
              }
              return false;
            };
            // Poll finalize status until completed/failed
            const pollFinalizeStatus = async () => {
              if (pollingAbortRef.current) return;
              try {
                const { data: statusData } = await axios.get(
                  `${backendUrl2}/api/finalize-status/${sessionId}`,
                );
                if (pollingAbortRef.current) return;
                if (statusData.status === "completed") {
                  setProcessingStage("done");
                  setTimeout(
                    () => router.replace(`/dashboard/${sessionId}`),
                    1200,
                  );
                } else if (statusData.status === "failed") {
                  toast.error(
                    statusData.error ||
                      "Failed to generate report. Please try again.",
                  );
                  setTimeout(
                    () => router.replace(`/dashboard/${sessionId}`),
                    2000,
                  );
                } else {
                  mergeFinalizeProgressFromResponse(
                    statusData as Record<string, unknown>,
                  );
                  if (bumpFinalizeRetry()) return;
                  pollingTimerRef.current = setTimeout(
                    pollFinalizeStatus,
                    2000,
                  );
                }
              } catch {
                if (pollingAbortRef.current) return;
                if (bumpFinalizeRetry()) return;
                pollingTimerRef.current = setTimeout(pollFinalizeStatus, 3000);
              }
            };
            pollFinalizeStatus();
          } catch (finalizeErr: unknown) {
            console.error("Finalize error:", finalizeErr);
            toast.error("Failed to generate report. Please try again.");
            setTimeout(() => router.replace(`/dashboard/${sessionId}`), 2000);
          }
        }
        return;
      }

      setQuestion(nextQuestion?.question);
      setQuestionCount(questionCount + 1);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: nextQuestion?.question },
      ]);
      setIsAIThinking(false);
    } catch (err: unknown) {
      const errorMsg = submitAnswerErrorMessage(err);
      toast.error(`Error: ${errorMsg}`);
      setIsAIThinking(false);
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
    const reportPct =
      finalizeReportProgress.total > 0
        ? Math.min(
            100,
            Math.round(
              (finalizeReportProgress.evaluated /
                finalizeReportProgress.total) *
                100,
            ),
          )
        : 0;
    const retryTelemetry = voiceRetryCount + finalizeRetryCount;

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
      // CONFLICT 2 RESOLVED: use incoming — simple and no undefined hasVoiceStage
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
    const overallPct = Math.min(
      100,
      ((currentIdx + 1) / stageOrder.length) * 100,
    );

    return (
      <div
        className="relative z-10 flex min-h-[calc(100dvh-var(--app-report-page-pt))] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
        data-retry-count={retryTelemetry}
      >
        <StartFlowBackdrop className="z-0" />
        {/* Ambient orb — soft wash under the modal */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[0] flex items-center justify-center"
        >
          <motion.div
            className="blur-[160px]"
            animate={{
              opacity: processingStage === "done" ? 0.18 : 0.1,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              width: 560,
              height: 560,
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
          className="relative z-[2] w-full max-w-lg rounded-3xl border border-white/10 glass-card-raised p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 text-center sm:mb-7">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
                boxShadow:
                  "0 0 30px color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)",
              }}
            >
              <BrainCircuit
                size={26}
                style={{ color: "var(--md-sys-color-primary)" }}
              />
            </motion.div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Building your report
            </h2>
            <p className="mt-1.5 text-xs tracking-wide text-slate-600 dark:text-slate-400">
              Analyzing your full interview session
            </p>
          </div>

          <div className="mb-7 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800/90">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-teal-400"
              initial={{ width: "0%" }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
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
                  className={`flex items-start gap-3.5 rounded-2xl transition-colors ${
                    stage.key === "done" ? "mt-8 sm:mt-9" : ""
                  } ${
                    isActive
                      ? "bg-slate-50/80 p-2.5 -m-2.5 sm:p-3 sm:-m-3 dark:bg-slate-900/50"
                      : ""
                  }`}
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
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          ease: "linear",
                        }}
                      >
                        <Loader2
                          size={14}
                          style={{ color: "var(--md-sys-color-primary)" }}
                        />
                      </motion.div>
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            "var(--md-sys-color-surface-container-high)",
                        }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium transition-colors duration-500"
                      style={{
                        color: isCompleted
                          ? "#059669"
                          : isActive
                            ? "var(--md-sys-color-on-surface)"
                            : "var(--md-sys-color-on-surface-variant)",
                      }}
                    >
                      {stage.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 transition-colors duration-500 dark:text-slate-400">
                      {stage.subtitle}
                    </p>
                    {stage.key === "generating_report" &&
                      finalizeReportProgress.total > 0 && (
                        <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                          {finalizeReportProgress.evaluated} of{" "}
                          {finalizeReportProgress.total} questions evaluated
                        </p>
                      )}

                    {/* Voice analysis progress bar */}
                    {stage.key === "analyzing_voice" &&
                      (isActive || isCompleted) && (
                        <div className="mt-2.5 flex items-center gap-2.5">
                          <div
                            className="flex-1 h-1 rounded-full overflow-hidden"
                            style={{
                              background:
                                "var(--md-sys-color-surface-container-high)",
                            }}
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
                            className={`text-xs font-mono shrink-0 tabular-nums ${isCompleted ? "text-emerald-600" : "text-teal-700 dark:text-teal-400"}`}
                          >
                            {isCompleted ? "100" : pct}%
                          </span>
                        </div>
                      )}
                    {stage.key === "generating_report" &&
                      (isActive || isCompleted) &&
                      finalizeReportProgress.total > 0 && (
                        <div className="mt-2.5 flex items-center gap-2.5">
                          <div
                            className="flex-1 h-1 rounded-full overflow-hidden"
                            style={{
                              background:
                                "var(--md-sys-color-surface-container-high)",
                            }}
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
                              animate={{
                                width: `${isCompleted ? 100 : reportPct}%`,
                              }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                          <span
                            className={`text-xs font-mono shrink-0 tabular-nums ${isCompleted ? "text-emerald-600" : "text-violet-700 dark:text-violet-400"}`}
                          >
                            {isCompleted ? "100" : reportPct}%
                          </span>
                        </div>
                      )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-7 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/[0.1] dark:bg-slate-950/[0.92] dark:backdrop-blur-xl dark:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.45)]">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-500/25">
                <Lightbulb
                  className="h-4 w-4 text-violet-600 dark:text-violet-300"
                  strokeWidth={2}
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Did you know
              </span>
            </div>
            <p className="min-h-[2.75rem] text-sm leading-relaxed text-slate-600 dark:text-slate-100">
              {REPORT_BUILDER_TIPS[reportTipIdx % REPORT_BUILDER_TIPS.length]}
            </p>
            <div className="mt-3 flex gap-1.5">
              {REPORT_BUILDER_TIPS.map((_, j) => (
                <div
                  key={j}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    j === reportTipIdx % REPORT_BUILDER_TIPS.length
                      ? "bg-violet-500/80"
                      : "bg-slate-200 dark:bg-slate-600/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // NORMAL INTERVIEW RENDER
  // ─────────────────────────────────────────────────────────────
  const totalPlanned = config?.questionCount;
  /** 1-based index; clamp so UI never shows e.g. "3 / 1" if storage was inconsistent. */
  const displayQuestionNum =
    totalPlanned != null && totalPlanned > 0
      ? Math.min(Math.max(1, questionCount), totalPlanned)
      : Math.max(1, questionCount);

  return (
    <div className="relative z-10 flex min-h-[calc(100dvh-var(--app-report-page-pt))] flex-col items-center">
      <StartFlowBackdrop className="fixed z-0 opacity-[0.3] dark:opacity-[0.16]" />
      {/* Dynamic ambient orb — color shifts with interview state */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
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
      <div className="w-full flex justify-center pt-2 pb-0 relative z-10">
        <motion.div
          key="interview-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-6 px-5 py-2.5 rounded-full glass-card"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          {/* Question counter + progress */}
          <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="label-caps text-slate-600 dark:text-slate-400">
                Question
              </span>
              <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {displayQuestionNum}
                {totalPlanned != null && (
                  <span className="text-slate-500 font-semibold">
                    {" "}
                    / {totalPlanned}
                  </span>
                )}
              </span>
            </div>
            {totalPlanned != null && totalPlanned > 0 && (
              <div
                className="h-1 w-full min-w-[88px] max-w-[120px] overflow-hidden rounded-full sm:mt-0"
                style={{
                  background: "var(--md-sys-color-surface-container-high)",
                }}
                title="Progress through this session"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, (displayQuestionNum / totalPlanned) * 100)}%`,
                    background:
                      "linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))",
                  }}
                />
              </div>
            )}
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
            style={{
              color: isTtsEnabled
                ? "var(--md-sys-color-tertiary)"
                : "var(--md-sys-color-on-surface-variant)",
            }}
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

      {/* ── CENTER — Question text (Audio mode) ────────────── */}
      {interviewMode === "audio" && (
        <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 lg:flex-row lg:items-stretch lg:gap-6 lg:px-6">
          <div className="min-h-0 min-w-0 flex-1">
            <div
              className="glass-card-raised h-full overflow-hidden rounded-3xl p-5 sm:p-7"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--md-sys-color-outline) 20%, transparent)",
              }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/12 dark:bg-cyan-500/15">
                    <MessageSquare
                      className="h-4 w-4 text-cyan-700 dark:text-cyan-300"
                      strokeWidth={2.2}
                    />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Current question
                    </p>
                    {interviewType && (
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {interviewType === "job-specific"
                          ? "Role & resume–aware"
                          : interviewType === "technical"
                            ? "Technical"
                            : "Behavioral"}{" "}
                        session
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[0.7rem] font-medium text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Live
                </div>
              </div>
              <AnimatePresence mode="wait">
                {currentQuestion ? (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[5rem] text-left text-2xl font-medium leading-[1.45] text-slate-900 sm:min-h-[6rem] sm:text-3xl dark:text-slate-100"
                    aria-live="polite"
                  >
                    {displayedText}
                    {!isQuestionTextRevealed && (
                      <span
                        className="ml-0.5 inline-block h-6 w-0.5 translate-y-0.5 animate-pulse bg-cyan-600 dark:bg-cyan-400"
                        aria-hidden
                      />
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <aside className="flex w-full flex-col gap-3 lg:max-w-[300px] lg:shrink-0">
            <div
              className="glass-card flex flex-1 flex-col justify-between gap-2 rounded-2xl border border-white/10 p-4"
              style={{
                background: "var(--md-sys-color-surface-container-low)",
              }}
            >
              <div>
                <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Pro tip
                </p>
                <p className="min-h-[4.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {SESSION_TIPS[sessionTipIdx % SESSION_TIPS.length]}
                </p>
              </div>
              <div className="flex gap-1">
                {SESSION_TIPS.map((_, j) => (
                  <div
                    key={j}
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      j === sessionTipIdx % SESSION_TIPS.length
                        ? "bg-cyan-500/80"
                        : "bg-slate-200/90 dark:bg-slate-600/80"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-300/60 bg-slate-50/50 p-3 text-xs leading-relaxed text-slate-600 dark:border-slate-600/50 dark:bg-slate-900/30 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                How this works:{" "}
              </span>
              Read the question, then use the control below. Your mic turns on
              when the question has been read. Tap <strong>Done</strong> when
              you have finished that answer.
            </div>
          </aside>
        </div>
      )}

      {/* ── CENTER — Chat thread (Chat mode) ──────────────── */}
      {interviewMode === "chat" && (
        <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto relative z-10 pt-4 pb-4 px-4 min-h-0">
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--md-sys-color-outline-variant) transparent",
            }}
          >
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i === chatMessages.length - 1 ? 0.1 : 0,
                }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed text-slate-800 dark:text-slate-100"
                  style={
                    msg.role === "ai"
                      ? {
                          background: "var(--md-sys-color-surface-container)",
                          border:
                            "1px solid var(--md-sys-color-outline-variant)",
                          borderBottomLeftRadius: "6px",
                        }
                      : {
                          background:
                            "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                          border:
                            "1px solid color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent)",
                          borderBottomRightRadius: "6px",
                        }
                  }
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BrainCircuit
                        size={12}
                        className="text-cyan-700 dark:text-cyan-400"
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
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
                      className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400"
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
                className="flex-1 resize-none bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                style={{
                  maxHeight: "120px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 120) + "px";
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
                        boxShadow:
                          "0 2px 8px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                      }
                    : {
                        background:
                          "var(--md-sys-color-surface-container-high)",
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

      {/* ── CENTER — Video mode (question + camera preview) ── */}
      {interviewMode === "video" && (
        <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-stretch justify-center gap-5 px-4 py-6 sm:px-6">
          {currentQuestion && (
            <motion.div
              key={currentQuestion}
              className="glass-card-raised w-full max-w-3xl self-center rounded-2xl border border-white/10 p-4 sm:p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="mb-1.5 text-left text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                Current question
              </p>
              <p
                className="text-left text-lg font-medium leading-relaxed text-slate-900 sm:text-2xl dark:text-slate-100"
                aria-live="polite"
              >
                {displayedText}
                {!isQuestionTextRevealed && (
                  <span
                    className="ml-0.5 inline-block h-5 w-0.5 translate-y-0.5 animate-pulse bg-cyan-600 dark:bg-cyan-400"
                    aria-hidden
                  />
                )}
              </p>
            </motion.div>
          )}
          <div className="relative aspect-video w-full max-w-2xl self-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl">
            <video
              ref={(el) => setVideoPreviewElement(el)}
              autoPlay
              playsInline
              muted
              className="mirror h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <Loader2 className="animate-spin text-white/50" size={32} />
              </div>
            )}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/80 text-white text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                REC
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BOTTOM DOCK — floating glass pill (Audio/Video mode) ──── */}
      {(interviewMode === "audio" || interviewMode === "video") && (
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
                        border:
                          "1px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                        boxShadow:
                          "0 0 16px color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
                      }}
                    />
                    {/* Inner orb */}
                    <div
                      className="w-8 h-8 rounded-full orb-breathe flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-primary) 50%, transparent), color-mix(in srgb, var(--md-sys-color-primary-container) 25%, transparent))",
                        boxShadow:
                          "0 0 20px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
                      }}
                    >
                      <BrainCircuit
                        size={14}
                        className="text-cyan-900 dark:text-cyan-100"
                      />
                    </div>
                  </div>
                  <span className="label-caps text-cyan-800 dark:text-cyan-300">
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
                        style={{
                          border:
                            "1px solid color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent)",
                        }}
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
                        background:
                          "radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent), color-mix(in srgb, var(--md-sys-color-tertiary) 12%, transparent))",
                        border:
                          "1px solid color-mix(in srgb, var(--md-sys-color-tertiary) 45%, transparent)",
                        boxShadow:
                          "0 0 18px color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent)",
                      }}
                    >
                      <Mic
                        size={14}
                        className="text-teal-700 dark:text-teal-300"
                      />
                    </div>
                  </div>
                  <span className="label-caps text-teal-800 dark:text-teal-300">
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
                  <span className="label-caps text-slate-600 dark:text-slate-400">
                    Ready — start speaking
                  </span>
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
                      color: "rgb(71, 85, 105)",
                      opacity: 0.55,
                      cursor: "not-allowed",
                    }
              }
            >
              <CheckCircle size={16} />
              Done Speaking
            </motion.button>
            <div
              className="rounded-xl px-3 py-2"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent), color-mix(in srgb, var(--md-sys-color-tertiary) 8%, transparent))",
                border:
                  "1px solid color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
              }}
            >
              <p className="text-[11px] lp-sub text-center opacity-95">
                Press{" "}
                <kbd
                  className="mx-1 rounded-md px-2 py-1 text-[10px] font-bold"
                  style={{
                    background: "var(--md-sys-color-surface-container-high)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                    color: "var(--md-sys-color-on-surface)",
                    boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.08)",
                  }}
                >
                  Space
                </kbd>{" "}
                to submit and continue
              </p>
            </div>
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
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
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
                className="glass-card-raised rounded-3xl p-8 w-full max-w-md pointer-events-auto"
                style={{
                  border:
                    "1px solid color-mix(in srgb, #ef4444 25%, var(--md-sys-color-outline-variant))",
                  boxShadow:
                    "0 24px 60px rgba(2,6,23,0.42), 0 0 0 1px color-mix(in srgb, #ef4444 18%, transparent), inset 0 1px 0 rgba(255,255,255,0.16)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(248,113,113,0.3), rgba(239,68,68,0.12))",
                    border: "1px solid rgba(239,68,68,0.35)",
                    boxShadow: "0 8px 24px rgba(239,68,68,0.18)",
                  }}
                >
                  <AlertTriangle size={24} className="text-rose-400" />
                </div>

                <h3 className="text-2xl font-semibold lp-hi text-center mb-2">
                  Exit Interview?
                </h3>
                <p className="text-sm lp-muted text-center mb-2 leading-relaxed">
                  Your progress will be lost and this session cannot be resumed.
                </p>
                <p className="text-xs text-center mb-7 text-slate-500 dark:text-slate-400">
                  You can stay and finish this question, or leave now.
                </p>

                <div className="flex gap-3">
                  {/* CONFLICT 3 RESOLVED: use incoming — no undefined clearPending() */}
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: "var(--md-sys-color-surface-container-high)",
                      border:
                        "1px solid color-mix(in srgb, var(--md-sys-color-outline) 65%, transparent)",
                      color: "var(--md-sys-color-on-surface)",
                    }}
                  >
                    Keep Going
                  </button>
                  <button
                    onClick={handleExitConfirm}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444, #dc2626 55%, #b91c1c)",
                      boxShadow: "0 10px 20px rgba(239,68,68,0.35)",
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
