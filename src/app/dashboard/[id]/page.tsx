"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Tag,
  Mic,
  Activity,
  Gauge,
  MessageCircle,
  MessageSquare,
  Zap,
  FileText,
  AlertTriangle,
  ChevronDown,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LpBackground from "@/components/landing/LpBackground";
import {
  InterviewReportTranscriptQuestionCharts,
  InterviewReportVocalQuestionCharts,
} from "@/components/dashboard/InterviewReportQuestionCharts";

// Frontend label override — always shows latest human-friendly names
// regardless of what's baked into stored DB JSON
const VOICE_FEATURE_LABELS: Record<string, string> = {
  loudnessPeaksPerSec: "Energy & Emphasis",
  "loudness_sma3_percentile20.0": "Low-volume Clarity",
  loudness_dynamics_power: "Dynamic Range",
  vocal_projection: "Vocal Presence",
  loudness_sma3_meanRisingSlope: "Sentence Energy",
  loudness_sma3_stddevNorm: "Volume Variety",
  voiced_flow: "Speaking Flow",
  vocal_instability: "Voice Steadiness",
  StddevUnvoicedSegmentLength: "Pause Consistency",
  shimmerLocaldB_sma3nz_amean: "Word-to-Word Steadiness",
  shimmerLocaldB_sma3nz_stddevNorm: "Volume Wobble",
  HNRdBACF_sma3nz_amean: "Voice Clarity",
  alphaRatioUV_sma3nz_amean: "Consonant Crispness",
  "slopeUV500-1500_sma3nz_amean": "Voice Brightness",
  F2bandwidth_sma3nz_stddevNorm: "Mouth Movement Consistency",
  "F0semitoneFrom27.5Hz_sma3nz_stddevNorm": "Pitch Variety",
  spectralFluxV_sma3nz_stddevNorm: "Expressive Variety",
  "loudness_sma3_pctlrange0-2": "Whisper-to-Shout Range",
  F3amplitudeLogRelF0_sma3nz_stddevNorm: "Vocal Richness",
  F2amplitudeLogRelF0_sma3nz_stddevNorm: "Vocal Resonance",
  F2amplitudeLogRelF0_sma3nz_amean: "Vowel Power",
  F3frequency_sma3nz_stddevNorm: "Tone Consistency",
  F3amplitudeLogRelF0_sma3nz_amean: "Voice Richness",
};

const resolveLabel = (driver: any) =>
  VOICE_FEATURE_LABELS[driver?.feature] || driver?.label || driver?.feature;

