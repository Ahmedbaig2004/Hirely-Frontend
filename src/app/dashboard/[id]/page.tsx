"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CheckCircle, XCircle, Lightbulb, 
  TrendingUp, BarChart3, Tag 
} from "lucide-react"; 

export default function InterviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        setLoading(true);
        axios.get(`http://localhost:4000/api/interviews/${id}`)
          .then((res) => {
            setData(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
          });
    }
  }, [id]);

  if (loading || !data) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-slate-200 rounded mb-6 animate-pulse"></div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="h-8 w-48 bg-slate-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="mb-8">
              <div className="h-4 w-32 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const feedback = data.finalFeedback || {};

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push("/dashboard")} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform"/> Back to Dashboard
        </button>

        {/* 1. HERO REPORT CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Report</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {data.jobDescription.substring(0, 60)}... • {new Date(data.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
                        <span className={`text-3xl font-black ${getScoreColor(data.finalScore)}`}>
                            {data.finalScore}%
                        </span>
                    </div>
                    <div className={`h-10 w-1 ${data.finalScore >= 70 ? 'bg-green-500' : 'bg-orange-500'} rounded-full`}></div>
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Result</span>
                        <span className="text-lg font-bold text-slate-700">{feedback.decision}</span>
                    </div>
                </div>
            </div>
            
            {/* Summary */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {feedback.summary}
                </p>
            </div>

            {/* 2. GAP ANALYSIS (Rich Data) */}
            {/* 2. INITIAL GAP ANALYSIS (Resume vs JD) */}
            {/* We check for 'originalGapAnalysis' which contains the raw data */}
            {feedback.originalGapAnalysis && (
                <div className="mb-8 bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-amber-900 flex items-center gap-2">
                            <TrendingUp size={20}/> Resume Gap Analysis
                        </h3>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                            Match Score: {feedback.originalGapAnalysis.matchScore}%
                        </span>
                    </div>
                    
                    {/* The Initial Feedback Text */}
                    <p className="text-amber-800 text-sm leading-relaxed mb-4">
                        {feedback.originalGapAnalysis.feedback}
                    </p>

                    {/* The Missing Skills Tags */}
                    {feedback.originalGapAnalysis.missingSkills?.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block mb-2">
                                Missing Skills Detected:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {feedback.originalGapAnalysis.missingSkills.map((skill: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white text-amber-700 text-xs font-semibold rounded border border-amber-200 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Strengths & Weaknesses Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <CheckCircle size={20}/> Key Strengths
                    </h3>
                    <ul className="space-y-3">
                        {feedback.strengths?.map((s: string, i: number) => (
                            <li key={i} className="text-sm text-green-900 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"/> {s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                        <XCircle size={20}/> Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                        {feedback.weaknesses?.map((s: string, i: number) => (
                            <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"/> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 3. RECOMMENDATIONS (Rich Data) */}
            {feedback.recommendations && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <Lightbulb size={20}/> Growth Plan & Recommendations
                    </h3>
                    <p className="text-indigo-800 text-sm leading-relaxed">
                        {feedback.recommendations}
                    </p>
                </div>
            )}
        </div>

        {/* 4. DETAILED TRANSCRIPT */}
        <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Transcript</h2>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {data.turns.length} Questions
            </span>
        </div>

        <div className="space-y-6">
            {data.turns.map((turn: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200">
                    
                    {/* Metadata Header */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Q{i+1}
                        </span>
                        {/* Topic Badge */}
                        <span className="flex items-center bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100">
                            <Tag size={12} className="mr-1"/> {turn.topic || "General"}
                        </span>
                        {/* Difficulty Badge */}
                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${getDifficultyColor(turn.difficulty)}`}>
                            <BarChart3 size={12} className="mr-1"/> {turn.difficulty ?? "Medium"}
                        </span>
                    </div>

                    {/* Question */}
                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                        {turn.question}
                    </p>
                    
                    {/* Answer */}
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700 mb-4 border-l-4 border-slate-300 italic">
                        "{turn.answer}"
                    </div>
                    
                    {/* Feedback Footer */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="text-sm text-slate-600">
                            <span className="font-bold text-blue-600 mr-2">Feedback:</span>
                            {turn.feedback}
                        </div>
                        <div className={`shrink-0 font-bold px-3 py-1 rounded-lg text-sm ${getScoreColor(turn.score, true)}`}>
                            Score: {turn.score}/100
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </main>
  );
}

// --- HELPER FUNCTIONS ---

function getScoreColor(score: number, bg = false) {
    if (bg) {
        if (score >= 80) return "bg-green-100 text-green-700";
        if (score >= 50) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    }
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-500";
}

function getDifficultyColor(difficulty: string | null | undefined = "Medium") {
    const d = (difficulty || "Medium").toLowerCase();
    if (d === "hard") return "bg-purple-50 text-purple-700 border-purple-100";
    if (d === "medium") return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-green-50 text-green-700 border-green-100";
}