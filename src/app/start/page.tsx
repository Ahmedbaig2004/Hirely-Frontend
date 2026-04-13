"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileUpload } from "@/components/ui/file-upload";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, FileText, Sparkles, BarChart, MessageSquare,
  CheckCircle, ChevronRight, Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type StartStage = "form" | "loading" | "analysis" | "launching";

interface AnalysisData {
  candidateSummary: string;
  gapAnalysis: { matchScore: number; missingSkills: string[]; feedback: string };
}

const LOADING_STEPS = [
  { label: "Parsing your resume...",             Icon: FileText      },
  { label: "Identifying skills & experience...", Icon: Sparkles      },
  { label: "Comparing with job requirements...", Icon: BarChart      },
  { label: "Generating interview questions...",  Icon: MessageSquare },
];

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
    interviewerVoice,
    setInterviewerVoice,
  } = useInterviewStore();

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

  const tryAdvanceToAnalysis = (currentStep: number) => {
    if (apiDoneRef.current && currentStep >= 2) {
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
    if (!file) return toast.error("Please upload a resume first.");

    apiDoneRef.current = false;
    apiResultRef.current = null;
    loadingStepRef.current = 0;
    setStage("loading");
    setLoadingStep(0);

    intervalRef.current = setInterval(() => {
      const next = Math.min(loadingStepRef.current + 1, LOADING_STEPS.length - 1);
      loadingStepRef.current = next;
      setLoadingStep(next);
      tryAdvanceToAnalysis(next);
    }, 800);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("userId", user?.id ?? "");
    formData.append("interviewerVoice", interviewerVoice);

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

  return (
    <div className="relative min-h-screen bg-background text-on-surface overflow-hidden">
      <MeshGradient />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 pt-28">
          <AnimatePresence mode="wait">

            {/* ── STAGE: FORM ── */}
            {stage === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <span className="label-caps block mb-3">Ready to begin?</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight opacity-90">
                    Set Up Your Interview
                  </h1>
                  <p className="text-sm text-on-surface-variant mt-2 opacity-55">
                    Upload your resume and paste the job description to get started.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full max-w-md relative"
                >
                  <div
                    className="absolute inset-0 rounded-2xl blur-[60px] opacity-10 pointer-events-none"
                    style={{ background: "radial-gradient(circle, var(--md-sys-color-primary) 0%, transparent 70%)" }}
                  />

                  <div className="relative rounded-2xl glass-card-raised p-7">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-base font-semibold text-on-surface tracking-tight opacity-90">
                          Start your session
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-0.5 opacity-40">Takes less than 60 seconds</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent)",
                        }}
                      >
                        <Zap size={14} style={{ color: "var(--md-sys-color-primary)" }} />
                      </div>
                    </div>

                    <div className="h-px mb-6 bg-outline-variant opacity-40" />

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
                      <div className="dark rounded-xl overflow-hidden">
                        <FileUpload onChange={handleFileUpload} />
                      </div>
                    </div>

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
                                ? "glass-card border border-violet-500/40 text-white/90 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                : "glass-card border border-transparent text-white/40 hover:text-white/70"
                            }`}
                          >
                            {v === "female" ? "Female" : "Male"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={startInterview}
                      disabled={!file || !jd.trim()}
                      className="w-full rounded-xl py-3.5 text-sm font-semibold btn-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Start Interview
                    </button>

                    <p className="text-center mt-4 label-caps">Powered by Gemini AI</p>
                  </div>
                </motion.div>
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
                <h2 className="text-2xl font-bold text-white/90 mb-2">Analyzing your profile</h2>
                <p className="label-caps mb-10">This usually takes about 15 seconds</p>

                <div className="w-full space-y-4">
                  {LOADING_STEPS.map(({ label, Icon }, i) => {
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
                            className={`shrink-0 ${isActive ? "text-violet-400 animate-pulse" : "text-white/20"}`}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isDone ? "text-emerald-400" : isActive ? "text-white/90" : "text-white/20"
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
                    <h2 className="text-xl font-bold text-white/90">Resume Analysis Complete</h2>
                  </div>

                  {/* Match Score */}
                  <div className="text-center mb-6">
                    <span className="label-caps block mb-1">Match Score</span>
                    <span className={`text-6xl font-black ${getScoreColor(analysisData.gapAnalysis.matchScore)}`}>
                      {analysisData.gapAnalysis.matchScore}%
                    </span>
                    <p className="text-white/40 text-xs mt-1">
                      {analysisData.gapAnalysis.matchScore >= 70
                        ? "Strong fit for this role"
                        : analysisData.gapAnalysis.matchScore >= 50
                        ? "Moderate fit — some gaps identified"
                        : "Significant gaps — interview will target these areas"}
                    </p>
                  </div>

                  <div className="h-px bg-white/[0.06] mb-5" />

                  {/* Candidate Summary */}
                  <div className="mb-5">
                    <span className="label-caps block mb-2">Candidate Summary</span>
                    <p className="glass-card p-4 rounded-xl text-white/60 text-sm leading-relaxed">
                      {analysisData.candidateSummary}
                    </p>
                  </div>

                  {/* Skills Gap */}
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

                  {/* Gap Feedback */}
                  {analysisData.gapAnalysis.feedback && (
                    <p className="text-amber-400/80 text-sm leading-relaxed mb-6">
                      {analysisData.gapAnalysis.feedback}
                    </p>
                  )}

                  {/* CTA */}
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
                <p className="text-white/60 text-sm">Preparing your interview...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