export default function InterviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gapExpanded, setGapExpanded] = useState(false);

  useEffect(() => {
    if (id && user) {
      setLoading(true);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      axios
        .get(`${backendUrl}/api/interviews/${id}?userId=${user.id}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          const errorMsg =
            err.response?.data?.error ||
            err.message ||
            "Failed to load interview";
          toast.error(`Error: ${errorMsg}`);
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, user]);

  if (loading || !data) {
    return (
      <main
        className="lp-page relative min-h-screen overflow-hidden px-8 pb-8 pt-[var(--app-report-page-pt)] font-sans"
        style={{
          background: "transparent",
          color: "var(--lp-foreground)",
        }}
      >
        <LpBackground />
        <div className="relative z-[2] max-w-5xl mx-auto">
          <div className="h-6 w-32 lp-surface-md rounded mb-6 animate-pulse"></div>
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="h-8 w-48 lp-surface-hi rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 lp-surface-md rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-48 lp-surface-hi rounded-xl animate-pulse"></div>
            </div>
            <div className="mb-8">
              <div className="h-4 w-32 lp-surface-md rounded mb-2 animate-pulse"></div>
              <div className="h-24 lp-surface-lo rounded-lg animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 lp-surface-lo rounded-xl animate-pulse"></div>
              <div className="h-48 lp-surface-lo rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const feedback = data.finalFeedback || {};

  return (
    <main
      className="lp-page relative z-0 min-h-screen overflow-hidden px-8 pb-8 pt-[var(--app-report-page-pt)] font-sans"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <LpBackground />
      <motion.div
        className="relative z-[2] max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="group mb-4 flex w-fit items-center text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft
            size={18}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </button>

        {/* 1. HERO REPORT CARD */}
        <div className="glass-card-raised p-8 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Interview Report
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {data.jobDescription
                  ? data.jobDescription.substring(0, 60) + "..."
                  : data.interviewType === "TECHNICAL"
                    ? "Technical Interview"
                    : data.interviewType === "BEHAVIORAL"
                      ? "Behavioral Interview"
                      : "Interview"}{" "}
                • {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4 glass-card p-3 rounded-xl">
              <div className="text-right">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Score
                </span>
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
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Result
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {feedback.decision}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-800 dark:text-cyan-400/90">
              Executive Summary
            </h3>
            <p className="glass-card rounded-lg border-l-4 border-cyan-600/50 p-4 text-base leading-relaxed text-slate-700 dark:border-primary dark:text-slate-300">
              {feedback.summary}
            </p>
          </div>

          {/* Gap Analysis */}
          {feedback.originalGapAnalysis && (
            <div
              className="mb-8 p-6 rounded-xl border border-amber-500/20"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <button
                onClick={() => setGapExpanded((prev) => !prev)}
                className="w-full flex justify-between items-center cursor-pointer"
              >
                <h3 className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <TrendingUp size={20} /> Resume Gap Analysis
                </h3>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-amber-500/35 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-950 dark:text-amber-200">
                    Match Score: {feedback.originalGapAnalysis.matchScore}%
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-amber-800 transition-transform duration-300 dark:text-amber-400/60 ${gapExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {gapExpanded && (
                  <motion.div
                    key="gap-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <p className="mb-4 text-sm leading-relaxed text-amber-950/90 dark:text-amber-200/90">
                        {feedback.originalGapAnalysis.feedback}
                      </p>
                      {feedback.originalGapAnalysis.missingSkills?.length >
                        0 && (
                        <div>
                          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-400/80">
                            Missing Skills Detected:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {feedback.originalGapAnalysis.missingSkills.map(
                              (skill: string, i: number) => (
                                <span
                                  key={i}
                                  className="glass-card px-2 py-1 text-amber-300 text-xs font-semibold rounded border border-amber-500/20"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-400">
                <CheckCircle size={20} /> Key Strengths
              </h3>
              <ul className="space-y-3">
                {feedback.strengths?.map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-rose-800 dark:text-rose-400">
                <XCircle size={20} /> Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {feedback.weaknesses?.map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {feedback.recommendations && (
            <div className="glass-card rounded-xl border-l-4 border-cyan-600/60 p-6 dark:border-primary">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
                <Lightbulb size={20} /> Growth Plan & Recommendations
              </h3>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {feedback.recommendations}
              </p>
            </div>
          )}
        </div>

        {/* 4. SCORE BREAKDOWN */}
        {feedback.scores && (
          <div className="glass-card-raised p-8 rounded-2xl mb-8">
            <h3 className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-800 dark:text-cyan-400/90">
              <Gauge size={16} /> Score Breakdown
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                (() => {
                  const hasVoice = feedback.scores.voice != null;
                  const hasVideo = feedback.scores.video != null;
                  const contentWeight =
                    hasVoice && hasVideo
                      ? "41%"
                      : hasVoice
                        ? "60%"
                        : hasVideo
                          ? "56%"
                          : null;
                  const voiceWeight = hasVoice && hasVideo ? "27%" : "40%";
                  const videoWeight = hasVoice && hasVideo ? "32%" : "44%";
                  return [
                    {
                      label: "Technical",
                      value: feedback.scores.technical,
                      weight: null,
                    },
                    ...(feedback.scores.delivery != null
                      ? [
                          {
                            label: "Delivery",
                            value: feedback.scores.delivery,
                            weight: null,
                          },
                        ]
                      : []),
                    {
                      label: "Content Quality",
                      value:
                        feedback.scores.contentQuality ??
                        feedback.scores.technical,
                      weight: contentWeight,
                    },
                    ...(hasVoice
                      ? [
                          {
                            label: "Vocal Delivery",
                            value: feedback.scores.voice,
                            weight: voiceWeight,
                          },
                        ]
                      : []),
                    ...(hasVideo
                      ? [
                          {
                            label: "Body Language",
                            value: feedback.scores.video,
                            weight: videoWeight,
                          },
                        ]
                      : []),
                    {
                      label: "Combined",
                      value: feedback.scores.combined,
                      weight: null,
                    },
                  ];
                })() as {
                  label: string;
                  value: number;
                  weight: string | null;
                }[]
              ).map(({ label, value, weight }) => {
                const barStyle = getScoreBarStyle(value);
                return (
                  <div key={label}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                        {label}
                        {weight && (
                          <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-500">
                            ({weight})
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-lg font-black ${getScoreTextColor(value)}`}
                      >
                        {Math.round(value)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${value}%`, ...barStyle }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-500">
              Content Quality = Technical accuracy + Delivery quality | Combined
              = 60% Content + 40% Vocal
            </p>
          </div>
        )}

        {/* 5. VOCAL DELIVERY — Actionable metrics + honest framing */}
        {feedback.voiceSummary &&
          (() => {
            const voiceTurnsForScore = data.turns.filter(
              (t: any) =>
                t.voiceAnalysis?.status === "completed" &&
                typeof t.voiceAnalysis?.confidenceLevel === "number",
            );
            const perceptionPct =
              voiceTurnsForScore.length > 0
                ? Math.round(
                    (voiceTurnsForScore.reduce(
                      (s: number, t: any) =>
                        s + t.voiceAnalysis.confidenceLevel,
                      0,
                    ) /
                      voiceTurnsForScore.length) *
                      100,
                  )
                : null;
            const circleStroke =
              perceptionPct == null
                ? "#64748b"
                : perceptionPct >= 70
                  ? "#10B981"
                  : perceptionPct >= 50
                    ? "#F59E0B"
                    : "#EF4444";
            const circumference = 2 * Math.PI * 36;
            const offset =
              perceptionPct == null
                ? circumference
                : circumference * (1 - perceptionPct / 100);

            return (
              <div className="glass-card mb-8 rounded-xl border-l-4 border-cyan-600/60 p-6 dark:border-primary">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
                      <Mic size={20} /> Vocal Delivery
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-500">
                      How interviewers typically perceive your vocal patterns
                    </p>
                  </div>

                  {perceptionPct != null && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-[88px] h-[88px]">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 80 80"
                        >
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="var(--md-sys-color-surface-container-high)"
                            strokeWidth="6"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke={circleStroke}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{
                              filter: `drop-shadow(0 0 6px ${circleStroke}88)`,
                              transition: "stroke-dashoffset 0.6s ease",
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className="text-xl font-black"
                            style={{ color: circleStroke }}
                          >
                            {perceptionPct}
                          </span>
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                            / 100
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-900 dark:text-violet-400/80">
                          Perception Score
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 max-w-[140px] mt-1 leading-snug">
                          Avg across {voiceTurnsForScore.length} voice turn
                          {voiceTurnsForScore.length === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SHAP-driven coaching — final summary + 3 improvements + 2 strengths */}
                {(() => {
                  const voiceTurns = data.turns.filter(
                    (t: any) => t.voiceAnalysis?.status === "completed",
                  );
                  if (voiceTurns.length === 0) return null;

                  // Collect all shapExplanations across turns, deduplicate by feature, keep highest impact
                  const byFeature: Record<string, any> = {};
                  voiceTurns.forEach((t: any) => {
                    const explanations: any[] =
                      t.voiceAnalysis?.rawFeatures?.shapExplanations || [];
                    explanations.forEach((s: any) => {
                      if (!s?.feature) return;
                      const existing = byFeature[s.feature];
                      if (
                        !existing ||
                        Math.abs(s.impact_magnitude) >
                          Math.abs(existing.impact_magnitude)
                      ) {
                        byFeature[s.feature] = s;
                      }
                    });
                  });

                  const allItems = Object.values(byFeature).sort(
                    (a: any, b: any) => b.impact_magnitude - a.impact_magnitude,
                  );
                  // Backend already filters by significance (0.015 threshold) and uncaps strengths
                  const improvements = allItems.filter(
                    (s: any) => s.direction === "decreased",
                  );
                  const strengths = allItems.filter(
                    (s: any) => s.direction === "increased",
                  );

                  // Extract ui_sync category sentiments (already sent by backend)
                  const uiSync = voiceTurns
                    .map((t: any) => t.voiceAnalysis?.rawFeatures?.ui_sync)
                    .find((u: any) => u?.categories);

                  // Final summary: use the first turn that has it
                  const finalSummary = voiceTurns
                    .map((t: any) => t.voiceAnalysis?.rawFeatures?.finalSummary)
                    .find((s: any) => s?.opening);

                  if (
                    improvements.length === 0 &&
                    strengths.length === 0 &&
                    !finalSummary &&
                    !uiSync
                  )
                    return null;

                  const categoryIcons: Record<string, React.ReactNode> = {
                    energy: <Zap size={13} />,
                    fluency: <Activity size={13} />,
                    clarity: <Gauge size={13} />,
                    pace: <Mic size={13} />,
                  };

                  const statusStyles: Record<
                    string,
                    { border: string; text: string; bg: string }
                  > = {
                    "Helped Your Score": {
                      border: "border-emerald-500/50",
                      text: "text-emerald-700 dark:text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                    "Held Back Your Score": {
                      border: "border-amber-500/50",
                      text: "text-amber-800 dark:text-amber-400",
                      bg: "bg-amber-500/10",
                    },
                    "Minimal Impact": {
                      border: "border-slate-300/80 dark:lp-border-sub",
                      text: "text-slate-700 dark:lp-muted",
                      bg: "bg-slate-100/80 dark:lp-surface-lo",
                    },
                    Good: {
                      border: "border-emerald-500/50",
                      text: "text-emerald-700 dark:text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                    "Needs Improvement": {
                      border: "border-amber-500/50",
                      text: "text-amber-800 dark:text-amber-400",
                      bg: "bg-amber-500/10",
                    },
                  };

                  return (
                    <div className="space-y-4 mb-5">
                      {/* Final Summary */}
                      {finalSummary && (
                        <div className="glass-card p-4 rounded-xl border border-violet-500/20">
                          <p className="text-sm font-semibold lp-hi leading-relaxed mb-2">
                            {finalSummary.opening}
                          </p>
                          {finalSummary.focus_note && (
                            <p className="text-xs lp-body leading-relaxed mb-1">
                              {finalSummary.focus_note}
                            </p>
                          )}
                          {finalSummary.best_trait && (
                            <p className="text-xs font-medium leading-relaxed text-violet-900 dark:text-violet-300/90">
                              {finalSummary.best_trait}
                            </p>
                          )}
                          {finalSummary.reminder && (
                            <p className="text-[11px] lp-dim leading-relaxed mt-2 italic">
                              {finalSummary.reminder}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Category Overview — 4 boxes from ui_sync */}
                      {uiSync?.categories && (
                        <div>
                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-900 dark:text-violet-400/80">
                            Category Overview
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(
                              uiSync.categories as Record<string, any>,
                            ).map(([key, cat]: [string, any]) => {
                              const styles =
                                statusStyles[cat.status] ??
                                statusStyles["Minimal Impact"];
                              return (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={`glass-card p-3 rounded-xl border-l-4 ${styles.border}`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className={styles.text}>
                                      {categoryIcons[key] ?? (
                                        <Activity size={13} />
                                      )}
                                    </span>
                                    <span className="text-xs font-bold lp-hi">
                                      {cat.label}
                                    </span>
                                    <div className="flex items-center gap-1 ml-auto">
                                      {cat.impact_pct > 0 &&
                                        cat.status !== "Minimal Impact" && (
                                          <span className="text-[9px] lp-faint">
                                            ~{cat.impact_pct}%
                                          </span>
                                        )}
                                      <span
                                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${styles.bg} ${styles.text} font-semibold`}
                                      >
                                        {cat.status}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] lp-muted leading-relaxed">
                                    {cat.top_driver?.tip}
                                  </p>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Priority Improvements */}
                      {improvements.length > 0 && (
                        <div>
                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-800 dark:text-rose-400/80">
                            Priority Improvements
                          </span>
                          <div className="space-y-2">
                            {improvements.map((item: any, i: number) => (
                              <motion.div
                                key={item.feature}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07, duration: 0.3 }}
                                className="glass-card p-3 rounded-xl border-l-4 border-rose-500/50"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400/70">
                                    {VOICE_FEATURE_LABELS[item.feature] ||
                                      item.label}
                                  </span>
                                  {item.category &&
                                    item.category !== "Other" && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full lp-surface-lo lp-dim font-medium">
                                        {item.category}
                                      </span>
                                    )}
                                </div>
                                <p className="text-xs lp-body mt-1 leading-relaxed">
                                  {item.explanation}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths */}
                      {strengths.length > 0 && (
                        <div>
                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800 dark:text-emerald-400/80">
                            Your Strengths
                          </span>
                          <div className="space-y-2">
                            {strengths.map((item: any, i: number) => (
                              <motion.div
                                key={item.feature}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: i * 0.07 + 0.21,
                                  duration: 0.3,
                                }}
                                className="glass-card p-3 rounded-xl border-l-4 border-emerald-500/50"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400/70">
                                    {VOICE_FEATURE_LABELS[item.feature] ||
                                      item.label}
                                  </span>
                                  {item.category &&
                                    item.category !== "Other" && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full lp-surface-lo lp-dim font-medium">
                                        {item.category}
                                      </span>
                                    )}
                                </div>
                                <p className="text-xs lp-body mt-1 leading-relaxed">
                                  {item.explanation}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Honest framing note */}
                <div className="mb-4 rounded-lg bg-surface-container-low p-3">
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-400">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400/90">
                      These insights are driven by your actual voice data
                    </span>{" "}
                    — the AI identified which vocal traits most influenced your
                    score. The Perception Score also factors in natural voice
                    characteristics that interviewers subconsciously react to
                    but you cannot change — this is why the score may not fully
                    reflect your improvement.
                  </p>
                </div>

                {/* Keep Gemini insights but filter out jargon-heavy ones */}
                {feedback.voiceSummary.allInsights?.length > 0 && (
                  <details className="group">
                    <summary className="cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                      Detailed AI Observations
                    </summary>
                    <ul className="mt-3 space-y-2">
                      {feedback.voiceSummary.allInsights.map(
                        (insight: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                          >
                            <MessageCircle
                              size={14}
                              className="mt-0.5 shrink-0 text-cyan-700 dark:text-primary"
                            />
                            {insight}
                          </li>
                        ),
                      )}
                    </ul>
                  </details>
                )}
              </div>
            );
          })()}

        <InterviewReportVocalQuestionCharts turns={data.turns} />

        {/* 5b. BODY LANGUAGE (Video Analysis) */}
        {(() => {
          const videoTurns = data.turns.filter(
            (t: any) => t.videoAnalysis?.confidenceLevel != null,
          );
          if (videoTurns.length === 0) return null;
          const videoPct = Math.round(
            (videoTurns.reduce(
              (s: number, t: any) => s + t.videoAnalysis.confidenceLevel,
              0,
            ) /
              videoTurns.length) *
              100,
          );
          const videoStroke =
            videoPct >= 70 ? "#10B981" : videoPct >= 50 ? "#F59E0B" : "#EF4444";
          const videoLabel =
            videoPct >= 75
              ? "Highly Confident"
              : videoPct >= 50
                ? "Confident"
                : videoPct >= 30
                  ? "Moderately Confident"
                  : "Needs Improvement";
          const circumference = 2 * Math.PI * 36;
          const offset = circumference * (1 - videoPct / 100);
          return (
            <div className="glass-card mb-8 rounded-xl border-l-4 border-cyan-500/60 p-6 dark:border-cyan-500">
              <div className="flex flex-wrap justify-between items-start mb-5 gap-4">
                <div>
                  <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
                    <Video size={20} /> Body Language
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-500">
                    How interviewers typically perceive your body language and
                    non-verbal cues
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-[88px] h-[88px]">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 80 80"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--md-sys-color-surface-container-high)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke={videoStroke}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-lg font-black"
                        style={{ color: videoStroke }}
                      >
                        {videoPct}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xs font-semibold"
                      style={{ color: videoStroke }}
                    >
                      {videoLabel}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                      Body Language Score
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-500 italic mt-2">
                This score reflects how interviewers may perceive your posture,
                gestures, and facial expressions. Detailed body language
                insights will be available in a future update.
              </p>
            </div>
          );
        })()}

        {/* 6. DELIVERY ANALYSIS SUMMARY */}
        {(() => {
          const turnsWithDelivery = data.turns.filter(
            (t: any) => t.deliveryFeedback,
          );
          if (turnsWithDelivery.length === 0 && !feedback.deliverySummary)
            return null;

          // Aggregate filler words across all turns
          const allFillers: Record<string, number> = {};
          const allHedging: string[] = [];
          const structureFeedbacks: string[] = [];
          const improvements: string[] = [];

          turnsWithDelivery.forEach((t: any) => {
            const d = t.deliveryFeedback;
            if (d.fillerWords) {
              d.fillerWords.forEach((f: any) => {
                allFillers[f.word] = (allFillers[f.word] || 0) + f.count;
              });
            }
            if (d.hedgingPhrases) {
              d.hedgingPhrases.forEach((p: string) => {
                if (!allHedging.includes(p)) allHedging.push(p);
              });
            }
            if (d.structureFeedback)
              structureFeedbacks.push(d.structureFeedback);
            if (d.topImprovement) improvements.push(d.topImprovement);
          });

          const totalFillers =
            feedback.deliverySummary?.totalFillers ??
            Object.values(allFillers).reduce(
              (s: number, c: number) => s + c,
              0,
            );
          const totalHedging =
            feedback.deliverySummary?.totalHedging ?? allHedging.length;
          const avgRelevance = feedback.deliverySummary?.avgRelevance ?? 0;
          const avgSpecificity = feedback.deliverySummary?.avgSpecificity ?? 0;
          const totalRestarts = feedback.deliverySummary?.totalRestarts ?? 0;

          // Deduplicate improvements
          const uniqueImprovements = [...new Set(improvements)];

          return (
            <div className="glass-card mb-8 rounded-xl border-l-4 border-cyan-600 p-6 dark:border-cyan-500">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
                    <FileText size={20} /> Delivery Analysis
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-500">
                    How you communicated your answers — structure, clarity, and
                    language patterns
                  </p>
                </div>
                {feedback.scores?.delivery != null && (
                  <div className="flex flex-col items-center gap-1">
                    <CircularProgress
                      value={feedback.scores.delivery}
                      size={88}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      Delivery Score
                    </span>
                  </div>
                )}
              </div>

              {/* Metric cards row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <span className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
                    Filler Words
                  </span>
                  <span
                    className={`text-lg font-bold ${totalFillers <= 3 ? "text-emerald-700 dark:text-emerald-400" : totalFillers <= 8 ? "text-amber-700 dark:text-amber-400" : "text-rose-700 dark:text-rose-400"}`}
                  >
                    {totalFillers}
                  </span>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <span className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
                    Hedging Phrases
                  </span>
                  <span
                    className={`text-lg font-bold ${totalHedging <= 2 ? "text-emerald-700 dark:text-emerald-400" : totalHedging <= 5 ? "text-amber-700 dark:text-amber-400" : "text-rose-700 dark:text-rose-400"}`}
                  >
                    {totalHedging}
                  </span>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <span className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
                    Relevance
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreTextColor(avgRelevance)}`}
                  >
                    {Math.round(avgRelevance)}%
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-500">
                    How well answers addressed questions
                  </span>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <span className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
                    Specificity
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreTextColor(avgSpecificity)}`}
                  >
                    {Math.round(avgSpecificity)}%
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-500">
                    Concrete examples vs vague statements
                  </span>
                </div>
              </div>

              {/* Filler words breakdown */}
              {Object.keys(allFillers).length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    Filler Words Detected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(allFillers)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([word, count]) => (
                        <span
                          key={word}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            (count as number) >= 3
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-400"
                          }`}
                        >
                          &ldquo;{word}&rdquo; x{count as number}
                        </span>
                      ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-500">
                    Try replacing fillers with a brief pause — silence sounds
                    more confident than &ldquo;um&rdquo; or &ldquo;like&rdquo;.
                  </p>
                </div>
              )}

              {/* Hedging phrases breakdown */}
              {allHedging.length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    Hedging Phrases Detected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allHedging.map((phrase, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-950 dark:text-amber-400"
                      >
                        &ldquo;{phrase}&rdquo;
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-500">
                    Hedging weakens your statements. Instead of &ldquo;I think
                    maybe we could...&rdquo;, say &ldquo;We should...&rdquo; —
                    be direct and assertive.
                  </p>
                </div>
              )}

              {/* Structure feedback per question */}
              {structureFeedbacks.length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    Answer Structure
                  </span>
                  <ul className="space-y-1.5">
                    {structureFeedbacks.map((sf, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className="shrink-0 font-bold text-cyan-800 dark:text-cyan-400">
                          Q{i + 1}:
                        </span>
                        {sf}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sentence restarts */}
              {totalRestarts > 0 && (
                <div className="mb-4 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-400/80">
                  <AlertTriangle size={12} />
                  {totalRestarts} sentence restart{totalRestarts > 1 ? "s" : ""}{" "}
                  detected — practice completing your thoughts before starting a
                  new sentence.
                </div>
              )}

              {/* Top improvements */}
              {uniqueImprovements.length > 0 && (
                <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-cyan-500/40">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-400">
                    How to Improve
                  </span>
                  <ul className="space-y-2">
                    {uniqueImprovements.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <Lightbulb
                          size={14}
                          className="mt-0.5 shrink-0 text-cyan-700 dark:text-cyan-400"
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}

        {/* 7. TRANSCRIPT + score charts */}
        <section
          className="mt-2 scroll-mt-8"
          aria-labelledby="report-transcript-heading"
        >
          <div
            id="report-transcript-heading"
            className="mb-6 flex items-center gap-2"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Transcript
            </h2>
            <span className="glass-card rounded-full px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-400">
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
              className="glass-card p-6 rounded-xl transition-all duration-200"
            >
              {/* Metadata Header */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded bg-surface-container px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-400">
                  Q{i + 1}
                </span>
                <span className="flex items-center rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-900 dark:text-cyan-400">
                  <Tag size={12} className="mr-1" /> {turn.topic || "General"}
                </span>
                <span
                  className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${getDifficultyColor(
                    turn.difficulty,
                  )}`}
                >
                  <BarChart3 size={12} className="mr-1" />{" "}
                  {turn.difficulty ?? "Medium"}
                </span>
                {turn.voiceAnalysis?.wordsPerMinute != null && (
                  <span
                    className="flex items-center text-xs font-bold px-2 py-1 rounded border"
                    style={{
                      background:
                        "color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)",
                      color: "var(--md-sys-color-primary)",
                      borderColor:
                        "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                    }}
                  >
                    <Activity size={12} className="mr-1" />
                    {Math.round(turn.voiceAnalysis.wordsPerMinute)} WPM
                  </span>
                )}
                {turn.answerMode === "chat" && (
                  <span className="flex items-center rounded border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-bold text-slate-800 dark:border-outline-variant dark:bg-surface-container dark:text-slate-300">
                    <MessageSquare size={12} className="mr-1" />
                    Chat Answer
                  </span>
                )}
                {/* Inline Fluency badge */}
                {turn.voiceAnalysis?.speakingFluency != null && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${
                      turn.voiceAnalysis.speakingFluency >= 0.8
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                        : turn.voiceAnalysis.speakingFluency >= 0.5
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-400"
                    }`}
                  >
                    Fluency{" "}
                    {(turn.voiceAnalysis.speakingFluency * 100).toFixed(0)}%
                  </span>
                )}
                {/* Inline Pause Ratio badge */}
                {turn.voiceAnalysis?.pauseRatio != null && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${
                      turn.voiceAnalysis.pauseRatio <= 0.2
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                        : turn.voiceAnalysis.pauseRatio <= 0.4
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-400"
                    }`}
                  >
                    Pauses {(turn.voiceAnalysis.pauseRatio * 100).toFixed(0)}%
                  </span>
                )}
                {/* Inline Relevance badge from delivery analysis */}
                {turn.deliveryFeedback?.relevanceScore != null && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${
                      turn.deliveryFeedback.relevanceScore >= 70
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                        : turn.deliveryFeedback.relevanceScore >= 50
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-400"
                    }`}
                  >
                    Relevance {Math.round(turn.deliveryFeedback.relevanceScore)}
                    %
                  </span>
                )}
              </div>

              {/* Question */}
              <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {turn.question}
              </p>

              {/* Answer */}
              <div className="mb-4 rounded-lg border-l-4 border-slate-300/90 bg-surface-container-low p-4 italic text-slate-700 dark:border-outline-variant dark:text-slate-300">
                &quot;{turn.answer}&quot;
              </div>

              {/* Feedback Footer */}
              <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-outline-variant pt-4 md:flex-row md:items-center">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="mr-2 font-bold text-cyan-800 dark:text-primary">
                    Feedback:
                  </span>
                  {turn.feedback}
                </div>
                <div
                  className={`shrink-0 font-bold px-3 py-1 rounded-lg text-sm ${getScoreColor(
                    turn.score,
                    true,
                  )}`}
                >
                  Score: {turn.score}/100
                </div>
              </div>

              {/* Audio Playback */}
              {turn.audioUrl && (
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
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

              {/* Delivery Feedback — 1 warning + 1 positive */}
              {turn.deliveryFeedback && (
                <div className="mt-4 pt-4 border-t border-outline-variant space-y-2">
                  {turn.deliveryFeedback.topStrength && (
                    <div className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-400/90">
                      <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{turn.deliveryFeedback.topStrength}</span>
                    </div>
                  )}
                  {turn.deliveryFeedback.topImprovement && (
                    <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-400/90">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>{turn.deliveryFeedback.topImprovement}</span>
                    </div>
                  )}
                  {(turn.deliveryFeedback.fillerCount > 0 ||
                    turn.deliveryFeedback.hedgingCount > 0) && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {turn.deliveryFeedback.fillerCount > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${turn.deliveryFeedback.fillerCount <= 2 ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-400" : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-400"}`}
                        >
                          {turn.deliveryFeedback.fillerCount} filler
                          {turn.deliveryFeedback.fillerCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {turn.deliveryFeedback.hedgingCount > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${turn.deliveryFeedback.hedgingCount <= 2 ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-400" : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-400"}`}
                        >
                          {turn.deliveryFeedback.hedgingCount} hedge
                          {turn.deliveryFeedback.hedgingCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <InterviewReportTranscriptQuestionCharts turns={data.turns} />
        </div>
        </section>
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
  const offset =
    circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
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
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--md-sys-color-surface-container-high)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
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
        <span
          className="font-black leading-none"
          style={{ color, fontSize: size * 0.22 }}
        >
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}

// --- HELPER FUNCTIONS ---

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-700 dark:text-emerald-400";
  if (score >= 50) return "text-amber-700 dark:text-amber-400";
  return "text-rose-700 dark:text-rose-400";
}

function getScoreGlow(score: number): string {
  if (score >= 80) return "0 0 16px rgba(16,185,129,0.6)";
  if (score >= 50) return "0 0 16px rgba(245,158,11,0.6)";
  return "0 0 16px rgba(239,68,68,0.6)";
}

function getScoreColor(score: number, bg = false) {
  if (bg) {
    if (score >= 80)
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400";
    if (score >= 50)
      return "bg-amber-500/15 text-amber-800 dark:text-amber-400";
    return "bg-rose-500/15 text-rose-800 dark:text-rose-400";
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

function getDifficultyColor(
  difficulty: string | null | undefined = "Medium",
): string {
  const d = (difficulty || "Medium").toLowerCase();
  if (d === "hard")
    return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-400";
  if (d === "medium")
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-900 dark:text-cyan-400";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400";
}

function getConfidenceBadgeStyle(label: string | null | undefined): string {
  const l = (label || "").toLowerCase();
  if (l.includes("high"))
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400";
  if (l.includes("moderate") || l.includes("medium"))
    return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
  if (l.includes("low") || l.includes("need"))
    return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-400";
  return "border-slate-300/80 bg-slate-100/80 text-slate-700 dark:border-outline-variant dark:bg-surface-container dark:text-slate-400";
}
