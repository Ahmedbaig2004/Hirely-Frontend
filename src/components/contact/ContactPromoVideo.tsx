"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Gauge,
  Mic,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

/**
 * Live-style preview for /contact — mirrors Hirely session surfaces (coach insight +
 * delivery signals), not a generic pricing chat.
 */
export function ContactPromoVideo() {
  const reduceMotion = useReducedMotion();
  const gid = useId().replace(/:/g, "");

  const loop = reduceMotion
    ? { duration: 0 }
    : { duration: 14, repeat: Infinity, ease: "linear" as const };

  return (
    <div
      role="img"
      aria-label="Animated preview of a Hirely mock interview session with AI coaching feedback"
      className="group relative mx-auto w-full overflow-hidden rounded-[2rem] border border-white/40 bg-[var(--lp-glass)] shadow-[0_32px_100px_-36px_rgba(219,39,119,0.22)] ring-1 ring-fuchsia-500/15 backdrop-blur-[26px] backdrop-saturate-[1.35] dark:border-white/[0.1] dark:bg-gradient-to-br dark:from-[rgb(13,18,32)] dark:via-[rgb(18,14,28)] dark:to-[rgb(10,14,26)] dark:shadow-[0_44px_120px_-48px_rgba(0,0,0,0.92)] dark:ring-fuchsia-500/25 dark:backdrop-blur-xl"
      style={{
        aspectRatio: "16 / 9",
        minHeight: "min(72vw, 520px)",
        maxHeight: "min(90vh, 800px)",
      }}
    >
      {/* Warm mesh — aligned with landing CTA / brand */}
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-[18%] top-[-10%] h-[115%] w-[72%] rounded-full opacity-[0.38] blur-[88px] dark:opacity-[0.52]"
            style={{
              background:
                "radial-gradient(circle at 38% 42%, rgba(236,72,153,0.42), transparent 56%)",
            }}
            animate={{ x: [0, 22, 0], y: [0, 14, 0], scale: [1, 1.05, 1] }}
            transition={loop}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-[8%] -right-[15%] h-[105%] w-[62%] rounded-full opacity-[0.28] blur-[92px] dark:opacity-[0.48]"
            style={{
              background:
                "radial-gradient(circle at 55% 48%, rgba(251,146,60,0.45), transparent 58%)",
            }}
            animate={{ x: [0, -18, 0], y: [0, -14, 0], scale: [1, 1.06, 1] }}
            transition={{ ...loop, duration: 17 }}
          />
          <motion.div
            className="pointer-events-none absolute left-[18%] top-[42%] h-[55%] w-[52%] rounded-full opacity-[0.22] blur-[70px] dark:opacity-[0.38]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.42), transparent 62%)",
            }}
            animate={{ x: [0, 12, 0], y: [0, -10, 0], scale: [1, 1.04, 1] }}
            transition={{ ...loop, duration: 12 }}
          />
        </>
      )}

      {/* Fine grid — Start / Interview panels */}
      <div
        className="pointer-events-none absolute inset-0 bg-[length:22px_22px] opacity-[0.55] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,72,103,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(57,72,103,0.07)_1px,transparent_1px)",
        }}
        aria-hidden
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22] dark:opacity-[0.4]" aria-hidden>
        <defs>
          <linearGradient id={`hirely-preview-arc-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(236,72,153,0.55)" />
            <stop offset="55%" stopColor="rgba(251,146,60,0.4)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.45)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 12 88 Q 140 36 280 64 T 560 52"
          fill="none"
          stroke={`url(#hirely-preview-arc-${gid})`}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeDasharray="6 11"
          initial={{ pathLength: 0.88 }}
          animate={reduceMotion ? {} : { pathLength: [0.88, 1, 0.88] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 40 140 C 180 108 320 168 520 124"
          fill="none"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity={0.6}
          initial={{ opacity: 0.4 }}
          animate={reduceMotion ? {} : { opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, rgba(236, 72, 153, 0.35), transparent), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
        aria-hidden
      />

      <div className="relative z-[1] flex h-full min-h-0 flex-col justify-between gap-4 p-6 sm:p-8 md:gap-5 md:p-10">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-full border border-fuchsia-500/25 bg-gradient-to-r from-fuchsia-500/12 via-orange-400/12 to-violet-500/12 px-3.5 py-2 shadow-sm backdrop-blur-md dark:border-white/[0.12] dark:from-fuchsia-500/18 dark:via-orange-400/14 dark:to-violet-500/16">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-400" strokeWidth={2.35} />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-800 dark:text-slate-100 sm:text-xs">
              Live session preview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {["Voice & delivery", "STAR-aware nudges", "Actionable scores"].map((t) => (
              <span
                key={t}
                className="rounded-lg border border-slate-300/55 bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          className="glass-card-raised mx-auto w-full max-w-xl rounded-[1.35rem] border border-white/50 p-5 shadow-[0_28px_90px_-34px_rgba(219,39,119,0.28)] dark:border-white/[0.12] dark:shadow-[0_28px_80px_-28px_rgba(0,0,0,0.72)] sm:p-6"
          initial={false}
          animate={reduceMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/80 to-violet-600/90 text-white shadow-lg shadow-fuchsia-500/25">
                <Mic className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-violet-300/40 bg-violet-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-400/35 dark:bg-violet-500/15 dark:text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Behavioral · Q3
                </div>
                <p className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100">
                  Hirely coach
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500">
                  Instant delivery read — same engine as your real session
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-500/10 px-3 py-2 dark:border-emerald-400/25 dark:bg-emerald-500/15">
              <Gauge className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300/95">
                  Signal
                </p>
                <p className="text-sm font-black tabular-nums text-emerald-800 dark:text-emerald-200">
                  +14%
                </p>
              </div>
            </div>
          </div>

          <p className="mb-4 text-[15px] font-semibold leading-snug text-slate-800 dark:text-slate-100 sm:text-base">
            “Describe a conflict you resolved on a tight deadline.”
          </p>

          <div className="space-y-3">
            <SessionInsightStrip reduceMotion={!!reduceMotion} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/70 pt-4 dark:border-white/[0.08]">
            {(
              [
                { label: "Structure", w: "78%" },
                { label: "Evidence", w: "62%" },
                { label: "Pace", w: "84%" },
              ] as const
            ).map(({ label, w }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500">{label}</span>
                <div className="flex h-1.5 w-[4.25rem] overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-700/90">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-orange-400 to-violet-500"
                    style={{ width: w }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="flex h-12 items-end justify-center gap-[3px] sm:justify-start">
            {[14, 28, 38, 22, 34, 20, 30, 18, 26].map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 origin-bottom rounded-full bg-gradient-to-t from-fuchsia-500/60 to-teal-400/95 shadow-sm"
                style={{ height: h }}
                animate={reduceMotion ? {} : { scaleY: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.35,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <p className="text-center text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-300 sm:max-w-lg sm:text-right">
            <span className="bg-gradient-to-r from-fuchsia-600 to-orange-500 bg-clip-text text-transparent dark:from-fuchsia-300 dark:to-amber-300">
              Real session energy
            </span>
            {" — "}
            coaching that scores <em className="not-italic text-slate-800 dark:text-slate-200">how</em> you answer, not just
            keywords. This is Hirely—not a stock chat widget.
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white/50 to-transparent dark:from-black/55"
        aria-hidden
      />
    </div>
  );
}

function SessionInsightStrip({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3.5 dark:border-white/[0.1] dark:bg-white/[0.05]">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20">
          <BrainCircuit className="h-5 w-5 text-violet-600 dark:text-violet-300" strokeWidth={2.1} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300/95">
            Delivery insight
          </p>
          <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
            Lead with outcome, then unpack the tradeoff—recruiters scan for ownership before empathy. You’re
            nearly there.
          </p>
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
          <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden />
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Trending up</span>
        </div>
      </div>

      <motion.div
        className="flex justify-end"
        animate={reduceMotion ? {} : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="inline-flex max-w-[96%] items-center gap-2 rounded-2xl border border-fuchsia-200/60 bg-gradient-to-br from-fuchsia-600/90 via-violet-600/88 to-orange-500/85 px-3.5 py-2.5 text-[13px] font-medium leading-snug text-white shadow-lg shadow-fuchsia-500/15">
          Try one concrete metric in the next sentence — numbers land faster than adjectives.
          <span className="flex gap-0.5">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1 w-1 rounded-full bg-white/90"
                animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.85, repeat: Infinity, delay: d * 0.18 }}
              />
            ))}
          </span>
        </span>
      </motion.div>
    </>
  );
}
