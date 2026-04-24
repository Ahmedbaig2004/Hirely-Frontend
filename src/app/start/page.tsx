"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore, InterviewType } from "@/stores/useInterviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileUpload } from "@/components/ui/file-upload";
import { InterviewTypeSidebar } from "@/components/start/InterviewTypeSidebar";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Zap, FileText, Sparkles, BarChart, MessageSquare,
  CheckCircle, ChevronRight, Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type StartStage = "form" | "loading" | "analysis" | "launching";

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

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
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
  } = useInterviewStore();

  // Job-Specific fields
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("We need a Senior React Developer...");

  const [stage, setStage] = useState<StartStage>("form");
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const loadingStepRef = useRef(0);
  const apiDoneRef = useRef(false);
  const apiResultRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleFileUpload = (files: File[]) => {
    setFile(files.length > 0 ? files[0] : null);
  };

  const handleTypeSelect = (type: InterviewType) => {
    setInterviewType(type);
    setStage("form");
  };

  const loadingSteps =
    interviewType === "job-specific" ? JOB_SPECIFIC_LOADING_STEPS : GENERIC_LOADING_STEPS;

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
      toast.error("Please login to start an interview!");
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
    setStage("launching");
    setTimeout(() => router.push("/interview"), 1200);
  };

  const isSubmitDisabled = (() => {
    if (interviewType === "job-specific") return !file || !jd.trim();
    if (interviewType === "technical") return !config.stack || !config.difficulty || !config.questionCount;
    if (interviewType === "behavioral") return !config.difficulty || !config.questionCount;
    return true;
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
                                        : "glass-card border border-transparent lp-muted hover:lp-body"
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
                                        : "glass-card border border-transparent lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="label-caps whitespace-nowrap">Custom (1–10):</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={config.questionCount ?? ""}
                                  onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    if (!e.target.value) {
                                      setConfig({ ...config, questionCount: undefined });
                                    } else if (v >= 1 && v <= 10) {
                                      setConfig({ ...config, questionCount: v });
                                    }
                                  }}
                                  placeholder="e.g. 7"
                                  className="w-20 rounded-xl px-3 py-2 text-sm outline-none lp-hi text-center"
                                  style={{
                                    background: "var(--md-sys-color-surface-container-low)",
                                    border: "1px solid var(--md-sys-color-outline-variant)",
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
                                />
                              </div>
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
                                        : "glass-card border border-transparent lp-muted hover:lp-body"
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
                                        : "glass-card border border-transparent lp-muted hover:lp-body"
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="label-caps whitespace-nowrap">Custom (1–10):</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={config.questionCount ?? ""}
                                  onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    if (!e.target.value) {
                                      setConfig({ ...config, questionCount: undefined });
                                    } else if (v >= 1 && v <= 10) {
                                      setConfig({ ...config, questionCount: v });
                                    }
                                  }}
                                  placeholder="e.g. 7"
                                  className="w-20 rounded-xl px-3 py-2 text-sm outline-none lp-hi text-center"
                                  style={{
                                    background: "var(--md-sys-color-surface-container-low)",
                                    border: "1px solid var(--md-sys-color-outline-variant)",
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
                                />
                              </div>
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
                                    : "glass-card border border-transparent lp-muted hover:lp-body"
                                }`}
                              >
                                {v === "female" ? "Female" : "Male"}
                              </button>
                            ))}
                          </div>
                        </div>

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
                className="flex flex-col items-center justify-center w-full max-w-sm text-center"
              >
                <h2 className="text-2xl font-bold lp-hi mb-2">Preparing your interview</h2>
                <p className="label-caps mb-10">This usually takes about 15 seconds</p>

                <div className="w-full space-y-4">
                  {loadingSteps.map(({ label, Icon }, i) => {
                    const isDone = i < loadingStep;
                    const isActive = i === loadingStep;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                          isActive ? "glass-card border border-violet-500/30" : ""
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Icon
                            size={18}
                            className={`shrink-0 ${isActive ? "text-violet-400 animate-pulse" : "lp-faint"}`}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isDone ? "text-emerald-400" : isActive ? "lp-hi" : "lp-faint"
                          }`}
                        >
                          {label}
                        </span>
                        {isDone && (
                          <span className="ml-auto text-xs text-emerald-400/60 font-semibold">Done</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
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
                className="w-full max-w-lg"
              >
                <div className="glass-card-raised rounded-2xl p-7">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle size={22} className="text-emerald-400 shrink-0" />
                    <h2 className="text-xl font-bold lp-hi">
                      {interviewType === "job-specific"
                        ? "Resume Analysis Complete"
                        : "Interview Ready"}
                    </h2>
                  </div>

                  {/* Job-Specific: show gap analysis */}
                  {interviewType === "job-specific" && analysisData.gapAnalysis && (
                    <>
                      <div className="text-center mb-6">
                        <span className="label-caps block mb-1">Match Score</span>
                        <span className={`text-6xl font-black ${getScoreColor(analysisData.gapAnalysis.matchScore)}`}>
                          {analysisData.gapAnalysis.matchScore}%
                        </span>
                        <p className="lp-muted text-xs mt-1">
                          {analysisData.gapAnalysis.matchScore >= 70
                            ? "Strong fit for this role"
                            : analysisData.gapAnalysis.matchScore >= 50
                            ? "Moderate fit — some gaps identified"
                            : "Significant gaps — interview will target these areas"}
                        </p>
                      </div>

                      <div className="h-px lp-surface-md mb-5" />

                      {analysisData.candidateSummary && (
                        <div className="mb-5">
                          <span className="label-caps block mb-2">Candidate Summary</span>
                          <p className="glass-card p-4 rounded-xl lp-body text-sm leading-relaxed">
                            {analysisData.candidateSummary}
                          </p>
                        </div>
                      )}

                      <div className="mb-5">
                        <span className="label-caps block mb-2">Skills Gap</span>
                        {analysisData.gapAnalysis.missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {analysisData.gapAnalysis.missingSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="glass-card px-2 py-1 text-amber-300 text-xs font-semibold rounded border border-amber-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle size={14} /> No major gaps found
                          </p>
                        )}
                      </div>

                      {analysisData.gapAnalysis.feedback && (
                        <p className="text-amber-400/80 text-sm leading-relaxed mb-6">
                          {analysisData.gapAnalysis.feedback}
                        </p>
                      )}
                    </>
                  )}

                  {/* Technical / Behavioral: simple ready card */}
                  {interviewType !== "job-specific" && (
                    <div className="mb-6">
                      <p className="glass-card p-4 rounded-xl lp-body text-sm leading-relaxed">
                        {interviewType === "technical"
                          ? `Your ${config.questionCount}-question ${config.difficulty} ${config.stack} interview is ready. Good luck!`
                          : `Your ${config.questionCount}-question ${config.difficulty} behavioral interview is ready. Use the STAR method for your answers. Good luck!`}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleStartInterview}
                    className="btn-violet w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
                  >
                    Start Interview <ChevronRight size={16} />
                  </button>
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
                className="flex flex-col items-center gap-4"
              >
                <Loader2 size={36} className="text-violet-400 animate-spin" />
                <p className="lp-body text-sm">Preparing your interview...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
