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
import { motion } from "framer-motion";
import { MeshGradient } from "@/components/ui/mesh-gradient";

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
      axios
        .get(`${backendUrl}/api/interviews/${id}?userId=${user.id}`)
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
      <main className="min-h-screen bg-[#080810] p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-white/[0.06] rounded mb-6 animate-pulse"></div>
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="h-8 w-48 bg-white/[0.06] rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-white/[0.06] rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-48 bg-white/[0.06] rounded-xl animate-pulse"></div>
            </div>
            <div className="mb-8">
              <div className="h-4 w-32 bg-white/[0.06] rounded mb-2 animate-pulse"></div>
              <div className="h-24 bg-white/[0.04] rounded-lg animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 bg-white/[0.04] rounded-xl animate-pulse"></div>
              <div className="h-48 bg-white/[0.04] rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const feedback = data.finalFeedback || {};

  return (
    <main className="relative min-h-screen bg-[#080810] p-8 font-sans overflow-hidden">
      <MeshGradient />
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-white/40 hover:text-white/70 mb-6 transition group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* 1. HERO REPORT CARD */}
        <div className="glass-card-raised p-8 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white/90 tracking-tight">Interview Report</h1>
              <p className="text-white/40 text-sm mt-1">
                {data.jobDescription.substring(0, 60)}... • {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/[0.06] p-3 rounded-xl border border-white/[0.08]">
              <div className="text-right">
                <span className="block text-xs font-bold text-white/40 uppercase tracking-wider">Score</span>
                <span
                  className={`text-3xl font-black ${getScoreTextColor(data.finalScore)}`}
                  style={{ textShadow: getScoreGlow(data.finalScore) }}
                >
                  {data.finalScore}%
                </span>
              </div>
              <div
                className={`h-10 w-1 rounded-full ${data.finalScore >= 70 ? "bg-emerald-500" : "bg-amber-500"}`}
              ></div>
              <div>
                <span className="block text-xs font-bold text-white/40 uppercase tracking-wider">Result</span>
                <span className="text-lg font-bold text-white/70">{feedback.decision}</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h3 className="label-caps mb-2">Executive Summary</h3>
            <p className="text-white/60 leading-relaxed glass-card p-4 rounded-lg border-l-4 border-violet-500">
              {feedback.summary}
            </p>
          </div>

          {/* Gap Analysis */}
          {feedback.originalGapAnalysis && (
            <div
              className="mb-8 p-6 rounded-xl border border-amber-500/20"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-amber-300 flex items-center gap-2">
                  <TrendingUp size={20} /> Resume Gap Analysis
                </h3>
                <span className="bg-amber-500/15 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
                  Match Score: {feedback.originalGapAnalysis.matchScore}%
                </span>
              </div>
              <p className="text-amber-400/80 text-sm leading-relaxed mb-4">
                {feedback.originalGapAnalysis.feedback}
              </p>
              {feedback.originalGapAnalysis.missingSkills?.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-amber-400/60 uppercase tracking-wide block mb-2">
                    Missing Skills Detected:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {feedback.originalGapAnalysis.missingSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="glass-card px-2 py-1 text-amber-300 text-xs font-semibold rounded border border-amber-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle size={20} /> Key Strengths
              </h3>
              <ul className="space-y-3">
                {feedback.strengths?.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 border-l-2 border-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-bold text-rose-400 mb-4 flex items-center gap-2">
                <XCircle size={20} /> Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {feedback.weaknesses?.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {feedback.recommendations && (
            <div className="glass-card p-6 rounded-xl border-l-4 border-violet-500">
              <h3 className="font-bold text-violet-300 mb-3 flex items-center gap-2">
                <Lightbulb size={20} /> Growth Plan & Recommendations
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{feedback.recommendations}</p>
            </div>
          )}
        </div>

        {/* 4. SCORE BREAKDOWN */}
        {feedback.scores && (
          <div className="glass-card-raised p-8 rounded-2xl mb-8">
            <h3 className="label-caps mb-6 flex items-center gap-2 text-white/40">
              <Gauge size={16} /> Score Breakdown
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {(
                [
                  { label: "Technical", value: feedback.scores.technical },
                  { label: "Voice & Communication", value: feedback.scores.voice },
                  { label: "Combined", value: feedback.scores.combined },
                ] as { label: string; value: number }[]
              ).map(({ label, value }) => {
                const barStyle = getScoreBarStyle(value);
                return (
                  <div key={label}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-semibold text-white/60">{label}</span>
                      <span className={`text-lg font-black ${getScoreTextColor(value)}`}>
                        {Math.round(value)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${value}%`, ...barStyle }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-white/20 mt-4">Combined = 60% Technical + 40% Communication</p>
          </div>
        )}

        {/* 5. VOICE ANALYSIS SUMMARY */}
        {feedback.voiceSummary && (
          <div className="glass-card p-6 rounded-xl border-l-4 border-violet-500 mb-8">
            <div className="flex flex-wrap justify-between items-start mb-5 gap-4">
              <div>
                <h3 className="font-bold text-violet-300 flex items-center gap-2 mb-1">
                  <Mic size={20} /> Voice Analysis Summary
                </h3>
                <p className="text-xs text-white/30">
                  AI-powered acoustic confidence analysis across all answers
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Circular confidence score */}
                {feedback.scores?.voice != null && (
                  <div className="flex flex-col items-center gap-1">
                    <CircularProgress value={feedback.scores.voice} size={88} />
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wide">
                      Confidence
                    </span>
                  </div>
                )}
                {/* WPM badge */}
                {feedback.voiceSummary.avgWPM && feedback.voiceSummary.avgWPM !== "N/A" && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1 bg-violet-500/15 text-violet-300 text-sm font-black px-3 py-2 rounded-xl border border-violet-500/20">
                      <Activity size={14} /> {feedback.voiceSummary.avgWPM}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wide">
                      Avg WPM
                    </span>
                  </div>
                )}
              </div>
            </div>
            {feedback.voiceSummary.allInsights?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.voiceSummary.allInsights.map((insight: string, i: number) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                    <MessageCircle size={14} className="mt-0.5 shrink-0 text-violet-400" />
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/40 italic">
                No specific vocal observations were recorded for this session.
              </p>
            )}
          </div>
        )}

        {/* 6. TRANSCRIPT */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-white/90">Transcript</h2>
          <span className="glass-card text-white/50 text-xs font-bold px-2 py-1 rounded-full">
            {data.turns.length} Questions
          </span>
        </div>

        <div className="space-y-6">
          {data.turns.map((turn: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="glass-card p-6 rounded-xl hover:border-violet-500/30 hover:shadow-[0_0_16px_rgba(124,58,237,0.1)] transition-all duration-200"
            >
              {/* Metadata Header */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white/[0.06] text-white/40 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                  Q{i + 1}
                </span>
                <span className="flex items-center bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded border border-cyan-500/20">
                  <Tag size={12} className="mr-1" /> {turn.topic || "General"}
                </span>
                <span
                  className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${getDifficultyColor(
                    turn.difficulty
                  )}`}
                >
                  <BarChart3 size={12} className="mr-1" /> {turn.difficulty ?? "Medium"}
                </span>
                {turn.voiceAnalysis && turn.voiceAnalysis.status === "completed" && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${getConfidenceBadgeStyle(
                      turn.voiceAnalysis.confidenceLabelText
                    )}`}
                  >
                    <Zap size={12} className="mr-1" />
                    {turn.voiceAnalysis.confidenceLabelText || "N/A"} Confidence
                  </span>
                )}
                {turn.voiceAnalysis?.wordsPerMinute != null && (
                  <span className="flex items-center bg-violet-500/10 text-violet-400 text-xs font-bold px-2 py-1 rounded border border-violet-500/20">
                    <Activity size={12} className="mr-1" />
                    {Math.round(turn.voiceAnalysis.wordsPerMinute)} WPM
                  </span>
                )}
              </div>

              {/* Question */}
              <p className="font-semibold text-white/80 mb-4 text-lg">{turn.question}</p>

              {/* Answer */}
              <div className="bg-white/[0.04] p-4 rounded-lg text-white/50 mb-4 border-l-4 border-white/10 italic">
                &quot;{turn.answer}&quot;
              </div>

              {/* Feedback Footer */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="text-sm text-white/50">
                  <span className="font-bold text-violet-400 mr-2">Feedback:</span>
                  {turn.feedback}
                </div>
                <div
                  className={`shrink-0 font-bold px-3 py-1 rounded-lg text-sm ${getScoreColor(
                    turn.score,
                    true
                  )}`}
                >
                  Score: {turn.score}/100
                </div>
              </div>

              {/* Audio Playback */}
              {turn.audioUrl && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <span className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-2">
                    Your Recording
                  </span>
                  <audio
                    controls
                    src={turn.audioUrl}
                    className="w-full [&::-webkit-media-controls-panel]:bg-transparent"
                    preload="none"
                  />
                </div>
              )}

              {/* Expandable Voice Metrics */}
              {turn.voiceAnalysis && turn.voiceAnalysis.status === "completed" && (
                <details className="mt-4 pt-4 border-t border-white/[0.06]">
                  <summary className="text-xs font-bold text-white/30 uppercase tracking-wider cursor-pointer hover:text-white/50 transition select-none">
                    Voice Metrics Detail
                  </summary>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {/* Confidence — circular progress */}
                    <div className="bg-white/[0.04] p-3 rounded-lg flex flex-col items-center gap-1">
                      <span className="block text-xs text-white/30 mb-1">Confidence</span>
                      <CircularProgress
                        value={
                          turn.voiceAnalysis.confidenceLevel != null
                            ? turn.voiceAnalysis.confidenceLevel * 100
                            : 0
                        }
                        size={60}
                        strokeWidth={5}
                      />
                      <span className="block text-[10px] text-white/20 mt-1">
                        ML confidence score
                      </span>
                    </div>
                    <div className="bg-white/[0.04] p-3 rounded-lg text-center">
                      <span className="block text-xs text-white/30 mb-1">Stability</span>
                      <span
                        className={`text-sm font-bold ${
                          turn.voiceAnalysis.vocalStability != null &&
                          turn.voiceAnalysis.vocalStability >= 0.985
                            ? "text-emerald-400"
                            : "text-white/60"
                        }`}
                      >
                        {turn.voiceAnalysis.vocalStability != null
                          ? `${(turn.voiceAnalysis.vocalStability * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                      <span className="block text-[10px] text-white/20 mt-1">
                        {turn.voiceAnalysis.vocalStability != null &&
                        turn.voiceAnalysis.vocalStability >= 0.985
                          ? "Steady vocal control"
                          : "Some vocal variation"}
                      </span>
                    </div>
                    <div className="bg-white/[0.04] p-3 rounded-lg text-center">
                      <span className="block text-xs text-white/30 mb-1">Fluency</span>
                      <span
                        className={`text-sm font-bold ${
                          turn.voiceAnalysis.speakingFluency != null &&
                          turn.voiceAnalysis.speakingFluency >= 0.8
                            ? "text-emerald-400"
                            : "text-white/60"
                        }`}
                      >
                        {turn.voiceAnalysis.speakingFluency != null
                          ? `${(turn.voiceAnalysis.speakingFluency * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                      <span className="block text-[10px] text-white/20 mt-1">
                        {turn.voiceAnalysis.speakingFluency != null &&
                        turn.voiceAnalysis.speakingFluency >= 0.8
                          ? "Minimal hesitations"
                          : "Noticeable pauses"}
                      </span>
                    </div>
                    <div className="bg-white/[0.04] p-3 rounded-lg text-center">
                      <span className="block text-xs text-white/30 mb-1">Pause Ratio</span>
                      <span
                        className={`text-sm font-bold ${
                          turn.voiceAnalysis.pauseRatio != null &&
                          turn.voiceAnalysis.pauseRatio <= 0.2
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {turn.voiceAnalysis.pauseRatio != null
                          ? `${(turn.voiceAnalysis.pauseRatio * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                      <span className="block text-[10px] text-white/20 mt-1">
                        {turn.voiceAnalysis.pauseRatio != null &&
                        turn.voiceAnalysis.pauseRatio <= 0.2
                          ? "Natural pacing"
                          : "High silence ratio"}
                      </span>
                    </div>
                  </div>

                  {turn.voiceAnalysis.rawFeatures?.featureExplanations?.length > 0 && (
                    <div className="mt-3 glass-card p-3 rounded-lg border-l-4 border-violet-500">
                      <span className="block text-[10px] font-bold text-violet-400/60 uppercase tracking-wider mb-1.5">
                        Why this prediction
                      </span>
                      <ul className="space-y-1">
                        {turn.voiceAnalysis.rawFeatures.featureExplanations
                          .slice(0, 3)
                          .map((explanation: string, idx: number) => (
                            <li key={idx} className="text-xs text-white/50 flex items-start gap-1.5">
                              <span className="mt-1 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                              {explanation}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </details>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

// --- CIRCULAR PROGRESS BAR ---

function CircularProgress({
  value,
  size = 96,
  strokeWidth = 7,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const color = value >= 70 ? "#10B981" : value >= 50 ? "#F59E0B" : "#EF4444";
  const glowColor =
    value >= 70
      ? "drop-shadow(0 0 8px rgba(16,185,129,0.55))"
      : value >= 50
        ? "drop-shadow(0 0 8px rgba(245,158,11,0.55))"
        : "drop-shadow(0 0 8px rgba(239,68,68,0.55))";
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} style={{ filter: glowColor }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black leading-none" style={{ color, fontSize: size * 0.22 }}>
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}

// --- HELPER FUNCTIONS ---

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function getScoreGlow(score: number): string {
  if (score >= 80) return "0 0 16px rgba(16,185,129,0.6)";
  if (score >= 50) return "0 0 16px rgba(245,158,11,0.6)";
  return "0 0 16px rgba(239,68,68,0.6)";
}

function getScoreColor(score: number, bg = false) {
  if (bg) {
    if (score >= 80) return "bg-emerald-500/15 text-emerald-400";
    if (score >= 50) return "bg-amber-500/15 text-amber-400";
    return "bg-rose-500/15 text-rose-400";
  }
  return getScoreTextColor(score);
}

function getScoreBarStyle(score: number): React.CSSProperties {
  if (score >= 75) {
    return {
      background: "linear-gradient(90deg, #10B981, #34D399)",
      boxShadow: "0 0 12px rgba(16,185,129,0.5)",
    };
  }
  if (score >= 50) {
    return {
      background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
      boxShadow: "0 0 12px rgba(245,158,11,0.5)",
    };
  }
  return {
    background: "linear-gradient(90deg, #EF4444, #F87171)",
    boxShadow: "0 0 12px rgba(239,68,68,0.5)",
  };
}

function getDifficultyColor(difficulty: string | null | undefined = "Medium"): string {
  const d = (difficulty || "Medium").toLowerCase();
  if (d === "hard") return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (d === "medium") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
}

function getConfidenceBadgeStyle(label: string | null | undefined): string {
  const l = (label || "").toLowerCase();
  if (l.includes("high")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (l.includes("moderate") || l.includes("medium")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (l.includes("low") || l.includes("need")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  return "bg-white/[0.06] text-white/40 border-white/[0.08]";
}

function getVoiceLabelStyle(label: string): string {
  if (label === "Highly Confident") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  if (label === "Moderately Confident") return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-rose-500/15 text-rose-400 border-rose-500/20";
}
