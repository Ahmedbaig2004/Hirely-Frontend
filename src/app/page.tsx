"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { LayoutDashboard, LogOut, Zap, Brain, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { FlipWords } from "@/components/ui/flip-words";
import { FileUpload } from "@/components/ui/file-upload";
import { supabase } from "@/lib/supabaseClient";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { motion } from "framer-motion";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { setSessionId, setQuestion, setFirstQuestionAudio } = useInterviewStore();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("We need a Senior React Developer...");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  const startInterview = async () => {
    if (!user) {
      toast.error("Please login to start an interview!");
      router.push("/auth");
      return;
    }
    if (!file) return toast.error("Please upload a resume first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("userId", user?.id ?? "");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/api/init-interview`, formData);

      setSessionId(res.data.sessionId);
      setQuestion(res.data.firstQuestion.question);

      if (res.data.audio) {
        setFirstQuestionAudio(res.data.audio);
      }

      router.push("/interview");
    } catch (err: any) {
      toast.error("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const flipWords = ["Reimagined.", "Elevated.", "Mastered.", "Perfected."];

  const features = [
    { icon: Brain,    label: "AI-Powered Analysis",  accent: "#7C3AED" },
    { icon: Zap,      label: "Real-time Feedback",   accent: "#22D3EE" },
    { icon: Sparkles, label: "Adaptive Questions",   accent: "#10B981" },
  ];

  return (
    <div className="relative min-h-screen bg-[#080810] text-white overflow-hidden">
      {/* Animated mesh gradient background */}
      <MeshGradient />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
            >
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-white/70">HIRELY</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={handleDashboardClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold glass-card text-white/60 hover:text-white/90 transition-all"
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </button>
          </motion.div>
        </nav>

        {/* ── Main two-column layout ────────────────────────── */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-8 md:px-10 lg:gap-20 max-w-7xl mx-auto w-full">

          {/* ═══════════════════════════════════
              LEFT — Hero
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 max-w-xl flex flex-col items-start"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#22D3EE", boxShadow: "0 0 8px #22D3EE" }}
              />
              <span className="label-caps">AI Interview Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-2 text-white">
              Your Interview,
            </h1>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
              <FlipWords
                words={flipWords}
                duration={3500}
                className="text-violet-400"
              />
            </h1>

            {/* Tagline */}
            <p className="text-sm mb-10 max-w-sm">
              <EncryptedText
                text="Upload your resume. Describe the role. Face a real AI interviewer."
                className="font-mono"
                encryptedClassName="text-white/10"
                revealedClassName="text-white/40 font-light tracking-wide"
                revealDelayMs={40}
              />
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-3">
              {features.map(({ icon: Icon, label, accent }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card"
                >
                  <Icon size={13} style={{ color: accent }} />
                  <span className="text-xs text-white/45 font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════
              RIGHT — Upload card
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-sm lg:max-w-md relative"
          >
            {/* Ambient glow behind card */}
            <div
              className="absolute inset-0 rounded-2xl blur-[60px] opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
            />

            {/* Glass card */}
            <div className="relative rounded-2xl glass-card-raised p-7">

              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white/90 tracking-tight">
                    Start your session
                  </h2>
                  <p className="text-xs text-white/30 mt-0.5">
                    Takes less than 60 seconds
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(91,33,182,0.15))",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  <Zap size={14} style={{ color: "#a78bfa" }} />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Job Description */}
              <div className="mb-5">
                <label className="label-caps block mb-2">Job Description</label>
                <textarea
                  className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    minHeight: "88px",
                    transition: "border 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(124,58,237,0.45)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  rows={3}
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="We're looking for a Senior React Developer..."
                />
              </div>

              {/* Resume Upload */}
              <div className="mb-6">
                <label className="label-caps block mb-2">Resume (PDF)</label>
                {/* .dark wrapper activates dark: variants inside FileUpload */}
                <div className="dark rounded-xl overflow-hidden">
                  <FileUpload onChange={handleFileUpload} />
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={startInterview}
                disabled={loading}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white btn-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white/80 inline-block animate-spin" />
                    Analyzing Resume...
                  </span>
                ) : (
                  "Start Interview"
                )}
              </button>

              {/* Attribution */}
              <p className="text-center mt-4 label-caps">
                Powered by Gemini AI
              </p>
            </div>
          </motion.div>

        </main>
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
