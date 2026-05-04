"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

function scoreStroke(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 50) return "#f59e0b";
  return "#fb7185";
}

const R = 50;
const C = 2 * Math.PI * R;

type MatchProps = { score: number; className?: string };

export function MatchScoreRing({ score, className }: MatchProps) {
  const reduceMotion = useReducedMotion();
  const safe = Math.max(0, Math.min(100, score));
  const offset = C - (safe / 100) * C;
  const color = scoreStroke(safe);
  return (
    <div className={cn("relative inline-flex", className)}>
      <svg
        className="h-36 w-36 -rotate-90 drop-shadow-sm"
        viewBox="0 0 120 120"
        aria-hidden
      >
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          className="stroke-slate-200/90 dark:stroke-slate-700/90"
          strokeWidth="9"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 60, damping: 18 }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="text-[2.1rem] font-black tabular-nums leading-none tracking-tight"
          style={{ color }}
        >
          {safe}
          <span className="text-lg font-extrabold">%</span>
        </span>
        <span className="lp-muted mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em]">
          Match
        </span>
      </div>
    </div>
  );
}

type RingProps = { value: number; className?: string; label: string };

/** Determinate ring for the “preparing” progress (0–100). */
export function StepProgressRing({ value, label, className }: RingProps) {
  const reduceMotion = useReducedMotion();
  const gradId = `srg-${useId().replace(/:/g, "")}`;
  const v = Math.max(0, Math.min(100, value));
  const offset = C - (v / 100) * C;
  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center gap-2",
        className
      )}
    >
      <div className="relative inline-flex">
        <svg
          className="h-32 w-32 -rotate-90"
          viewBox="0 0 120 120"
          role="img"
          aria-label={`${label} ${Math.round(v)} percent complete`}
        >
          <title>{`${label} ${Math.round(v)}%`}</title>
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            className="stroke-violet-200/50 dark:stroke-violet-900/50"
            strokeWidth="7"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 80, damping: 22 }
            }
          />
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(124, 58, 237)" />
              <stop offset="100%" stopColor="rgb(45, 212, 191)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tabular-nums lp-hi">
            {Math.round(v)}%
          </span>
        </div>
      </div>
      <p className="lp-muted max-w-[12rem] text-center text-xs font-medium leading-snug">
        {label}
      </p>
    </div>
  );
}

type IndetProps = { className?: string; title: string };

export function IndeterminateFlowRing({ className, title }: IndetProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="status"
      aria-label={title}
    >
      <motion.div
        className="h-20 w-20 rounded-full border-[3px] border-violet-200/60 border-t-violet-600 border-r-teal-500 dark:border-violet-900/50"
        style={{ borderLeftColor: "transparent", borderBottomColor: "transparent" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
      />
    </div>
  );
}
