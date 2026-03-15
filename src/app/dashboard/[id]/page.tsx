"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import {
  ArrowLeft, CheckCircle, XCircle, Lightbulb,
  TrendingUp, BarChart3, Tag, Mic, Activity,
  Gauge, MessageCircle, Zap
} from "lucide-react";

export default function InterviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
        axios.get(`${backendUrl}/api/interviews/${id}?userId=${user.id}`)
          .then((res) => {
            setData(res.data);
            setLoading(false);
          })
          .catch((err) => {
            const errorMsg = err.response?.data?.error || err.message || "Failed to load interview";
            toast.error(`Error: ${errorMsg}`);
            console.error(err);
            setLoading(false);
          });
    }
  }, [id, user]);

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

            {/* 2. INITIAL GAP ANALYSIS (Resume vs JD) */}
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

                    <p className="text-amber-800 text-sm leading-relaxed mb-4">
                        {feedback.originalGapAnalysis.feedback}
                    </p>

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

            {/* 3. RECOMMENDATIONS */}
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

        {/* ══════════════════════════════════════════════ */}
        {/* 4. SCORE BREAKDOWN                            */}
        {/* ══════════════════════════════════════════════ */}
        {feedback.scores && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Gauge size={16} /> Score Breakdown
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Technical Score */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-slate-700">Technical</span>
                  <span className={`text-lg font-black ${getScoreColor(feedback.scores.technical)}`}>
                    {Math.round(feedback.scores.technical)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(feedback.scores.technical)}`}
                    style={{ width: `${feedback.scores.technical}%` }}
                  />
                </div>
              </div>
              {/* Voice & Communication Score */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-slate-700">Voice & Communication</span>
                  <span className={`text-lg font-black ${getScoreColor(feedback.scores.voice)}`}>
                    {Math.round(feedback.scores.voice)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(feedback.scores.voice)}`}
                    style={{ width: `${feedback.scores.voice}%` }}
                  />
                </div>
              </div>
              {/* Combined Score */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-slate-700">Combined</span>
                  <span className={`text-lg font-black ${getScoreColor(feedback.scores.combined)}`}>
                    {Math.round(feedback.scores.combined)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(feedback.scores.combined)}`}
                    style={{ width: `${feedback.scores.combined}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Combined = 60% Technical + 40% Communication
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* 5. VOICE ANALYSIS SUMMARY                     */}
        {/* ══════════════════════════════════════════════ */}
        {feedback.voiceSummary && (
          <div className="bg-violet-50 p-6 rounded-xl border border-violet-100 mb-8">
            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
              <h3 className="font-bold text-violet-900 flex items-center gap-2">
                <Mic size={20} /> Voice Analysis Summary
              </h3>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getVoiceLabelStyle(feedback.voiceSummary.overallLabel)}`}>
                  {feedback.voiceSummary.overallLabel}
                </span>
                {feedback.voiceSummary.avgWPM && feedback.voiceSummary.avgWPM !== "N/A" && (
                  <span className="flex items-center gap-1 bg-violet-100 text-violet-800 text-xs font-bold px-3 py-1 rounded-full border border-violet-200">
                    <Activity size={12} /> {feedback.voiceSummary.avgWPM} WPM
                  </span>
                )}
              </div>
            </div>

            {feedback.voiceSummary.allInsights?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.voiceSummary.allInsights.map((insight: string, i: number) => (
                  <li key={i} className="text-sm text-violet-900 flex items-start gap-2">
                    <MessageCircle size={14} className="mt-0.5 shrink-0 text-violet-500" />
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-violet-700 italic">
                No specific vocal observations were recorded for this session.
              </p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* 6. DETAILED TRANSCRIPT                        */}
        {/* ══════════════════════════════════════════════ */}
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
                        {/* Voice Confidence Badge */}
                        {turn.voiceAnalysis && turn.voiceAnalysis.status === "completed" && (
                          <span className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${getConfidenceBadgeStyle(turn.voiceAnalysis.confidenceLabelText)}`}>
                            <Zap size={12} className="mr-1" />
                            {turn.voiceAnalysis.confidenceLabelText || "N/A"} Confidence
                          </span>
                        )}
                        {/* WPM Badge */}
                        {turn.voiceAnalysis?.wordsPerMinute != null && (
                          <span className="flex items-center bg-violet-50 text-violet-600 text-xs font-bold px-2 py-1 rounded border border-violet-100">
                            <Activity size={12} className="mr-1" />
                            {Math.round(turn.voiceAnalysis.wordsPerMinute)} WPM
                          </span>
                        )}
                    </div>

                    {/* Question */}
                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                        {turn.question}
                    </p>

                    {/* Answer */}
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700 mb-4 border-l-4 border-slate-300 italic">
                        &quot;{turn.answer}&quot;
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

                    {/* Audio Playback */}
                    {turn.audioUrl && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Your Recording
                        </span>
                        <audio
                          controls
                          src={turn.audioUrl}
                          className="w-full"
                          preload="none"
                        />
                      </div>
                    )}

                    {/* Expandable Voice Metrics Detail */}
                    {turn.voiceAnalysis && turn.voiceAnalysis.status === "completed" && (
                      <details className="mt-4 pt-4 border-t border-slate-100">
                        <summary className="text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 transition select-none">
                          Voice Metrics Detail
                        </summary>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="block text-xs text-slate-400 mb-1">Quality</span>
                            <span className="text-sm font-bold text-slate-700">
                              {turn.voiceAnalysis.speakingQuality != null
                                ? `${(turn.voiceAnalysis.speakingQuality * 100).toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              Model prediction certainty
                            </span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="block text-xs text-slate-400 mb-1">Stability</span>
                            <span className={`text-sm font-bold ${
                              turn.voiceAnalysis.vocalStability != null && turn.voiceAnalysis.vocalStability >= 0.985
                                ? "text-green-600" : "text-slate-700"
                            }`}>
                              {turn.voiceAnalysis.vocalStability != null
                                ? `${(turn.voiceAnalysis.vocalStability * 100).toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              {turn.voiceAnalysis.vocalStability != null && turn.voiceAnalysis.vocalStability >= 0.985
                                ? "Steady vocal control"
                                : "Some vocal variation"}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="block text-xs text-slate-400 mb-1">Fluency</span>
                            <span className={`text-sm font-bold ${
                              turn.voiceAnalysis.speakingFluency != null && turn.voiceAnalysis.speakingFluency >= 0.8
                                ? "text-green-600" : "text-slate-700"
                            }`}>
                              {turn.voiceAnalysis.speakingFluency != null
                                ? `${(turn.voiceAnalysis.speakingFluency * 100).toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              {turn.voiceAnalysis.speakingFluency != null && turn.voiceAnalysis.speakingFluency >= 0.8
                                ? "Minimal hesitations"
                                : "Noticeable pauses"}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="block text-xs text-slate-400 mb-1">Pause Ratio</span>
                            <span className={`text-sm font-bold ${
                              turn.voiceAnalysis.pauseRatio != null && turn.voiceAnalysis.pauseRatio <= 0.2
                                ? "text-green-600" : "text-amber-600"
                            }`}>
                              {turn.voiceAnalysis.pauseRatio != null
                                ? `${(turn.voiceAnalysis.pauseRatio * 100).toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              {turn.voiceAnalysis.pauseRatio != null && turn.voiceAnalysis.pauseRatio <= 0.2
                                ? "Natural pacing" : "High silence ratio"}
                            </span>
                          </div>
                        </div>

                        {/* Feature explanations from the ML model */}
                        {turn.voiceAnalysis.rawFeatures?.featureExplanations?.length > 0 && (
                          <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                              Why this prediction
                            </span>
                            <ul className="space-y-1">
                              {turn.voiceAnalysis.rawFeatures.featureExplanations.slice(0, 3).map(
                                (explanation: string, idx: number) => (
                                  <li key={idx} className="text-xs text-blue-800 flex items-start gap-1.5">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                    {explanation}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </details>
                    )}
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

function getScoreBarColor(score: number): string {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
}

function getConfidenceBadgeStyle(label: string | null | undefined): string {
    const l = (label || "").toLowerCase();
    if (l.includes("high")) return "bg-green-100 text-green-700 border-green-200";
    if (l.includes("moderate") || l.includes("medium")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (l.includes("low") || l.includes("need")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-slate-100 text-slate-500 border-slate-200";
}

function getVoiceLabelStyle(label: string): string {
    if (label === "Highly Confident") return "bg-green-100 text-green-800 border-green-200";
    if (label === "Moderately Confident") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
}
