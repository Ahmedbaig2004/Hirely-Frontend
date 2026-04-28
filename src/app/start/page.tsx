"use client";

import { useState, useRef, useEffect, useId, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore, InterviewType, InterviewMode } from "@/stores/useInterviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileUpload } from "@/components/ui/file-upload";
import { InterviewTypeSidebar } from "@/components/start/InterviewTypeSidebar";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Zap, FileText, Sparkles, BarChart, MessageSquare,
  CheckCircle, ChevronRight, Loader2, Minus, Plus,
  Mic, Video, MessageCircle, Camera, Lightbulb, ChevronDown, ScanEye,
} from "lucide-react";
import { StartFlowBackdrop } from "@/components/start/StartFlowBackdrop";
import {
  MatchScoreRing,
  StepProgressRing,
  IndeterminateFlowRing,
} from "@/components/start/StartFlowGauges";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type StartStage = "form" | "loading" | "analysis" | "camera-check" | "launching";

interface AnalysisData {
  candidateSummary: string | null;
  gapAnalysis: { matchScore: number; missingSkills: string[]; feedback: string } | null;
}

const STACKS = [
  "React", "Node.js", "Python", "Java", "Go",
  "TypeScript", "SQL", "C++", "AWS / Cloud", "Android", "iOS",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QUESTION_COUNTS = [5, 8, 10] as const;

const JOB_SPECIFIC_LOADING_STEPS = [
  { label: "Parsing your resume...",             Icon: FileText      },
  { label: "Identifying skills & experience...", Icon: Sparkles      },
  { label: "Comparing with job requirements...", Icon: BarChart      },
  { label: "Generating interview questions...",  Icon: MessageSquare },
];

const GENERIC_LOADING_STEPS = [
  { label: "Preparing interview context...",    Icon: Sparkles      },
  { label: "Generating interview questions...", Icon: MessageSquare },
];

const SETUP_TITLE = "Set Up Your Interview";

const PREPARING_TIPS = [
  "Breathe at an even pace—clear reasoning matters more than speed.",
  "If you are unsure, think out loud. Your process is part of the answer.",
  "Listen to the full question, then take a one-beat pause to organize.",
  "STAR works well: Situation, Task, Action, Result—keep it tight.",
] as const;

const LAUNCH_TIPS = [
  "You will be able to re-read the question on screen while you answer.",
  "We save progress as you go—no need to rush the entire session.",
  "If audio ever drops, check your system mic in settings before retaking.",
] as const;

function CustomQuestionCountField({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
}) {
  const current =
    value != null && value >= 1 && value <= 10 ? value : 1;
  const setN = (next: number) => {
    const c = Math.min(10, Math.max(1, next));
    onChange(c);
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="label-caps whitespace-nowrap">Custom (1–10):</span>
      <div
        className="inline-flex items-stretch overflow-hidden rounded-xl ring-offset-2 ring-offset-white transition-shadow focus-within:ring-2 focus-within:ring-violet-500/45 dark:ring-offset-slate-900"
        style={{
          background: "var(--md-sys-color-surface-container-low)",
          border: "1px solid var(--md-sys-color-outline-variant)",
        }}
      >
        <button
          type="button"
          aria-label="Decrease question count"
          onClick={() => setN(current - 1)}
          disabled={current <= 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200/90 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <Minus className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <input
          type="number"
          min={1}
          max={10}
          value={value ?? ""}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!e.target.value) {
              onChange(undefined);
            } else if (v >= 1 && v <= 10) {
              onChange(v);
            }
          }}
          placeholder="1–10"
          className="h-9 w-14 [appearance:textfield] border-x border-[var(--md-sys-color-outline-variant)] bg-transparent py-1.5 text-center text-sm font-semibold tabular-nums text-on-surface outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label="Increase question count"
          onClick={() => setN(current + 1)}
          disabled={current >= 10}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200/90 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function StartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    setSessionId,
    setQuestion,
    setFirstQuestionAudio,
    interviewType,
    setInterviewType,
    config,
    setConfig,
    interviewerVoice,
    setInterviewerVoice,
    interviewMode,
    setInterviewMode,
    selectedMicId,
    setSelectedMicId,
    selectedCameraId,
    setSelectedCameraId,
  } = useInterviewStore();

  // Job-Specific fields
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("We need a Senior React Developer...");

  const [stage, setStage] = useState<StartStage>("form");
  const [loadingStep, setLoadingStep] = useState(0);
  const [flowTipIndex, setFlowTipIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Device enumeration + testing state
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [micTestActive, setMicTestActive] = useState(false);
  const [micTestVolume, setMicTestVolume] = useState(0);
  const [micTestCompleted, setMicTestCompleted] = useState(false);
  const [cameraTestActive, setCameraTestActive] = useState(false);
  const [devicePermissionGranted, setDevicePermissionGranted] = useState(false);
  const micTestStreamRef = useRef<MediaStream | null>(null);
  const micTestRafRef = useRef<number | null>(null);
  const cameraTestStreamRef = useRef<MediaStream | null>(null);
  const cameraPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Camera-check stage state
  const [cameraCheckStream, setCameraCheckStream] = useState<MediaStream | null>(null);
  const [cameraCheckLoading, setCameraCheckLoading] = useState(false);
  const cameraCheckVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraCheckStreamRef = useRef<MediaStream | null>(null);

  const loadingStepRef = useRef(0);
  const apiDoneRef = useRef(false);
  const apiResultRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter((d) => d.kind === "audioinput"));
      setVideoDevices(devices.filter((d) => d.kind === "videoinput"));
    } catch {
      // permissions not granted yet
    }
  }, []);

  const requestDevicePermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setDevicePermissionGranted(true);
      await enumerateDevices();
    } catch {
      toast.error("Microphone permission denied. Please allow access in your browser settings.");
    }
  }, [enumerateDevices]);

  useEffect(() => {
    if (interviewMode === "audio" || interviewMode === "video") {
      enumerateDevices();
    }
    return () => {
      stopMicTest(false);
      stopCameraTest();
    };
  }, [interviewMode, enumerateDevices]);

  useEffect(() => {
    if (stage === "camera-check") {
      startCameraCheck(selectedCameraId);
    } else {
      stopCameraCheck();
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicId ? { exact: selectedMicId } : undefined },
      });
      micTestStreamRef.current = stream;
      setMicTestActive(true);
      setDevicePermissionGranted(true);
      enumerateDevices();

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const check = () => {
        analyzer.getByteFrequencyData(dataArray);
        const vol = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicTestVolume(vol);
        micTestRafRef.current = requestAnimationFrame(check);
      };
      check();

      setTimeout(() => stopMicTest(true), 5000);
    } catch {
      toast.error("Could not access microphone.");
    }
  };

  const stopMicTest = (markComplete = false) => {
    if (micTestRafRef.current) cancelAnimationFrame(micTestRafRef.current);
    micTestStreamRef.current?.getTracks().forEach((t) => t.stop());
    micTestStreamRef.current = null;
    setMicTestActive(false);
    setMicTestVolume(0);
    if (markComplete) setMicTestCompleted(true);
  };

  useEffect(() => {
    setMicTestCompleted(false);
  }, [interviewMode, selectedMicId]);

  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined },
      });
      cameraTestStreamRef.current = stream;
      setCameraTestActive(true);
      setDevicePermissionGranted(true);
      enumerateDevices();

      if (cameraPreviewRef.current) {
        cameraPreviewRef.current.srcObject = stream;
      }

      setTimeout(() => stopCameraTest(), 8000);
    } catch {
      toast.error("Could not access camera.");
    }
  };

  const stopCameraTest = () => {
    cameraTestStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraTestStreamRef.current = null;
    setCameraTestActive(false);
    if (cameraPreviewRef.current) cameraPreviewRef.current.srcObject = null;
  };

  const startCameraCheck = async (deviceId?: string | null) => {
    setCameraCheckLoading(true);
    cameraCheckStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraCheckStreamRef.current = null;
    setCameraCheckStream(null);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter((d) => d.kind === "videoinput"));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      cameraCheckStreamRef.current = stream;
      setCameraCheckStream(stream);
      if (cameraCheckVideoRef.current) {
        cameraCheckVideoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("Could not access camera. Please check your camera permissions.");
    } finally {
      setCameraCheckLoading(false);
    }
  };

  const stopCameraCheck = () => {
    cameraCheckStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraCheckStreamRef.current = null;
    setCameraCheckStream(null);
  };

  const handleFileUpload = (files: File[]) => {
    setFile(files.length > 0 ? files[0] : null);
  };

  const handleTypeSelect = (type: InterviewType) => {
    setInterviewType(type);
    setStage("form");
  };

  const loadingSteps =
    interviewType === "job-specific" ? JOB_SPECIFIC_LOADING_STEPS : GENERIC_LOADING_STEPS;

  const prepareRingPct = useMemo(() => {
    if (loadingSteps.length === 0) return 0;
    return Math.min(100, ((loadingStep + 1) / loadingSteps.length) * 100);
  }, [loadingStep, loadingSteps.length]);

  useEffect(() => {
    if (stage !== "loading" && stage !== "launching") return;
    setFlowTipIndex(0);
    const pool = stage === "launching" ? LAUNCH_TIPS : PREPARING_TIPS;
    const t = setInterval(() => {
      setFlowTipIndex((i) => (i + 1) % pool.length);
    }, 5000);
    return () => clearInterval(t);
  }, [stage]);

  const tryAdvanceToAnalysis = (currentStep: number) => {
    if (apiDoneRef.current && currentStep >= loadingSteps.length - 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const result = apiResultRef.current;
      setAnalysisData(result.analysis);
      setSessionId(result.sessionId);
      setQuestion(result.firstQuestion.question);
      if (result.audio) setFirstQuestionAudio(result.audio, result.audioMime);
      setStage("analysis");
    }
  };

  const startInterview = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Validate per type
    if (interviewType === "job-specific") {
      if (!file) return toast.error("Please upload a resume first.");
      if (!jd.trim()) return toast.error("Please enter a job description.");
    } else if (interviewType === "technical") {
      if (!config.stack) return toast.error("Please select a stack.");
      if (!config.difficulty) return toast.error("Please select a difficulty.");
      if (!config.questionCount) return toast.error("Please select number of questions.");
    } else if (interviewType === "behavioral") {
      if (!config.difficulty) return toast.error("Please select a difficulty.");
      if (!config.questionCount) return toast.error("Please select number of questions.");
    }

    if ((interviewMode === "audio" || interviewMode === "video") && !micTestCompleted) {
      toast.error("Run the microphone test and let it finish before starting.");
      return;
    }

    apiDoneRef.current = false;
    apiResultRef.current = null;
    loadingStepRef.current = 0;
    setStage("loading");
    setLoadingStep(0);

    intervalRef.current = setInterval(() => {
      const next = Math.min(loadingStepRef.current + 1, loadingSteps.length - 1);
      loadingStepRef.current = next;
      setLoadingStep(next);
      tryAdvanceToAnalysis(next);
    }, 800);

    const formData = new FormData();
    formData.append("userId", user?.id ?? "");
    formData.append("interviewerVoice", interviewerVoice);
    formData.append("interviewMode", interviewMode);

    if (interviewType === "job-specific") {
      formData.append("interviewType", "JOB_SPECIFIC");
      formData.append("resume", file!);
      formData.append("jobDescription", jd);
    } else if (interviewType === "technical") {
      formData.append("interviewType", "TECHNICAL");
      formData.append("stack", config.stack!);
      formData.append("difficulty", config.difficulty!);
      formData.append("questionCount", String(config.questionCount!));
    } else if (interviewType === "behavioral") {
      formData.append("interviewType", "BEHAVIORAL");
      formData.append("difficulty", config.difficulty!);
      formData.append("questionCount", String(config.questionCount!));
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/init-interview`, formData);
      apiResultRef.current = res.data;
      apiDoneRef.current = true;
      tryAdvanceToAnalysis(loadingStepRef.current);
    } catch (err: any) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStage("form");
      toast.error("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const handleStartInterview = () => {
    if (interviewMode === "video") {
      setStage("camera-check");
      return;
    }
    setStage("launching");
    setTimeout(() => router.push("/interview"), 1200);
  };

  const isSubmitDisabled = (() => {
    let typeDisabled = false;
    if (interviewType === "job-specific") typeDisabled = !file || !jd.trim();
    else if (interviewType === "technical") typeDisabled = !config.stack || !config.difficulty || !config.questionCount;
    else if (interviewType === "behavioral") typeDisabled = !config.difficulty || !config.questionCount;
    else typeDisabled = true;

    if (typeDisabled) return true;

    if (
      (interviewMode === "audio" || interviewMode === "video") &&
      (!devicePermissionGranted || !micTestCompleted)
    ) {
      return true;
    }

    return false;
  })();

  const reduceMotion = useReducedMotion();
  const heroStrokeId = `start-hero-stroke-${useId().replace(/:/g, "")}`;

  const springIn = {
    type: "spring" as const,
    damping: 28,
    stiffness: 260,
    mass: 0.85,
  };

  const springSoft = {
    type: "spring" as const,
    damping: 32,
    stiffness: 200,
    mass: 0.9,
  };

  return (
    <div
      className="lp-page relative min-h-screen overflow-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      {(stage === "loading" ||
        stage === "analysis" ||
        stage === "camera-check" ||
        stage === "launching") && <StartFlowBackdrop />}
      <div className="relative z-[2] min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 pt-28 overflow-x-hidden">
          <AnimatePresence mode="wait">

            {/* ── STAGE: FORM ── */}
            {stage === "form" && (
              <motion.div
                key="form"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: -32, filter: "blur(8px)", transition: { duration: 0.25 } }
                }
                transition={reduceMotion ? { duration: 0.2 } : springIn}
                className="relative z-[1] w-full max-w-6xl flex flex-col items-stretch"
                style={{ perspective: reduceMotion ? undefined : 1400 }}
              >
                {/* BI / AI platform hero atmosphere (inspired by dashboard hero treatments — e.g. Dribbble BI AI hero patterns) */}
                <div
                  className="pointer-events-none absolute -top-24 left-1/2 h-[min(520px,70vh)] w-[min(1100px,100vw)] -translate-x-1/2 overflow-visible"
                  aria-hidden
                >
                  <div
                    className="absolute left-[8%] top-[12%] h-[280px] w-[280px] rounded-full opacity-[0.45] blur-[100px]"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.35), transparent 62%)",
                    }}
                  />
                  <div
                    className="absolute right-[6%] top-[22%] h-[320px] w-[320px] rounded-full opacity-[0.4] blur-[110px]"
                    style={{
                      background:
                        "radial-gradient(circle at 70% 40%, rgba(139, 92, 246, 0.38), transparent 58%)",
                    }}
                  />
                  <div
                    className="absolute bottom-[8%] left-1/2 h-[200px] w-[70%] -translate-x-1/2 rounded-full opacity-[0.2] blur-[80px]"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.35), transparent 65%)",
                    }}
                  />
                  <svg
                    className="absolute left-1/2 top-[18%] w-[min(720px,92vw)] -translate-x-1/2 opacity-[0.35]"
                    viewBox="0 0 720 120"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M0 96 C 120 24, 200 104, 360 56 S 560 8, 720 88"
                      stroke={`url(#${heroStrokeId})`}
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeDasharray="6 10"
                    />
                    <defs>
                      <linearGradient id={heroStrokeId} x1="0" y1="0" x2="720" y2="0">
                        <stop stopColor="rgba(34,211,238,0.5)" />
                        <stop offset="0.5" stopColor="rgba(139,92,246,0.45)" />
                        <stop offset="1" stopColor="rgba(59,130,246,0.35)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Hero copy — centered; motion uses motion.* tree so variants propagate */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: reduceMotion
                        ? { staggerChildren: 0, delayChildren: 0 }
                        : { staggerChildren: 0.07, delayChildren: 0.04 },
                    },
                  }}
                  className="relative z-[2] mb-10 flex w-full flex-col items-center text-center md:mb-14"
                >
                  <motion.span
                    variants={{
                      hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, x: 56, filter: "blur(8px)" },
                      show: reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, x: 0, filter: "blur(0px)", transition: springSoft },
                    }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-700/25 bg-gradient-to-r from-cyan-500/15 via-white/50 to-violet-500/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-900 shadow-sm backdrop-blur-md dark:border-cyan-400/25 dark:from-cyan-500/[0.12] dark:via-white/[0.04] dark:to-violet-500/[0.14] dark:text-cyan-100/95 dark:shadow-[0_0_32px_-8px_rgba(34,211,238,0.35)]"
                  >
                    Ready to begin?
                  </motion.span>

                  {/* motion.h1 required: plain <h1> breaks Framer variant inheritance to word spans */}
                  <motion.h1
                    className="max-w-[22ch] text-3xl font-semibold leading-[1.12] tracking-tight text-slate-900 md:text-5xl md:leading-[1.08] dark:text-white dark:drop-shadow-[0_0_42px_rgba(34,211,238,0.22)]"
                    variants={{
                      hidden: {},
                      show: {
                        transition: reduceMotion
                          ? {}
                          : { staggerChildren: 0.055, delayChildren: 0.06 },
                      },
                    }}
                  >
                    {SETUP_TITLE.split(" ").map((word, i) => (
                      <motion.span
                        key={`${word}-${i}`}
                        className="inline-block origin-center mr-[0.28em] last:mr-0"
                        variants={{
                          hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, x: 72, rotateY: -12, filter: "blur(10px)" },
                          show: reduceMotion
                            ? { opacity: 1 }
                            : {
                                opacity: 1,
                                x: 0,
                                rotateY: 0,
                                filter: "blur(0px)",
                                transition: { ...springIn, delay: i * 0.02 },
                              },
                        }}
                        style={reduceMotion ? undefined : { transformStyle: "preserve-3d" }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <motion.p
                    variants={{
                      hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, filter: "blur(6px)" },
                      show: reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, x: 0, filter: "blur(0px)", transition: { ...springSoft, delay: 0.08 } },
                    }}
                    className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400"
                  >
                    Choose your interview type and configure your session.
                  </motion.p>

                  {/* Accent line — draws from center */}
                  <motion.div
                    variants={{
                      hidden: { scaleX: 0, opacity: 0 },
                      show: {
                        scaleX: 1,
                        opacity: 1,
                        transition: reduceMotion ? { duration: 0.2 } : { delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="mt-7 hidden h-px w-full max-w-md origin-center rounded-full md:block"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(34,211,238,0.45), rgba(139,92,246,0.4), transparent)",
                    }}
                  />
                </motion.div>

                <div className="relative z-[2] w-full rounded-[2rem] border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.14)] backdrop-blur-[28px] backdrop-saturate-150 sm:p-8 dark:border-white/[0.07] dark:bg-slate-950/[0.35] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_40px_100px_-48px_rgba(0,0,0,0.85)]">
                <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
                  {/* Sidebar — subtle counter-motion from left */}
                  <motion.div
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -56, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={reduceMotion ? { duration: 0.25 } : { ...springIn, delay: 0.14 }}
                    className="w-full lg:sticky lg:top-28 order-2 lg:order-1"
                  >
                    <InterviewTypeSidebar
                      selected={interviewType}
                      onSelect={handleTypeSelect}
                    />
                  </motion.div>

                  {/* Form card — primary panel from the right with depth */}
                  <motion.div
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 96, rotateY: -7, filter: "blur(12px)" }}
                    animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                    transition={reduceMotion ? { duration: 0.3 } : { ...springIn, delay: 0.22 }}
                    className="relative order-1 lg:order-2"
                    style={reduceMotion ? undefined : { transformStyle: "preserve-3d" }}
                  >
                      <div
                        className="absolute inset-0 rounded-2xl blur-[60px] opacity-[0.12] pointer-events-none"
                        style={{ background: "radial-gradient(circle, var(--md-sys-color-primary) 0%, transparent 72%)" }}
                      />

                      <div className="relative rounded-3xl glass-card-raised p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.14)] sm:p-7 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
                        <div className="flex items-center justify-between mb-6 gap-3">
                          <div>
                            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-on-surface dark:opacity-90">
                              Start your session
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-600 dark:text-on-surface-variant dark:opacity-70">
                              Takes less than 60 seconds
                            </p>
                          </div>
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-emerald-400/25"
                            style={{
                              background: "color-mix(in srgb, rgb(52 211 153) 18%, transparent)",
                              boxShadow: "0 0 24px color-mix(in srgb, rgb(52 211 153) 12%, transparent)",
                            }}
                          >
                            <Zap size={15} className="text-emerald-400" aria-hidden />
                          </div>
                        </div>

                        <div className="mb-6 h-px bg-slate-300/80 dark:bg-outline-variant dark:opacity-40" />

                        {/* ── JOB-SPECIFIC FIELDS ── */}
                        {interviewType === "job-specific" && (
                          <>
                            <div className="mb-5">
                              <label className="label-caps block mb-2">Job Description</label>
                              <textarea
                                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none text-on-surface"
                                style={{
                                  background: "var(--md-sys-color-surface-container-low)",
                                  border: "1px solid var(--md-sys-color-outline-variant)",
                                  minHeight: "88px",
                                  transition: "border 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.border = "1px solid color-mix(in srgb, var(--md-sys-color-primary) 60%, transparent)";
                                  e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.border = "1px solid var(--md-sys-color-outline-variant)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                                rows={3}
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="We're looking for a Senior React Developer..."
                              />
                            </div>
                            <div className="mb-6">
                              <label className="label-caps block mb-2">Resume (PDF)</label>
                              <div className="overflow-hidden rounded-xl">
                                <FileUpload onChange={handleFileUpload} />
                              </div>
                            </div>
                          </>
                        )}

                        {/* ── TECHNICAL FIELDS ── */}
                        {interviewType === "technical" && (
                          <>
                            <div className="mb-5">
                              <label className="label-caps block mb-2">Stack / Technology</label>
                              <select
                                value={config.stack ?? ""}
                                onChange={(e) => setConfig({ ...config, stack: e.target.value })}
                                className="w-full rounded-xl px-4 py-3 text-sm outline-none text-on-surface"
                                style={{
                                  background: "var(--md-sys-color-surface-container-low)",
                                  border: "1px solid var(--md-sys-color-outline-variant)",
                                  transition: "border 0.2s, box-shadow 0.2s",
                                  appearance: "none",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.border = "1px solid color-mix(in srgb, var(--md-sys-color-primary) 60%, transparent)";
                                  e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.border = "1px solid var(--md-sys-color-outline-variant)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                <option value="" disabled>Select a stack...</option>
                                {STACKS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            <div className="mb-5">
                              <label className="label-caps block mb-2">Difficulty</label>
                              <div className="flex gap-2">
                                {DIFFICULTIES.map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => setConfig({ ...config, difficulty: d })}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                      config.difficulty === d
                                        ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                        : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="label-caps block mb-2">Number of Questions</label>
                              <div className="flex gap-2 mb-2">
                                {QUESTION_COUNTS.map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setConfig({ ...config, questionCount: n })}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                      config.questionCount === n
                                        ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                        : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <CustomQuestionCountField
                                value={config.questionCount}
                                onChange={(n) => setConfig({ ...config, questionCount: n })}
                              />
                            </div>
                          </>
                        )}

                        {/* ── BEHAVIORAL FIELDS ── */}
                        {interviewType === "behavioral" && (
                          <>
                            <div className="mb-5">
                              <label className="label-caps block mb-2">Difficulty</label>
                              <div className="flex gap-2">
                                {DIFFICULTIES.map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => setConfig({ ...config, difficulty: d })}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                      config.difficulty === d
                                        ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                        : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="label-caps block mb-2">Number of Questions</label>
                              <div className="flex gap-2 mb-2">
                                {QUESTION_COUNTS.map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setConfig({ ...config, questionCount: n })}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                      config.questionCount === n
                                        ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                        : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <CustomQuestionCountField
                                value={config.questionCount}
                                onChange={(n) => setConfig({ ...config, questionCount: n })}
                              />
                            </div>
                          </>
                        )}

                        {/* ── VOICE PICKER (all types) ── */}
                        <div className="mb-5">
                          <label className="label-caps block mb-2">Interviewer Voice</label>
                          <div className="flex gap-2">
                            {(["female", "male"] as const).map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setInterviewerVoice(v)}
                                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                  interviewerVoice === v
                                    ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                    : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                }`}
                              >
                                {v === "female" ? "Female" : "Male"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="h-px mb-5 bg-outline-variant opacity-40" />

                        {/* ── INTERVIEW MODE SELECTOR ── */}
                        <div className="mb-5">
                          <label className="label-caps block mb-2">Interview Mode</label>
                          <div className="grid grid-cols-3 gap-2">
                            {([
                              { mode: "chat" as InterviewMode, label: "Chat", Icon: MessageCircle, desc: "Text only" },
                              { mode: "audio" as InterviewMode, label: "Audio", Icon: Mic, desc: "Voice interview" },
                              { mode: "video" as InterviewMode, label: "Video", Icon: Video, desc: "Video + voice" },
                            ]).map(({ mode, label, Icon, desc }) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setInterviewMode(mode)}
                                className={`relative flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-sm font-semibold transition-all duration-200 ${
                                  interviewMode === mode
                                    ? "glass-card border border-violet-500/40 lp-hi shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                    : "glass-card border border-transparent dark:border-white/10 lp-muted hover:lp-body"
                                }`}
                              >
                                <Icon
                                  size={18}
                                  className={
                                    interviewMode === mode
                                      ? "text-violet-400"
                                      : "text-slate-600 dark:text-slate-300"
                                  }
                                />
                                <span>{label}</span>
                                <span className="text-[10px] font-normal text-slate-600 dark:text-slate-400">
                                  {desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ── DEVICE SETUP (Audio & Video modes) ── */}
                        {(interviewMode === "audio" || interviewMode === "video") && (
                          <div className="mb-5 space-y-4">
                            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug rounded-xl border border-violet-500/35 bg-violet-500/[0.08] px-3.5 py-2.5 dark:border-violet-400/25 dark:bg-violet-500/10">
                              <span className="text-violet-700 dark:text-violet-200 font-semibold">Required:</span>{" "}
                              Run the mic test and let the check finish so we know audio works before the interview
                              starts.
                            </p>

                            {!devicePermissionGranted && audioDevices.length === 0 && (
                              <button
                                type="button"
                                onClick={requestDevicePermissions}
                                className="w-full rounded-xl py-2.5 text-sm font-semibold glass-card border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/50 transition-all duration-200"
                              >
                                Grant Device Permissions
                              </button>
                            )}

                            {/* Microphone dropdown + test */}
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                <span className="label-caps">Microphone</span>
                                {micTestCompleted ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                                    Check complete
                                  </span>
                                ) : (
                                  <span className="text-[10px] sm:text-xs font-semibold text-amber-800/90 dark:text-amber-300/95">
                                    Run test to continue
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                                <select
                                  value={selectedMicId ?? ""}
                                  onChange={(e) => setSelectedMicId(e.target.value || null)}
                                  className="sm:flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm outline-none text-on-surface"
                                  style={{
                                    background: "var(--md-sys-color-surface-container-low)",
                                    border: "1px solid var(--md-sys-color-outline-variant)",
                                    appearance: "none",
                                  }}
                                >
                                  <option value="">Default microphone</option>
                                  {audioDevices.map((d) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                      {d.label || `Mic ${d.deviceId.slice(0, 8)}`}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={micTestActive ? () => stopMicTest(true) : startMicTest}
                                  className={`shrink-0 sm:self-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                    micTestActive
                                      ? "glass-card border-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.12]"
                                      : micTestCompleted
                                        ? "glass-card border-2 border-slate-300/80 text-slate-800 dark:border-white/20 dark:text-slate-200 hover:lp-body"
                                        : "border-2 border-violet-500/55 bg-violet-500/12 text-violet-900 shadow-[0_0_0_1px_rgba(124,58,237,0.12)] dark:border-violet-400/50 dark:bg-violet-500/20 dark:text-violet-100 dark:shadow-[0_0_24px_rgba(124,58,237,0.18)]"
                                  }`}
                                >
                                  <Mic size={16} className="shrink-0" />
                                  {micTestActive ? "Stop" : "Test microphone"}
                                </button>
                              </div>
                              <p className="mt-1.5 text-[11px] sm:text-xs lp-muted dark:text-slate-400">
                                {micTestActive
                                  ? "Listening… Test ends automatically, or press Stop."
                                  : micTestCompleted
                                    ? "You can change the mic and test again, or use Test microphone to re-check."
                                    : "We must capture audio once before Start Interview is enabled."}
                              </p>
                              {micTestActive && (
                                <div className="mt-2 h-2 rounded-full overflow-hidden bg-slate-200/80 dark:bg-white/[0.12]">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                      background: "linear-gradient(90deg, #10B981, #34D399)",
                                      boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                                    }}
                                    animate={{ width: `${Math.min(100, (micTestVolume / 60) * 100)}%` }}
                                    transition={{ duration: 0.05 }}
                                  />
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                        <button
                          onClick={startInterview}
                          disabled={isSubmitDisabled}
                          className="w-full rounded-xl py-3.5 text-sm font-semibold btn-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          Start Interview
                        </button>

                        <p className="label-caps mt-4 text-center">Powered by Gemini AI</p>
                      </div>
                  </motion.div>
                </div>
                </div>
              </motion.div>
            )}

            {/* ── STAGE: LOADING ── */}
            {stage === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="relative z-[1] flex w-full max-w-3xl flex-col items-stretch justify-center gap-8 md:flex-row md:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tight lp-hi sm:text-3xl">
                      Preparing your interview
                    </h2>
                    <p className="label-caps mt-2">This usually takes about 15 seconds</p>
                    <p className="lp-muted mt-2 max-w-md text-sm leading-relaxed md:mx-0 md:text-left">
                      We are personalizing your session from your profile—resume, role fit, and
                      question plan.
                    </p>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {loadingSteps.map(({ label, Icon }, i) => {
                      const isDone = i < loadingStep;
                      const isActive = i === loadingStep;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className={`flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 ${
                            isActive
                              ? "glass-card border border-violet-500/35 shadow-[0_0_0_1px_rgba(124,58,237,0.12)]"
                              : "border border-transparent"
                          } ${isDone ? "bg-emerald-500/5" : ""}`}
                        >
                          {isDone ? (
                            <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                          ) : (
                            <Icon
                              size={20}
                              className={`shrink-0 ${isActive ? "text-violet-400" : "lp-faint"}`}
                            />
                          )}
                          <span
                            className={`min-w-0 flex-1 text-left text-sm font-medium ${
                              isDone
                                ? "text-emerald-500 dark:text-emerald-400/95"
                                : isActive
                                  ? "lp-hi"
                                  : "lp-faint"
                            }`}
                          >
                            {label}
                          </span>
                          {isDone && (
                            <span className="shrink-0 text-xs font-semibold text-emerald-500/80">
                              Done
                            </span>
                          )}
                          {isActive && !isDone && (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-400" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <aside className="flex w-full max-w-sm flex-col items-center gap-4 self-center md:w-72 md:shrink-0 md:pt-1">
                  <StepProgressRing
                    value={prepareRingPct}
                    label="Setup progress (estimated from current stage)"
                  />
                  <div className="w-full rounded-2xl border border-white/[0.14] bg-white/[0.6] p-4 text-left shadow-sm backdrop-blur-xl dark:!border-white/[0.12] dark:!bg-[rgba(15,23,42,0.96)] dark:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 dark:bg-violet-500/25">
                        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        While you wait
                      </span>
                    </div>
                    <p className="min-h-[3.25rem] text-sm leading-relaxed text-slate-700 transition-opacity duration-300 dark:text-slate-100">
                      {PREPARING_TIPS[flowTipIndex % PREPARING_TIPS.length]}
                    </p>
                    <div className="mt-3 flex gap-1">
                      {PREPARING_TIPS.map((_, j) => (
                        <div
                          key={j}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            j === flowTipIndex % PREPARING_TIPS.length
                              ? "bg-violet-500/70"
                              : "bg-slate-200/80 dark:bg-slate-600/90"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}

            {/* ── STAGE: ANALYSIS ── */}
            {stage === "analysis" && analysisData && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="relative z-[1] w-full max-w-2xl"
              >
                <div className="glass-card-raised rounded-3xl border border-white/20 p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
                        <CheckCircle size={24} className="text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight lp-hi sm:text-2xl">
                          {interviewType === "job-specific"
                            ? "Resume Analysis Complete"
                            : "Interview Ready"}
                        </h2>
                        <p className="lp-muted mt-1 max-w-md text-sm">
                          {interviewType === "job-specific"
                            ? "Here is how you align with this role before you begin."
                            : "Your session is configured and ready to launch."}
                        </p>
                      </div>
                    </div>
                    {interviewType === "job-specific" && analysisData.gapAnalysis && (
                      <div className="flex shrink-0 justify-center sm:justify-end">
                        <MatchScoreRing score={analysisData.gapAnalysis.matchScore} />
                      </div>
                    )}
                  </div>

                  {/* Job-Specific: show gap analysis */}
                  {interviewType === "job-specific" && analysisData.gapAnalysis && (
                    <>
                      <div className="mb-6 text-center sm:mb-8 sm:text-left">
                        <span className="label-caps block">Fit snapshot</span>
                        <p className="lp-muted mt-1 max-w-lg text-sm">
                          {analysisData.gapAnalysis.matchScore >= 70
                            ? "Strong fit for this role"
                            : analysisData.gapAnalysis.matchScore >= 50
                              ? "Moderate fit — some gaps identified"
                              : "Significant gaps — the interview will target these areas"}
                        </p>
                      </div>

                      <div className="h-px lp-surface-md mb-6" />

                      {analysisData.candidateSummary && (
                        <div className="mb-6">
                          <span className="label-caps mb-2 block">Candidate summary</span>
                          <p className="lp-body glass-card rounded-2xl p-4 text-sm leading-relaxed sm:p-5">
                            {analysisData.candidateSummary}
                          </p>
                        </div>
                      )}

                      <div className="mb-4">
                        <span className="label-caps mb-2 block">Skills gap</span>
                        {analysisData.gapAnalysis.missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {analysisData.gapAnalysis.missingSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="rounded-full border border-amber-300/50 bg-amber-50/95 px-3 py-1.5 text-xs font-semibold text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/50 dark:text-amber-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={16} /> No major gaps found
                          </p>
                        )}
                      </div>

                      {analysisData.gapAnalysis.feedback && (
                        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/95 p-4 dark:border-amber-800/60 dark:bg-amber-950/45">
                          <p className="text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-50">
                            {analysisData.gapAnalysis.feedback}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Technical / Behavioral: simple ready card */}
                  {interviewType !== "job-specific" && (
                    <div className="mb-6">
                      <div className="lp-body glass-card flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/12">
                          <Zap className="h-6 w-6 text-violet-500" />
                        </div>
                        <p className="text-sm leading-relaxed">
                          {interviewType === "technical"
                            ? `Your ${config.questionCount}-question ${config.difficulty} ${config.stack} interview is ready. Good luck!`
                            : `Your ${config.questionCount}-question ${config.difficulty} behavioral interview is ready. Use the STAR method for your answers. Good luck!`}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleStartInterview}
                    className="btn-violet flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold"
                  >
                    Start Interview <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STAGE: CAMERA-CHECK ── */}
            {stage === "camera-check" && (
              <motion.div
                key="camera-check"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="relative z-[1] w-full max-w-5xl"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                  <div className="glass-card-raised rounded-3xl border border-white/15 p-6 sm:p-7">
                    <div className="mb-1 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12">
                        <Camera size={22} className="shrink-0 text-violet-500" />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight lp-hi sm:text-2xl">Camera check</h2>
                    </div>
                    <p className="lp-muted mt-1 max-w-2xl text-sm leading-relaxed">
                      Center your head and shoulders, check lighting from the front, and pick the
                      right device before you go live.
                    </p>

                    {/* Camera preview */}
                    <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner">
                      {cameraCheckLoading && (
                        <>
                          <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/85 via-slate-800/50 to-slate-900/85" />
                          <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                          <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-white/50" />
                          </div>
                        </>
                      )}
                      <video
                        ref={(el) => {
                          cameraCheckVideoRef.current = el;
                          if (el && cameraCheckStream) {
                            el.srcObject = cameraCheckStream;
                          }
                        }}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>

                    {videoDevices.length > 0 && (
                      <div className="mt-5">
                        <label className="label-caps mb-2 block">Camera</label>
                        <div className="relative">
                          <select
                            value={selectedCameraId ?? ""}
                            onChange={(e) => {
                              const id = e.target.value || null;
                              setSelectedCameraId(id);
                              startCameraCheck(id);
                            }}
                            className="w-full cursor-pointer appearance-none rounded-2xl px-3 py-3 pr-10 text-sm font-medium outline-none text-on-surface transition-shadow focus:ring-2 focus:ring-violet-500/30"
                            style={{
                              background: "var(--md-sys-color-surface-container-low)",
                              border: "1px solid var(--md-sys-color-outline-variant)",
                            }}
                          >
                            <option value="">Default camera</option>
                            {videoDevices.map((d) => (
                              <option key={d.deviceId} value={d.deviceId}>
                                {d.label || `Camera ${d.deviceId.slice(0, 8)}`}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        stopCameraCheck();
                        setStage("launching");
                        setTimeout(() => router.push("/interview"), 1200);
                      }}
                      className="btn-violet mt-6 mb-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold"
                    >
                      Looks good, start interview <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => {
                        stopCameraCheck();
                        setStage("analysis");
                      }}
                      className="w-full text-center text-sm lp-muted transition-colors hover:lp-body"
                    >
                      ← Back
                    </button>
                  </div>

                  <aside className="space-y-4">
                    <div className="rounded-2xl border border-white/[0.14] bg-white/[0.55] p-4 backdrop-blur-xl dark:!border-white/[0.12] dark:!bg-[rgba(15,23,42,0.96)] dark:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
                      <div className="mb-3 flex items-center gap-2">
                        <ScanEye className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                          Framing
                        </span>
                      </div>
                      <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-200">
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          Face the light source—backlighting makes you hard to see.
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          Keep eyes near the top third of the frame.
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          Sit an arm's length from the camera for a natural crop.
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/[0.14] bg-white/[0.55] p-4 backdrop-blur-xl dark:!border-white/[0.12] dark:!bg-[rgba(15,23,42,0.96)] dark:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
                      <div className="mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                          Quick tips
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                        You already passed the mic check on the previous step—this screen only
                        verifies video. You can change cameras anytime before you continue.
                      </p>
                    </div>
                  </aside>
                </div>
              </motion.div>
            )}

            {/* ── STAGE: LAUNCHING ── */}
            {stage === "launching" && (
              <motion.div
                key="launching"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="relative z-[1] flex w-full max-w-lg flex-col items-center gap-6 text-center"
              >
                <IndeterminateFlowRing title="Opening the interview" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight lp-hi">Opening your session</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Preparing the interview room—almost there.
                  </p>
                </div>
                <div className="w-full rounded-2xl border border-white/[0.14] bg-white/[0.55] p-4 text-left backdrop-blur-xl dark:border-white/[0.12] dark:bg-slate-950/[0.94] dark:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-800 dark:text-violet-200">
                      Heads-up
                    </span>
                  </div>
                  <p className="min-h-[3rem] text-sm leading-relaxed text-slate-700 dark:text-slate-100">
                    {LAUNCH_TIPS[flowTipIndex % LAUNCH_TIPS.length]}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-violet-500/50"
                      animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: i * 0.18,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
