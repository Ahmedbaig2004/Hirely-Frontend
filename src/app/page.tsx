"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterviewStore } from "@/stores/useInterviewStore"; // Import store
import { UploadCloud, FileText, PlayCircle, LayoutDashboard } from "lucide-react"; // Icons

export default function Home() {
  const router = useRouter();
  const { setSessionId, setQuestion } = useInterviewStore();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("We need a Senior React Developer...");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    if (!file) return alert("Please upload a resume!");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    try {
      // 1. Call Backend
      const res = await axios.post(
        "http://localhost:4000/api/init-interview",
        formData
      );

      // 2. Save Data to Global Store
      setSessionId(res.data.sessionId);
      setQuestion(res.data.firstQuestion.question);

      // 3. Go to Interview Page
      router.push("/interview");
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <PlayCircle className="text-blue-600" size={32} />
              HIRELY AI
            </h1>
            <p className="text-slate-500 mt-2">
              Upload your resume to start the mock interview.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-slate-700 hover:text-slate-900 ml-4"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </div>

        {/* Job Description */}
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

        {/* Resume Upload */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Resume (PDF)
          </label>
          <div className="relative group">
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <FileText size={32} className="mb-2" />
                    <p className="text-sm font-semibold">{file.name}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-500">
                    <UploadCloud size={32} className="mb-2" />
                    <p className="text-sm">Click to upload PDF</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </label>
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
    </main>
  );
}
