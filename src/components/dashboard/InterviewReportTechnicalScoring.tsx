"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Cpu,
  Target,
  TrendingDown,
  TrendingUp,
  Layers,
  GitCompareArrows,
  Layers2,
  Info,
} from "lucide-react";
import { parseNumericScore } from "@/components/dashboard/InterviewReportQuestionCharts";

type TurnInput = {
  score?: number | string | null;
  difficulty?: string;
};

type ScoresInput = {
  technical?: number;
  delivery?: number | null;
  voice?: number | null;
  video?: number | null;
  contentQuality?: number;
  combined?: number;
};

function normDifficulty(d?: string): "Easy" | "Medium" | "Hard" | "Other" {
  const x = (d || "").toLowerCase();
  if (x.includes("hard")) return "Hard";
  if (x.includes("medium") || x === "med") return "Medium";
  if (x.includes("easy")) return "Easy";
  return "Other";
}

function mean(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function tierLabel(v: number): { label: string; sub: string; band: string } {
  if (v >= 82) return { label: "Strong technical signal", sub: "Clear command of the topics tested.", band: "Strong" };
  if (v >= 70) return { label: "Solid foundation", sub: "On track — tighten depth on harder prompts.", band: "Solid" };
  if (v >= 55)
    return { label: "Developing", sub: "Core ideas land; push for specifics and structure.", band: "Developing" };
  return {
    label: "Needs reinforcement",
    sub: "Review fundamentals and practice structured answers.",
    band: "Build",
  };
}

/** Ring + bar fills — semantic performance, not question category */
function strokeForScore(v: number): string {
  if (v >= 70) return "#10B981";
  if (v >= 50) return "#F59E0B";
  return "#EF4444";
}

type Props = {
  scores?: ScoresInput | null;
  turns: TurnInput[];
};

/**
 * Technical performance hero: gauge, tier narrative, session stats, difficulty strips (performance-colored fills).
 */
export function InterviewReportTechnicalScoring({ scores, turns }: Props) {
  const reduceMotion = useReducedMotion();

  const derived = useMemo(() => {
    const parsed = turns
      .map((t, i) => ({
        idx: i + 1,
        score: parseNumericScore(t.score),
        diff: normDifficulty(t.difficulty),
      }))
      .filter((x): x is typeof x & { score: number } => x.score !== undefined);

    const turnScores = parsed.map((p) => p.score);
    const sessionTechnical =
      typeof scores?.technical === "number" && Number.isFinite(scores.technical)
        ? Math.round(Math.min(100, Math.max(0, scores.technical)))
        : mean(turnScores);

    if (sessionTechnical == null || !Number.isFinite(sessionTechnical)) {
      return null;
    }

    const buckets: Record<"Easy" | "Medium" | "Hard", number[]> = {
      Easy: [],
      Medium: [],
      Hard: [],
    };
    for (const p of parsed) {
      if (p.diff === "Easy" || p.diff === "Medium" || p.diff === "Hard") {
        buckets[p.diff].push(p.score);
      }
    }
    const difficultyBars = (["Easy", "Medium", "Hard"] as const)
      .map((name) => ({
        name,
        avg: mean(buckets[name]),
        n: buckets[name].length,
      }))
      .filter((row) => row.n > 0 && row.avg != null) as { name: string; avg: number; n: number }[];

    let best: { idx: number; score: number } | null = null;
    let worst: { idx: number; score: number } | null = null;
    for (const p of parsed) {
      if (!best || p.score > best.score) best = { idx: p.idx, score: p.score };
      if (!worst || p.score < worst.score) worst = { idx: p.idx, score: p.score };
    }
    const spread =
      best && worst && parsed.length >= 2 ? Math.max(0, best.score - worst.score) : null;

    return {
      sessionTechnical,
      difficultyBars,
      best,
      worst,
      spread,
      turnCount: parsed.length,
    };
  }, [scores, turns]);

  if (!derived) return null;

  const { sessionTechnical, difficultyBars, best, worst, spread, turnCount } = derived;
  const tier = tierLabel(sessionTechnical);
  const stroke = strokeForScore(sessionTechnical);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - sessionTechnical / 100);

  const bandBadge =
    tier.band === "Strong"
      ? "border-emerald-400/35 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-200"
      : tier.band === "Solid"
        ? "border-cyan-400/35 bg-cyan-500/[0.08] text-cyan-900 dark:text-cyan-200"
        : tier.band === "Developing"
          ? "border-amber-400/40 bg-amber-500/[0.1] text-amber-950 dark:text-amber-200"
          : "border-rose-400/35 bg-rose-500/[0.08] text-rose-900 dark:text-rose-100";

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-raised relative mb-8 overflow-hidden rounded-[1.35rem] border border-slate-200/90 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-28px_rgba(15,23,42,0.25)] dark:border-slate-700/85 dark:shadow-none"
      aria-labelledby="technical-intel-heading"
    >
      {/* Ambient layer — restrained so content stays readable */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.22]"
        style={{
          background:
            "radial-gradient(800px 360px at 8% -5%, rgba(34,211,238,0.07), transparent 50%), radial-gradient(640px 320px at 98% 100%, rgba(99,102,241,0.06), transparent 48%)",
        }}
      />

      {/* Top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-white/15" />

      <div className="relative px-5 py-8 sm:px-8 sm:py-10">
        <header className="mb-10 max-w-3xl">
          <p className="label-caps mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
            Performance lens
          </p>
          <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <h3
              id="technical-intel-heading"
              className="flex items-center gap-3 text-[1.65rem] font-bold tracking-tight text-slate-900 sm:text-[1.85rem] dark:text-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/90 to-teal-600/95 text-white shadow-lg shadow-cyan-500/20 ring-4 ring-white/80 dark:from-cyan-500/85 dark:to-teal-600/90 dark:ring-white/10">
                <Cpu size={23} strokeWidth={1.8} aria-hidden />
              </span>
              Technical intelligence
            </h3>
          </div>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
            One headline grade for this session, a quick rhythm read across answers, and difficulty slices when prompts
            are labeled.
          </p>
        </header>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/85 bg-gradient-to-br from-white via-slate-50/90 to-white shadow-sm dark:border-slate-700/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:items-center lg:gap-12">
            {/* Gauge */}
            <div className="relative mx-auto flex w-full max-w-[200px] flex-col items-center justify-center lg:mx-0">
              <div
                className="absolute inset-0 -translate-y-2 scale-[1.06] rounded-full blur-3xl opacity-[0.22]"
                style={{ backgroundColor: stroke }}
                aria-hidden
              />
              <div className="relative grid place-items-center">
                <svg width={164} height={164} viewBox="0 0 164 164" className="-rotate-90" aria-hidden>
                  <defs>
                    <linearGradient id="technical-ring-soft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={stroke} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={stroke} stopOpacity={0.65} />
                    </linearGradient>
                  </defs>
                  <circle
                    cx={82}
                    cy={82}
                    r={52}
                    fill="none"
                    className="text-slate-200 dark:text-slate-700"
                    stroke="currentColor"
                    strokeWidth={10}
                  />
                  <circle
                    cx={82}
                    cy={82}
                    r={52}
                    fill="none"
                    stroke="url(#technical-ring-soft)"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      filter: `drop-shadow(0 0 14px color-mix(in srgb, ${stroke} 35%, transparent))`,
                      transition: "stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)",
                    }}
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[2.85rem] font-black tabular-nums leading-none tracking-tight text-slate-950 dark:text-white">
                    {sessionTechnical}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    of 100
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="min-w-0 space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${bandBadge}`}>
                  {tier.band} band
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Session verdict
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold leading-snug text-slate-900 dark:text-white sm:text-xl">{tier.label}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tier.sub}</p>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200/70 bg-white/70 px-3.5 py-3 dark:border-slate-700/80 dark:bg-slate-950/55">
                <Info
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500"
                  aria-hidden
                />
                <p className="text-left text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                  The ring mirrors the headline technical grade for this transcript. Everything below digs into variance
                  across answers — bar <span className="font-semibold text-slate-700 dark:text-slate-300">fills</span> use
                  the same green / amber / red scale so a low slice never looks falsely “successful.”
                </p>
              </div>
            </div>
          </div>

          {/* Session + difficulty */}
          <div className="grid gap-0 border-t border-slate-200/80 bg-white/40 lg:grid-cols-2 dark:border-slate-800/70 dark:bg-slate-950/40">
            <div className="border-b border-slate-200/80 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:border-r-slate-200/70 dark:border-slate-800/75 dark:lg:border-r-slate-800/65">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.06]">
                  <Layers2 size={17} strokeWidth={2} className="text-slate-600 dark:text-slate-300" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Session rhythm
                  </p>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400">How answers behaved this run</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-[0_1px_0_rgba(255,255,255,1)_inset] dark:border-slate-700/70 dark:bg-slate-950/85">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Layers size={12} aria-hidden /> Graded answers
                  </dt>
                  <dd className="mt-2 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{turnCount}</dd>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 dark:border-slate-700/70 dark:bg-slate-950/85">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <TrendingUp size={12} aria-hidden /> Peak
                  </dt>
                  <dd className="mt-2 text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                    {best ? <>Q{best.idx} · {best.score}</> : "—"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 dark:border-slate-700/70 dark:bg-slate-950/85">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <TrendingDown size={12} aria-hidden /> Low point
                  </dt>
                  <dd className="mt-2 text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                    {worst ? <>Q{worst.idx} · {worst.score}</> : "—"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 dark:border-slate-700/70 dark:bg-slate-950/85">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <GitCompareArrows size={12} aria-hidden /> Spread
                  </dt>
                  <dd className="mt-2 text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                    {spread != null ? `${spread} pts` : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.06]">
                  <Target size={17} strokeWidth={2} className="text-slate-600 dark:text-slate-300" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    By difficulty label
                  </p>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400">
                    Left accent = prompt type — bar fill = performance on that tier
                  </p>
                </div>
              </div>

              {difficultyBars.length === 0 ? (
                <div className="flex min-h-[120px] flex-col justify-center rounded-2xl border border-dashed border-slate-300/90 bg-slate-50/50 px-5 py-6 text-center dark:border-slate-600/85 dark:bg-slate-950/40">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No difficulty tags on graded turns</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    When interviewers tag Easy / Medium / Hard per answer, slices appear here automatically.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3.5">
                  {difficultyBars.map((row, i) => {
                    const fill = strokeForScore(row.avg);
                    return (
                      <motion.li
                        key={row.name}
                        initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: reduceMotion ? 0 : i * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={
                          "overflow-hidden rounded-2xl border border-slate-200/65 bg-white/90 pl-0 dark:border-slate-700/75 dark:bg-slate-950/70 " +
                          (row.name === "Hard"
                            ? "border-l-[3px] border-l-violet-500 dark:border-l-violet-400"
                            : row.name === "Medium"
                              ? "border-l-[3px] border-l-sky-500 dark:border-l-sky-400"
                              : "border-l-[3px] border-l-slate-400 dark:border-l-slate-500")
                        }
                      >
                        <div className="flex items-center gap-3 py-3.5 pl-3.5 pr-4 sm:pl-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{row.name}</span>
                              <span className="text-[13px] font-bold tabular-nums" style={{ color: fill }}>
                                {row.avg}
                                <span className="font-semibold opacity-65"> /100</span>
                              </span>
                            </div>
                            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200/95 dark:bg-slate-700/95">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${fill}, color-mix(in srgb, ${fill} 82%, white))`,
                                }}
                                initial={reduceMotion ? false : { width: 0 }}
                                animate={{ width: `${Math.min(100, Math.max(0, row.avg))}%` }}
                                transition={{
                                  duration: reduceMotion ? 0 : 0.75,
                                  delay: reduceMotion ? 0 : 0.12 + i * 0.05,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              />
                            </div>
                            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                              Average over {row.n} answer{row.n === 1 ? "" : "s"} in this bucket
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-center text-[10px] leading-relaxed text-slate-400 sm:text-left dark:text-slate-500">
          <span>
            Derived from transcript grading — unrelated to filler timing in playback.
          </span>
        </p>
      </div>
    </motion.section>
  );
}
