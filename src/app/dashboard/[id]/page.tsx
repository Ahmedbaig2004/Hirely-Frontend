"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import {
  ArrowLeft, CheckCircle, XCircle, Lightbulb,
  TrendingUp, BarChart3, Tag, Mic, Activity,
  Gauge, MessageCircle, MessageSquare, Zap,
  FileText, AlertTriangle, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeshGradient } from "@/components/ui/mesh-gradient";

// Frontend label override — always shows latest human-friendly names
// regardless of what's baked into stored DB JSON
const VOICE_FEATURE_LABELS: Record<string, string> = {
  loudnessPeaksPerSec: "Passion & Emphasis",
  "loudness_sma3_percentile20.0": "Quiet-Moment Volume",
  loudness_dynamics_power: "Dynamic Range",
  vocal_projection: "Room-Filling Power",
  loudness_sma3_meanRisingSlope: "Starting Strength",
  loudness_sma3_stddevNorm: "Volume Variety",
  voiced_flow: "Talking in Flow",
  vocal_instability: "Nervousness Meter",
  StddevUnvoicedSegmentLength: "Pause Consistency",
  "shimmerLocaldB_sma3nz_amean": "Word-to-Word Steadiness",
  "shimmerLocaldB_sma3nz_stddevNorm": "Volume Wobble",
  "F3bandwidth_sma3nz_amean": "Mumble-Meter",
  "HNRdBACF_sma3nz_amean": "Voice Smoothness",
  "alphaRatioUV_sma3nz_amean": "Consonant Crispness",
  "slopeUV500-1500_sma3nz_amean": "Speech Crispness",
  spectralFlux_sma3_amean: "Voice Aliveness",
  "F2bandwidth_sma3nz_stddevNorm": "Mouth Movement Consistency",
  "F0semitoneFrom27.5Hz_sma3nz_stddevNorm": "Pitch Movement",
  "logRelF0-H1-H2_sma3nz_amean": "Breath Control",
  "spectralFluxV_sma3nz_stddevNorm": "Expressive Variety",
  equivalentSoundLevel_dBp: "Overall Volume",
  "loudness_sma3_pctlrange0-2": "Whisper-to-Shout Range",
  "F3amplitudeLogRelF0_sma3nz_stddevNorm": "Voice Richness Variety",
  "F2amplitudeLogRelF0_sma3nz_amean": "Vowel Power",
  "F1amplitudeLogRelF0_sma3nz_amean": "Open-Mouth Resonance",
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
      <main className="min-h-screen bg-background p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-surface-container rounded mb-6 animate-pulse"></div>
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="h-8 w-48 bg-surface-container rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-surface-container rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-48 bg-surface-container rounded-xl animate-pulse"></div>
            </div>
            <div className="mb-8">
              <div className="h-4 w-32 bg-surface-container rounded mb-2 animate-pulse"></div>
              <div className="h-24 bg-surface-container-low rounded-lg animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 bg-surface-container-low rounded-xl animate-pulse"></div>
              <div className="h-48 bg-surface-container-low rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const feedback = data.finalFeedback || {};

  return (
    <main className="relative min-h-screen bg-background p-8 font-sans overflow-hidden">
      <MeshGradient />
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-on-surface-variant hover:text-on-surface mb-6 transition group opacity-55 hover:opacity-90"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* 1. HERO REPORT CARD */}
        <div className="glass-card-raised p-8 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight opacity-90">Interview Report</h1>
              <p className="text-on-surface-variant text-sm mt-1 opacity-50">
                {data.jobDescription.substring(0, 60)}... • {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4 glass-card p-3 rounded-xl">
              <div className="text-right">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider opacity-50">Score</span>
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
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider opacity-50">Result</span>
                <span className="text-lg font-bold text-on-surface opacity-80">{feedback.decision}</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h3 className="label-caps mb-2">Executive Summary</h3>
            <p className="text-on-surface-variant leading-relaxed glass-card p-4 rounded-lg border-l-4 border-primary opacity-80">
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
                <h3 className="font-bold text-amber-300 flex items-center gap-2">
                  <TrendingUp size={20} /> Resume Gap Analysis
                </h3>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/15 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
                    Match Score: {feedback.originalGapAnalysis.matchScore}%
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-amber-400/60 transition-transform duration-300 ${gapExpanded ? "rotate-180" : ""}`}
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
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2 opacity-70">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
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
                  <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2 opacity-70">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {feedback.recommendations && (
            <div className="glass-card p-6 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                <Lightbulb size={20} /> Growth Plan & Recommendations
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed opacity-70">{feedback.recommendations}</p>
            </div>
          )}
        </div>

        {/* 4. SCORE BREAKDOWN */}
        {feedback.scores && (
          <div className="glass-card-raised p-8 rounded-2xl mb-8">
            <h3 className="label-caps mb-6 flex items-center gap-2">
              <Gauge size={16} /> Score Breakdown
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                [
                  { label: "Technical", value: feedback.scores.technical, weight: null },
                  ...(feedback.scores.delivery != null
                    ? [{ label: "Delivery", value: feedback.scores.delivery, weight: null }]
                    : []),
                  { label: "Content Quality", value: feedback.scores.contentQuality ?? feedback.scores.technical, weight: feedback.scores.voice != null ? "60%" : null },
                  ...(feedback.scores.voice != null
                    ? [{ label: "Vocal Delivery", value: feedback.scores.voice, weight: "40%" }]
                    : []),
                  { label: "Combined", value: feedback.scores.combined, weight: null },
                ] as { label: string; value: number; weight: string | null }[]
              ).map(({ label, value, weight }) => {
                const barStyle = getScoreBarStyle(value);
                return (
                  <div key={label}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-semibold text-on-surface-variant opacity-70">
                        {label}
                        {weight && <span className="text-[10px] opacity-50 ml-1">({weight})</span>}
                      </span>
                      <span className={`text-lg font-black ${getScoreTextColor(value)}`}>
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
            <p className="text-xs text-on-surface-variant mt-4 opacity-30">
              Content Quality = Technical accuracy + Delivery quality | Combined = 60% Content + 40% Vocal
            </p>
          </div>
        )}

        {/* 5. VOCAL DELIVERY — Actionable metrics + honest framing */}
        {feedback.voiceSummary && (
          <div className="glass-card p-6 rounded-xl border-l-4 border-primary mb-8">
            <div className="flex flex-wrap justify-between items-start mb-5 gap-4">
              <div>
                <h3 className="font-bold text-primary flex items-center gap-2 mb-1">
                  <Mic size={20} /> Vocal Delivery
                </h3>
                <p className="text-xs text-on-surface-variant opacity-40">
                  How interviewers typically perceive your vocal patterns
                </p>
              </div>
              <div className="flex items-center gap-4">
                {feedback.scores?.voice != null && (
                  <div className="flex flex-col items-center gap-1">
                    <CircularProgress value={feedback.scores.voice} size={88} />
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide opacity-40">
                      Perception Score
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Category sentiment cards — SHAP-driven (new) or threshold fallback (legacy) */}
            {(() => {
              const voiceTurns = data.turns.filter((t: any) => t.voiceAnalysis?.status === "completed");
              if (voiceTurns.length === 0) return null;

              // Check if ANY turn has ui_sync data
              const hasUiSync = voiceTurns.some((t: any) => t.voiceAnalysis?.rawFeatures?.ui_sync?.categories);

              if (hasUiSync) {
                // --- SHAP-driven categories ---
                const categoryKeys = ["fluency", "energy", "clarity"];
                const aggregated: Record<string, { shap_sum: number; count: number; top_driver: any; label: string }> = {};

                voiceTurns.forEach((t: any) => {
                  const uiSync = t.voiceAnalysis?.rawFeatures?.ui_sync;
                  if (!uiSync?.categories) return;
                  for (const key of categoryKeys) {
                    const cat = uiSync.categories[key];
                    if (!cat) continue;
                    if (!aggregated[key]) aggregated[key] = { shap_sum: 0, count: 0, top_driver: cat.top_driver, label: cat.label };
                    aggregated[key].shap_sum += cat.shap_sum;
                    aggregated[key].count += 1;
                    if (Math.abs(cat.top_driver?.shap_value || 0) > Math.abs(aggregated[key].top_driver?.shap_value || 0)) {
                      aggregated[key].top_driver = cat.top_driver;
                    }
                  }
                });

                const cats = categoryKeys.filter(k => aggregated[k]?.count > 0);
                if (cats.length === 0) return null;

                // Collect coaching tips
                const tips: { label: string; tip: string; direction: string; category: string }[] = [];
                const seen = new Set<string>();
                voiceTurns.forEach((t: any) => {
                  const catData = t.voiceAnalysis?.rawFeatures?.ui_sync?.categories;
                  if (!catData) return;
                  for (const [, cat] of Object.entries(catData) as [string, any][]) {
                    const d = cat.top_driver;
                    if (d?.tip && !seen.has(d.feature)) {
                      seen.add(d.feature);
                      tips.push({ label: resolveLabel(d), tip: d.tip, direction: d.direction, category: cat.label });
                    }
                  }
                });

                // Primary goal: single most impactful thing to fix
                const primaryGoal = voiceTurns
                  .map((t: any) => t.voiceAnalysis?.rawFeatures?.ui_sync?.primary_goal)
                  .find((g: any) => g != null);

                return (
                  <>
                    {primaryGoal && (
                      <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-violet-500/60 mb-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400/70">Your #1 Goal</span>
                        <p className="text-sm font-semibold text-on-surface mt-1">{VOICE_FEATURE_LABELS[primaryGoal.feature] || primaryGoal.label}</p>
                        <p className="text-xs text-on-surface-variant opacity-60 mt-1 leading-relaxed">{primaryGoal.tip}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {cats.map((key) => {
                        const cat = aggregated[key];
                        const avgShap = cat.shap_sum / cat.count;
                        const status = avgShap > 0.01 ? "Good" : avgShap < -0.01 ? "Needs Improvement" : "Neutral";
                        const statusColor = status === "Good" ? "text-emerald-400" : status === "Needs Improvement" ? "text-rose-400" : "text-amber-400";
                        const driver = cat.top_driver;

                        return (
                          <div key={key} className="bg-surface-container-low p-3 rounded-lg text-center">
                            <span className="block text-xs text-on-surface-variant mb-1 opacity-40">{cat.label}</span>
                            <span className={`text-lg font-bold ${statusColor}`}>{status}</span>
                            {driver && (
                              <span className="block text-[10px] text-on-surface-variant mt-1 opacity-40 leading-snug">
                                {driver.direction === "positive" ? "Driven by " : "Held back by "}
                                <span className="font-semibold text-on-surface-variant opacity-70">{resolveLabel(driver)}</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {tips.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {tips.map((t, i) => (
                          <div key={i} className={`bg-surface-container-low p-3 rounded-lg border-l-2 ${t.direction === "positive" ? "border-emerald-500/40" : t.direction === "negative" ? "border-rose-500/40" : "border-amber-500/40"}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{t.category} — {t.label}</span>
                            <p className="text-xs text-on-surface-variant opacity-60 mt-1 leading-relaxed">{t.tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              }

              // --- Fallback: legacy threshold-based boxes (pre-SHAP data) ---
              const avgWPM = voiceTurns.reduce((s: number, t: any) => s + (t.voiceAnalysis.wordsPerMinute || 0), 0) / voiceTurns.length;
              const avgPauseRatio = voiceTurns.reduce((s: number, t: any) => s + (t.voiceAnalysis.pauseRatio || 0), 0) / voiceTurns.length;
              const avgPitchStd = voiceTurns.reduce((s: number, t: any) => s + (t.voiceAnalysis.pitchStd || 0), 0) / voiceTurns.length;
              const paceOk = avgWPM >= 100 && avgWPM <= 160;
              const pauseOk = avgPauseRatio <= 0.2;
              const pitchVarOk = avgPitchStd >= 15;

              return (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Speaking Pace</span>
                    <span className={`text-lg font-bold ${paceOk ? "text-emerald-400" : "text-amber-400"}`}>
                      {Math.round(avgWPM)} <span className="text-xs font-normal opacity-60">WPM</span>
                    </span>
                    <span className="block text-[10px] text-on-surface-variant mt-1 opacity-30">
                      {avgWPM < 100 ? "Too slow — speak more naturally" : avgWPM > 160 ? "Too fast — slow down slightly" : "Good pace (100-160 range)"}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Pauses</span>
                    <span className={`text-lg font-bold ${pauseOk ? "text-emerald-400" : avgPauseRatio <= 0.4 ? "text-amber-400" : "text-rose-400"}`}>
                      {(avgPauseRatio * 100).toFixed(0)}%
                    </span>
                    <span className="block text-[10px] text-on-surface-variant mt-1 opacity-30">
                      {pauseOk ? "Natural flow" : avgPauseRatio <= 0.4 ? "Some silence gaps — connect thoughts" : "High silence — practice fluency"}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Pitch Variation</span>
                    <span className={`text-lg font-bold ${pitchVarOk ? "text-emerald-400" : "text-amber-400"}`}>
                      {pitchVarOk ? "Varied" : "Flat"}
                    </span>
                    <span className="block text-[10px] text-on-surface-variant mt-1 opacity-30">
                      {pitchVarOk ? "Engaging vocal variation" : "Try emphasizing key words"}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Honest framing note */}
            <div className="bg-surface-container-low p-3 rounded-lg mb-4">
              <p className="text-[11px] text-on-surface-variant opacity-45 leading-relaxed">
                <span className="font-bold text-emerald-400/70">These insights are driven by your actual voice data</span> — the AI identified which vocal traits most influenced your score.
                The Perception Score also factors in natural voice characteristics that interviewers subconsciously react to but you cannot change — this is why the score may not fully reflect your improvement.
                Your Delivery Analysis score (transcript quality) has the highest impact and is entirely in your hands.
              </p>
            </div>

            {/* Keep Gemini insights but filter out jargon-heavy ones */}
            {feedback.voiceSummary.allInsights?.length > 0 && (
              <details className="group">
                <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:text-on-surface transition select-none opacity-40 hover:opacity-70">
                  Detailed AI Observations
                </summary>
                <ul className="space-y-2 mt-3">
                  {feedback.voiceSummary.allInsights.map((insight: string, i: number) => (
                    <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2 opacity-60">
                      <MessageCircle size={14} className="mt-0.5 shrink-0 text-primary" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* 6. DELIVERY ANALYSIS SUMMARY */}
        {(() => {
          const turnsWithDelivery = data.turns.filter((t: any) => t.deliveryFeedback);
          if (turnsWithDelivery.length === 0 && !feedback.deliverySummary) return null;

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
            if (d.structureFeedback) structureFeedbacks.push(d.structureFeedback);
            if (d.topImprovement) improvements.push(d.topImprovement);
          });

          const totalFillers = feedback.deliverySummary?.totalFillers ?? Object.values(allFillers).reduce((s: number, c: number) => s + c, 0);
          const totalHedging = feedback.deliverySummary?.totalHedging ?? allHedging.length;
          const avgRelevance = feedback.deliverySummary?.avgRelevance ?? 0;
          const avgSpecificity = feedback.deliverySummary?.avgSpecificity ?? 0;
          const totalRestarts = feedback.deliverySummary?.totalRestarts ?? 0;

          // Deduplicate improvements
          const uniqueImprovements = [...new Set(improvements)];

          return (
            <div className="glass-card p-6 rounded-xl border-l-4 border-cyan-500 mb-8">
              <div className="flex flex-wrap justify-between items-start mb-5 gap-4">
                <div>
                  <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-1">
                    <FileText size={20} /> Delivery Analysis
                  </h3>
                  <p className="text-xs text-on-surface-variant opacity-40">
                    How you communicated your answers — structure, clarity, and language patterns
                  </p>
                </div>
                {feedback.scores?.delivery != null && (
                  <div className="flex flex-col items-center gap-1">
                    <CircularProgress value={feedback.scores.delivery} size={88} />
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide opacity-40">
                      Delivery Score
                    </span>
                  </div>
                )}
              </div>

              {/* Metric cards row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-surface-container-low p-3 rounded-lg text-center">
                  <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Filler Words</span>
                  <span className={`text-lg font-bold ${totalFillers <= 3 ? "text-emerald-400" : totalFillers <= 8 ? "text-amber-400" : "text-rose-400"}`}>
                    {totalFillers}
                  </span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg text-center">
                  <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Hedging Phrases</span>
                  <span className={`text-lg font-bold ${totalHedging <= 2 ? "text-emerald-400" : totalHedging <= 5 ? "text-amber-400" : "text-rose-400"}`}>
                    {totalHedging}
                  </span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg text-center">
                  <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Relevance</span>
                  <span className={`text-lg font-bold ${getScoreTextColor(avgRelevance)}`}>
                    {Math.round(avgRelevance)}%
                  </span>
                  <span className="block text-[10px] text-on-surface-variant mt-1 opacity-30">
                    How well answers addressed questions
                  </span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg text-center">
                  <span className="block text-xs text-on-surface-variant mb-1 opacity-40">Specificity</span>
                  <span className={`text-lg font-bold ${getScoreTextColor(avgSpecificity)}`}>
                    {Math.round(avgSpecificity)}%
                  </span>
                  <span className="block text-[10px] text-on-surface-variant mt-1 opacity-30">
                    Concrete examples vs vague statements
                  </span>
                </div>
              </div>

              {/* Filler words breakdown */}
              {Object.keys(allFillers).length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 opacity-50">
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
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          &ldquo;{word}&rdquo; x{count as number}
                        </span>
                      ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-2 opacity-40">
                    Try replacing fillers with a brief pause — silence sounds more confident than &ldquo;um&rdquo; or &ldquo;like&rdquo;.
                  </p>
                </div>
              )}

              {/* Hedging phrases breakdown */}
              {allHedging.length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 opacity-50">
                    Hedging Phrases Detected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allHedging.map((phrase, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold px-2.5 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20"
                      >
                        &ldquo;{phrase}&rdquo;
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-2 opacity-40">
                    Hedging weakens your statements. Instead of &ldquo;I think maybe we could...&rdquo;, say &ldquo;We should...&rdquo; — be direct and assertive.
                  </p>
                </div>
              )}

              {/* Structure feedback per question */}
              {structureFeedbacks.length > 0 && (
                <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 opacity-50">
                    Answer Structure
                  </span>
                  <ul className="space-y-1.5">
                    {structureFeedbacks.map((sf, i) => (
                      <li key={i} className="text-xs text-on-surface-variant flex items-start gap-2 opacity-65">
                        <span className="shrink-0 text-cyan-400 font-bold">Q{i + 1}:</span>
                        {sf}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sentence restarts */}
              {totalRestarts > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-400/70 mb-4">
                  <AlertTriangle size={12} />
                  {totalRestarts} sentence restart{totalRestarts > 1 ? "s" : ""} detected — practice completing your thoughts before starting a new sentence.
                </div>
              )}

              {/* Top improvements */}
              {uniqueImprovements.length > 0 && (
                <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-cyan-500/40">
                  <span className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 opacity-70">
                    How to Improve
                  </span>
                  <ul className="space-y-2">
                    {uniqueImprovements.map((tip, i) => (
                      <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2 opacity-70">
                        <Lightbulb size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}

        {/* 7. TRANSCRIPT */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-on-surface opacity-90">Transcript</h2>
          <span className="glass-card text-on-surface-variant text-xs font-bold px-2 py-1 rounded-full opacity-70">
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
                <span className="bg-surface-container text-on-surface-variant text-xs font-bold px-2 py-1 rounded uppercase tracking-wide opacity-60">
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
                  <span
                    className="flex items-center text-xs font-bold px-2 py-1 rounded border"
                    style={{
                      background: "color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)",
                      color: "var(--md-sys-color-primary)",
                      borderColor: "color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)",
                    }}
                  >
                    <Activity size={12} className="mr-1" />
                    {Math.round(turn.voiceAnalysis.wordsPerMinute)} WPM
                  </span>
                )}
                {turn.answerMode === "chat" && (
                  <span
                    className="flex items-center text-xs font-bold px-2 py-1 rounded border"
                    style={{
                      background: "var(--md-sys-color-surface-container)",
                      color: "var(--md-sys-color-on-surface-variant)",
                      borderColor: "var(--md-sys-color-outline-variant)",
                    }}
                  >
                    <MessageSquare size={12} className="mr-1" />
                    Chat Answer
                  </span>
                )}
                {/* Inline Fluency badge */}
                {turn.voiceAnalysis?.speakingFluency != null && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${
                      turn.voiceAnalysis.speakingFluency >= 0.8
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : turn.voiceAnalysis.speakingFluency >= 0.5
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    Fluency {(turn.voiceAnalysis.speakingFluency * 100).toFixed(0)}%
                  </span>
                )}
                {/* Inline Pause Ratio badge */}
                {turn.voiceAnalysis?.pauseRatio != null && (
                  <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded border ${
                      turn.voiceAnalysis.pauseRatio <= 0.2
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : turn.voiceAnalysis.pauseRatio <= 0.4
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
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
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : turn.deliveryFeedback.relevanceScore >= 50
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    Relevance {Math.round(turn.deliveryFeedback.relevanceScore)}%
                  </span>
                )}
              </div>

              {/* Question */}
              <p className="font-semibold text-on-surface mb-4 text-lg opacity-85">{turn.question}</p>

              {/* Answer */}
              <div className="bg-surface-container-low p-4 rounded-lg text-on-surface-variant mb-4 border-l-4 border-outline-variant italic opacity-70">
                &quot;{turn.answer}&quot;
              </div>

              {/* Feedback Footer */}
              <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="text-sm text-on-surface-variant opacity-70">
                  <span className="font-bold text-primary mr-2">Feedback:</span>
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
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 opacity-40">
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
                    <div className="flex items-start gap-2 text-sm text-emerald-400/80">
                      <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{turn.deliveryFeedback.topStrength}</span>
                    </div>
                  )}
                  {turn.deliveryFeedback.topImprovement && (
                    <div className="flex items-start gap-2 text-sm text-amber-400/80">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>{turn.deliveryFeedback.topImprovement}</span>
                    </div>
                  )}
                  {(turn.deliveryFeedback.fillerCount > 0 || turn.deliveryFeedback.hedgingCount > 0) && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {turn.deliveryFeedback.fillerCount > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${turn.deliveryFeedback.fillerCount <= 2 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                          {turn.deliveryFeedback.fillerCount} filler{turn.deliveryFeedback.fillerCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {turn.deliveryFeedback.hedgingCount > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${turn.deliveryFeedback.hedgingCount <= 2 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                          {turn.deliveryFeedback.hedgingCount} hedge{turn.deliveryFeedback.hedgingCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>
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
          stroke="var(--md-sys-color-surface-container-high)"
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
  if (d === "hard") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  if (d === "medium") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
}

function getConfidenceBadgeStyle(label: string | null | undefined): string {
  const l = (label || "").toLowerCase();
  if (l.includes("high")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (l.includes("moderate") || l.includes("medium")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (l.includes("low") || l.includes("need")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  return "bg-surface-container text-on-surface-variant border-outline-variant opacity-60";
}
