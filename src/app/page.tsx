"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { PlayCircle, LayoutDashboard, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { FlipWords } from "@/components/ui/flip-words";
import { FileUpload } from "@/components/ui/file-upload";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"; 
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"; // <--- 1. Import
import { supabase } from "@/lib/supabaseClient";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  const startInterview = async () => {
    if (!file) return alert("Please upload a resume!");
    if (!user?.id) return alert("Please login to start an interview!");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("userId", user?.id ?? "");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/init-interview",
        formData
      );

      setSessionId(res.data.sessionId);
      setQuestion(res.data.firstQuestion.question);
      
      if (res.data.audio) {
        setFirstQuestionAudio(res.data.audio);
      }

      router.push("/interview");
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const words = ["better", "successful", "confident", "winning", "stronger"];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <BackgroundRippleEffect />
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10 pointer-events-none">
        
        {/* ✅ HEADER BAR: Sign Out (Left) & Dashboard (Right) */}
        <div className="flex justify-between items-center mb-12 pointer-events-auto">
            {/* Sign Out Button */}
            {user && (
                <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-4 py-2"
                    onClick={handleSignOut}
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </HoverBorderGradient>
            )}

            {/* Dashboard Button */}
            <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-4 py-2"
                onClick={() => router.push("/dashboard")}
            >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
            </HoverBorderGradient>
        </div>
        
        {/* Header Text */}
        <div className="text-center mb-12">
          <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your path to{" "}
            <span className="relative inline-block">
              <FlipWords 
                words={words} 
                className="text-blue-600"
                duration={3000}
              />
            </span>{" "}
            <div className="">interviews starts here</div>
          </div>
          <p className="text-lg text-slate-600 mt-4 bg-white/50 backdrop-blur-sm p-2 rounded-lg inline-block">
            Upload your resume and job description to begin your AI-powered mock interview
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-lg mx-auto rounded-xl bg-white p-8 shadow-xl border border-slate-100 relative pointer-events-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <PlayCircle className="text-blue-600" size={28} />
              HIRELY AI
            </h1>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Job Description
            </label>
            <textarea
              className="w-full text-black rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              rows={3}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Resume (PDF)
            </label>
            <div className="w-full border border-dashed bg-slate-50 border-slate-300 rounded-lg overflow-hidden">
                <FileUpload onChange={handleFileUpload} />
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing Resume..." : "Start Interview 🚀"}
          </button>
        </div>
      </div>
    </main>
  );
}