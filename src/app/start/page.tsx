"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileUpload } from "@/components/ui/file-upload";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setSessionId, setQuestion, setFirstQuestionAudio } = useInterviewStore();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("We need a Senior React Developer...");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (files: File[]) => {
    setFile(files.length > 0 ? files[0] : null);
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

  return (
    <div className="relative min-h-screen bg-[#080810] text-white overflow-hidden">
      <MeshGradient />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 pt-28">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="label-caps block mb-3">Ready to begin?</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
              Set Up Your Interview
            </h1>
            <p className="text-sm text-white/40 mt-2">
              Upload your resume and paste the job description to get started.
            </p>
          </motion.div>

          {/* Upload card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md relative"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-2xl blur-[60px] opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
            />

            <div className="relative rounded-2xl glass-card-raised p-7">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white/90 tracking-tight">
                    Start your session
                  </h2>
                  <p className="text-xs text-white/30 mt-0.5">Takes less than 60 seconds</p>
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
                <div className="dark rounded-xl overflow-hidden">
                  <FileUpload onChange={handleFileUpload} />
                </div>
              </div>

              {/* CTA */}
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

              <p className="text-center mt-4 label-caps">Powered by Gemini AI</p>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
