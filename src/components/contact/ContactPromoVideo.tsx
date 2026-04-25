"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative looping “video” for /contact — brand-aligned motion (no external asset).
 * Replace the inner content with <video controls playsInline /> + a file in /public if you export a real clip.
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
      aria-label="Animated preview of Hirely interview support chat"
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] shadow-[0_28px_72px_-36px_rgba(15,23,42,0.16)] backdrop-blur-[28px] backdrop-saturate-150 dark:border-white/[0.09] dark:bg-gradient-to-br dark:from-[rgb(15,23,42)] dark:via-[rgb(17,24,39)] dark:to-[rgb(12,20,35)] dark:shadow-[0_32px_80px_-40px_rgba(0,0,0,0.85)] dark:backdrop-blur-none lg:max-w-none"
      style={{
        aspectRatio: "16 / 10",
        minHeight: "min(52vw, 420px)",
        maxHeight: "560px",
      }}
    >
      {/* Animated mesh / orbs */}
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-1/4 top-0 h-[120%] w-[70%] rounded-full opacity-[0.28] blur-[80px] dark:opacity-[0.55]"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, rgba(34, 211, 238, 0.45), transparent 55%)",
            }}
            animate={{ x: [0, 24, 0], y: [0, 16, 0], scale: [1, 1.06, 1] }}
            transition={loop}
          />
          <motion.div
            className="pointer-events-none absolute -right-1/4 bottom-0 h-[110%] w-[65%] rounded-full opacity-[0.22] blur-[90px] dark:opacity-[0.5]"
            style={{
              background:
                "radial-gradient(circle at 60% 50%, rgba(139, 92, 246, 0.5), transparent 58%)",
            }}
            animate={{ x: [0, -20, 0], y: [0, -12, 0], scale: [1, 1.05, 1] }}
            transition={{ ...loop, duration: 16 }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90%,420px)] w-[min(90%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] dark:opacity-[0.12]"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.4), transparent, rgba(34,211,238,0.35), transparent)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* Soft grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[length:48px_48px] opacity-[0.55] dark:bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] dark:opacity-[0.07]"
        aria-hidden
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] dark:opacity-[0.35]" aria-hidden>
        <defs>
          <linearGradient id={`contactArc-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.35)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 8 72 Q 120 24 240 56 T 480 48"
          fill="none"
          stroke={`url(#contactArc-${gid})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="6 10"
          initial={{ pathLength: 0.92 }}
          animate={reduceMotion ? {} : { pathLength: [0.92, 1, 0.92] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Foreground UI card — chat-style loop */}
      <div className="relative z-[1] flex h-full flex-col justify-between p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[var(--lp-glass-border)] bg-[var(--lp-inner-well)] px-3 py-1.5 backdrop-blur-md dark:border-white/[0.1] dark:bg-black/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
              Live preview
            </span>
          </div>
          <span className="rounded-lg border border-[var(--lp-inner-well-border)] bg-[var(--lp-inner-well)] px-2 py-1 text-[10px] font-medium text-slate-600 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:backdrop-blur-none">
            Hirely
          </span>
        </div>

        <motion.div
          className="mx-auto w-full max-w-[340px] rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-slate-950/55 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] sm:p-5"
          initial={false}
          animate={reduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-3 flex items-center gap-2 border-b border-[var(--lp-inner-well-border)] pb-3 dark:border-white/[0.06]">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-600/40 text-xs font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Interview coach</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-500">Typical response · 2s</p>
            </div>
          </div>
          <BubbleLoop reduceMotion={!!reduceMotion} />
        </motion.div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex h-10 items-end gap-1">
            {[14, 22, 28, 18, 24, 16, 20].map((h, i) => (
              <motion.span
                key={i}
                className="origin-bottom w-1 rounded-full bg-gradient-to-t from-cyan-500/40 to-violet-400/90"
                style={{ height: h }}
                animate={reduceMotion ? {} : { scaleY: [0.55, 1, 0.55] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <p className="max-w-[200px] text-right text-[11px] leading-snug text-slate-600 dark:text-slate-500">
            Practice interviews with feedback that mirrors real hiring bar.
          </p>
        </div>
      </div>

      {/* Bottom gloss */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-200/35 to-transparent dark:from-black/50"
        aria-hidden
      />
    </div>
  );
}

function BubbleLoop({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-start">
        <span className="max-w-[92%] rounded-2xl border border-[var(--lp-inner-well-border)] bg-[var(--lp-inner-well)] px-3.5 py-2.5 text-[13px] leading-snug text-slate-800 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-slate-200 dark:backdrop-blur-none">
          Can I try before I buy?
        </span>
      </div>
      <div className="flex justify-end">
        <span className="max-w-[92%] rounded-2xl bg-gradient-to-br from-blue-600/90 to-cyan-600/85 px-3.5 py-2.5 text-[13px] leading-snug text-white shadow-lg shadow-cyan-500/10">
          Yes — start a free interview anytime.
        </span>
      </div>
      <motion.div
        className="flex justify-start"
        animate={reduceMotion ? {} : { opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--lp-inner-well-border)] bg-[var(--lp-inner-well)] px-3.5 py-2.5 text-[13px] text-slate-700 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-slate-300 dark:backdrop-blur-none">
          How fast is the feedback?
          <span className="flex gap-0.5">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1 w-1 rounded-full bg-cyan-400/90"
                animate={reduceMotion ? {} : { opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.2 }}
              />
            ))}
          </span>
        </span>
      </motion.div>
    </div>
  );
}
