"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Gauge, LayoutGrid, Lightbulb, List, Sparkles, X } from "lucide-react";
import {
  buildKpis,
  buildScoreTrend,
  buildInsights,
  buildCompetencyRadar,
  labelForType,
  type InterviewLike,
} from "@/lib/dashboardAnalytics";
import {
  ScoreProgressSparkline,
  CompetencyRadarChart,
} from "@/components/dashboard/PersonalDashboardCharts";

export type DashboardMainSection = "overview" | "sessions";

const TABS: { id: DashboardMainSection; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "sessions", label: "Sessions", icon: List },
];

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = value * e;
      const rounded =
        decimals > 0
          ? Math.round(v * 10 ** decimals) / 10 ** decimals
          : Math.round(v);
      setDisplay(rounded);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce, decimals]);

  return (
    <span>
      {decimals > 0 ? display.toFixed(decimals) : display}
      {suffix}
    </span>
  );
}

/** Slim header stat — glass, tight vertical rhythm */
function MicroStat({
  label,
  value,
  hint,
  delay,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-outline-variant/45 bg-surface-container/35 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] leading-snug text-slate-600 dark:text-slate-500">{hint}</p>
      ) : null}
    </motion.div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[88px] rounded-xl border border-outline-variant/35 bg-surface-container-high/70 animate-pulse"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-[240px] rounded-xl border border-outline-variant/35 bg-surface-container-high/60 animate-pulse" />
        <div className="h-[260px] rounded-xl border border-outline-variant/35 bg-surface-container-high/60 animate-pulse" />
      </div>
      <div className="h-[100px] rounded-xl border border-outline-variant/35 bg-surface-container-high/50 animate-pulse" />
    </div>
  );
}

function GlassPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant/50 bg-surface-container/30 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function PersonalDashboardExperience({
  interviews,
  loading,
  drillType,
  onDrill: _onDrill,
  onClearDrill,
  children,
  section: controlledSection,
  onSectionChange,
}: {
  interviews: InterviewLike[];
  loading: boolean;
  drillType: string | null;
  /** Reserved when linking from analytics into a filtered session list */
  onDrill: (type: string) => void;
  onClearDrill: () => void;
  children: React.ReactNode;
  section?: DashboardMainSection;
  onSectionChange?: (s: DashboardMainSection) => void;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [internalSection, setInternalSection] = useState<DashboardMainSection>("overview");
  const section = controlledSection ?? internalSection;
  const setSection = onSectionChange ?? setInternalSection;

  const kpis = useMemo(() => buildKpis(interviews), [interviews]);
  const trend = useMemo(() => buildScoreTrend(interviews), [interviews]);
  const insights = useMemo(() => buildInsights(interviews), [interviews]);
  const radar = useMemo(() => buildCompetencyRadar(interviews), [interviews]);

  const proTips = useMemo(() => insights.slice(0, 3), [insights]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-8">
        <div className="mb-10 h-10 w-64 max-w-full animate-pulse rounded-lg bg-surface-container-high" />
        <OverviewSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-700/85 dark:text-cyan-400/85" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Personal dashboard
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface">
            Your practice at a glance
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Overview snapshot — detailed charts and filters live in Deep analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/start")}
            className="btn-violet inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <Sparkles size={16} />
            New interview
          </button>
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-400/45 bg-white/70 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-sm transition hover:border-cyan-600/40 hover:bg-white/90 dark:border-white/20 dark:bg-white/[0.08] dark:text-slate-200 dark:hover:border-cyan-400/35 dark:hover:bg-white/[0.12]"
          >
            <Gauge size={16} className="opacity-70" />
            Deep analytics
          </Link>
        </div>
      </motion.div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-300/50 pb-3 dark:border-white/10">
        {TABS.map((t) => {
          const active = section === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSection(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-violet-600/45 bg-violet-500/12 text-slate-900 shadow-[0_0_20px_rgba(124,58,237,0.15)] dark:border-violet-400/50 dark:bg-violet-500/20 dark:text-slate-100 dark:shadow-[0_0_26px_rgba(124,58,237,0.28)]"
                  : "border-transparent text-slate-700 hover:border-slate-400/50 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/15 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
              }`}
            >
              <Icon
                size={16}
                className={
                  active ? "text-violet-700 dark:text-violet-200/90" : "text-slate-600 dark:opacity-80"
                }
              />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {drillType && (
          <motion.div
            key="drill"
            role="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-on-surface">
                Filtered to{" "}
                <strong className="text-emerald-300">{labelForType(drillType)}</strong> — open
                Sessions or clear.
              </span>
              <button
                type="button"
                onClick={onClearDrill}
                className="inline-flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface transition hover:bg-surface-container"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
        >
          {section === "overview" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                <MicroStat
                  label="Total sessions"
                  value={<AnimatedNumber value={kpis.total} />}
                  hint="All time"
                  delay={0}
                />
                <MicroStat
                  label="Avg score"
                  value={
                    kpis.avgScore === null ? (
                      "—"
                    ) : (
                      <AnimatedNumber value={kpis.avgScore} suffix="%" decimals={1} />
                    )
                  }
                  hint="Across sessions"
                  delay={0.05}
                />
                <MicroStat
                  label="Success rate"
                  value={
                    kpis.successRate === null ? (
                      "—"
                    ) : (
                      <>
                        <AnimatedNumber value={kpis.successRate} suffix="%" />
                      </>
                    )
                  }
                  hint="Sessions ≥ 70%"
                  delay={0.1}
                />
                <MicroStat
                  label="Activity"
                  value={<AnimatedNumber value={kpis.last7Days} />}
                  hint="Sessions last 7 days"
                  delay={0.15}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <GlassPanel
                  title="Score progression"
                  subtitle="0–100 scale · latest, peak, and session-to-session change"
                >
                  <ScoreProgressSparkline data={trend} />
                </GlassPanel>
                <GlassPanel
                  title="Competency radar"
                  subtitle="Four dimensions — ring ticks show 25 / 50 / 75 / 100"
                >
                  <CompetencyRadarChart data={radar} />
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    Derived from your session scores. For type mix, timelines, and filters, use{" "}
                    <Link
                      href="/dashboard/analytics"
                      className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-primary"
                    >
                      Deep analytics
                    </Link>
                    .
                  </p>
                </GlassPanel>
              </div>

              <div className="rounded-xl border border-outline-variant/45 bg-surface-container/35 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-violet-600 dark:text-primary/80" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pro tips</h3>
                </div>
                {proTips.length > 0 ? (
                  <ul className="space-y-2.5">
                    {proTips.map((ins) => (
                      <li
                        key={ins.title}
                        className="flex gap-2 text-sm leading-snug text-slate-700 dark:text-slate-400"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-primary"
                          aria-hidden
                        />
                        <span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{ins.title}:</span>{" "}
                          {ins.body}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-500">
                    Complete more sessions to unlock tips.
                  </p>
                )}
              </div>
            </div>
          )}

          {section === "sessions" && (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Expand a row for feedback, or open the full report.
              </p>
              {children}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
