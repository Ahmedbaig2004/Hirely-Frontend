"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Trophy, MessageSquare,
  Percent, ArrowLeft, Zap,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { FilterBar, type AnalyticsFilters } from "@/components/analytics/FilterBar";
import { StatCard } from "@/components/analytics/StatCard";
import { ScoreTrendChart } from "@/components/analytics/ScoreTrendChart";
import { TypeBreakdownChart } from "@/components/analytics/TypeBreakdownChart";
import { ModalityRadar } from "@/components/analytics/ModalityRadar";
import { TopicHeatmap } from "@/components/analytics/TopicHeatmap";
import { DeliveryChart } from "@/components/analytics/DeliveryChart";
import { DecisionBreakdown } from "@/components/analytics/DecisionBreakdown";
import { VideoInsightsChart } from "@/components/analytics/VideoInsightsChart";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface AnalyticsResponse {
  kpis: {
    totalInterviews: number;
    avgFinalScore: number | null;
    bestScore: number | null;
    totalQuestionsAnswered: number;
    hireRate: number | null;
  };
  trend: { date: string; avgScore: number | null; count: number }[];
  byType: {
    type: string;
    count: number;
    avgScore: number | null;
    avgDelivery: number | null;
    avgVoice: number | null;
    avgVideo: number | null;
  }[];
  modality: {
    technical: number | null;
    delivery: number | null;
    voice: number | null;
    video: number | null;
    contentQuality: number | null;
    combined: number | null;
  };
  topicHeatmap: {
    topic: string;
    count: number;
    Easy: number | null;
    Medium: number | null;
    Hard: number | null;
  }[];
  delivery: {
    avgFillers: number | null;
    avgHedging: number | null;
    avgRestarts: number | null;
    avgRelevance: number | null;
    avgSpecificity: number | null;
  };
  video: {
    avgConfidence: number | null;
    avgRawScore: number | null;
    analyzedTurns: number;
    labelBreakdown: { label: string; count: number }[];
    topSignals: { name: string; impact: number }[];
  };
  decisionBreakdown: { decision: string; count: number }[];
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function serializeFilters(filters: AnalyticsFilters): Record<string, string> {
  const now = new Date();
  const result: Record<string, string> = {};
  if (filters.type !== "all") result.type = filters.type;
  if (filters.range !== "all") {
    const days = filters.range === "7d" ? 7 : filters.range === "30d" ? 30 : 90;
    const from = new Date(now);
    from.setUTCDate(from.getUTCDate() - days);
    result.from = from.toISOString().slice(0, 10);
  }
  return result;
}

// --------------------------------------------------------------------------
// Empty state
// --------------------------------------------------------------------------

function EmptyState({ filtered, onClear, onStart }: { filtered: boolean; onClear: () => void; onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <BarChart3 size={48} className="lp-faint mb-4" />
      <h2 className="text-xl lp-hi font-medium mb-2">
        {filtered ? "No interviews match these filters" : "No data to analyze yet"}
      </h2>
      <p className="lp-sub text-sm mb-6">
        {filtered
          ? "Try adjusting the type or date range filters."
          : "Complete at least one interview to unlock analytics."}
      </p>
      {filtered ? (
        <button onClick={onClear} className="btn-violet flex items-center gap-2 rounded-lg px-4 py-2">
          <BarChart3 size={16} /> Clear filters
        </button>
      ) : (
        <button onClick={onStart} className="btn-violet flex items-center gap-2 rounded-lg px-4 py-2">
          <Zap size={16} /> Start your first interview
        </button>
      )}
    </motion.div>
  );
}

// --------------------------------------------------------------------------
// Analytics Grid
// --------------------------------------------------------------------------

function AnalyticsGrid({ data }: { data: AnalyticsResponse }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Row 1 — KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Total Interviews"
          value={data.kpis.totalInterviews}
          accent="violet"
          delay={0}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Avg Score"
          value={data.kpis.avgFinalScore}
          accent="cyan"
          delay={0.06}
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Best Score"
          value={data.kpis.bestScore}
          accent="emerald"
          delay={0.12}
        />
        <StatCard
          icon={<MessageSquare size={20} />}
          label="Questions Answered"
          value={data.kpis.totalQuestionsAnswered}
          accent="amber"
          delay={0.18}
        />
        <StatCard
          icon={<Percent size={20} />}
          label="Hire Rate"
          value={data.kpis.hireRate}
          suffix="%"
          accent="rose"
          delay={0.24}
        />
      </div>

      {/* Row 2 — Trend (wide) + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border lp-border-sub"
        >
          <p className="label-caps lp-sub mb-4">Score Trend</p>
          <ScoreTrendChart trend={data.trend} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.35 }}
          className="glass-card rounded-2xl p-6 border lp-border-sub"
        >
          <p className="label-caps lp-sub mb-4">Score by Modality</p>
          <ModalityRadar modality={data.modality} />
        </motion.div>
      </div>

      {/* Row 3 — By type + Decision donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="glass-card rounded-2xl p-6 border lp-border-sub"
        >
          <p className="label-caps lp-sub mb-4">Performance by Interview Type</p>
          <TypeBreakdownChart byType={data.byType} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.35 }}
          className="glass-card rounded-2xl p-6 border lp-border-sub"
        >
          <p className="label-caps lp-sub mb-4">Hiring Decision Breakdown</p>
          <DecisionBreakdown
            decisionBreakdown={data.decisionBreakdown}
            totalInterviews={data.kpis.totalInterviews}
          />
        </motion.div>
      </div>

      {/* Row 4 — Topic Heatmap (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="glass-card rounded-2xl p-6 border lp-border-sub"
      >
        <p className="label-caps lp-sub mb-4">Topic × Difficulty Heatmap</p>
        <p className="text-xs lp-sub mb-5 opacity-90">Avg score per topic at each difficulty level (top 10 topics by volume)</p>
        <TopicHeatmap topicHeatmap={data.topicHeatmap} />
      </motion.div>

      {/* Row 5 — Delivery (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.35 }}
        className="glass-card rounded-2xl p-6 border border-l-4 border-cyan-500/40"
      >
        <p className="label-caps lp-sub mb-4">Delivery Analysis</p>
        <DeliveryChart delivery={data.delivery} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35 }}
        className="glass-card rounded-2xl p-6 border border-l-4 border-amber-500/40"
      >
        <p className="label-caps lp-sub mb-4">Video Presence Analysis</p>
        <VideoInsightsChart
          video={
            data.video ?? {
              avgConfidence: null,
              avgRawScore: null,
              analyzedTurns: 0,
              labelBreakdown: [],
              topSignals: [],
            }
          }
        />
      </motion.div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

const DEFAULT_FILTERS: AnalyticsFilters = { type: "all", range: "all" };

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS);

  const fetchData = useCallback(() => {
    if (!user) return;
    setLoading(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
    const params = new URLSearchParams({ userId: user.id, ...serializeFilters(filters) });
    axios
      .get<AnalyticsResponse>(`${backendUrl}/api/analytics?${params}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isFiltered = filters.type !== "all" || filters.range !== "all";
  const isEmpty = !data || data.kpis.totalInterviews === 0;

  return (
    <main
      className="lp-page relative min-h-screen overflow-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <motion.div
        className="relative z-[2] mx-auto max-w-6xl px-6 pb-16 pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black lp-hi">Analytics</h1>
            <p className="lp-sub mt-1 text-sm">Insights across all your interviews</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm lp-sub transition-colors hover:lp-hi"
          >
            <ArrowLeft size={15} />
            History
          </button>
        </div>

        {/* Filters */}
        <FilterBar value={filters} onChange={setFilters} />

        {/* Content */}
        {loading ? (
          <AnalyticsSkeleton />
        ) : isEmpty ? (
          <EmptyState
            filtered={isFiltered}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            onStart={() => router.push("/start")}
          />
        ) : (
          <AnalyticsGrid data={data!} />
        )}
      </motion.div>
    </main>
  );
}
