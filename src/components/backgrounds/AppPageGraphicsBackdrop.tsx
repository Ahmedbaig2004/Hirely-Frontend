"use client";

import { useTheme } from "next-themes";

/**
 * Decorative background for app surfaces — gradients, orbs, grid, line art.
 * No blur filters; GPU-friendly transforms only. pointer-events: none.
 */
export type AppPageBackdropVariant = "pricing" | "dashboard" | "analytics" | "about";

const VARIANT = {
  about: {
    orbA: "from-cyan-500/[0.12] via-teal-500/[0.07] to-transparent",
    orbB: "from-blue-600/[0.11] via-indigo-500/[0.08] to-transparent",
    orbC: "from-amber-500/[0.06] to-transparent",
    stroke: "stroke-cyan-400/28",
    mesh: "from-sky-500/[0.07] via-transparent to-violet-600/[0.05]",
  },
  pricing: {
    orbA: "from-violet-500/[0.14] via-fuchsia-500/[0.08] to-transparent",
    orbB: "from-sky-400/[0.1] via-blue-500/[0.09] to-transparent",
    orbC: "from-indigo-500/[0.11] to-transparent",
    stroke: "stroke-violet-400/25",
    mesh: "from-violet-600/[0.07] via-transparent to-cyan-500/[0.06]",
  },
  dashboard: {
    orbA: "from-blue-500/[0.13] via-cyan-500/[0.08] to-transparent",
    orbB: "from-violet-500/[0.11] via-indigo-500/[0.07] to-transparent",
    orbC: "from-emerald-500/[0.07] to-transparent",
    stroke: "stroke-sky-400/22",
    mesh: "from-blue-600/[0.06] via-transparent to-violet-500/[0.05]",
  },
  analytics: {
    orbA: "from-cyan-500/[0.12] via-blue-500/[0.09] to-transparent",
    orbB: "from-violet-500/[0.1] via-fuchsia-500/[0.06] to-transparent",
    orbC: "from-emerald-500/[0.09] to-transparent",
    stroke: "stroke-cyan-400/24",
    mesh: "from-cyan-600/[0.06] via-transparent to-violet-600/[0.06]",
  },
} as const;

/** Stronger saturation/opacity on pastel backgrounds (light theme only) */
const VARIANT_LIGHT = {
  about: {
    orbA: "from-sky-400/[0.28] via-cyan-500/[0.2] to-transparent",
    orbB: "from-blue-500/[0.24] via-indigo-500/[0.16] to-transparent",
    orbC: "from-amber-400/[0.14] to-transparent",
    stroke: "stroke-sky-600/45",
    mesh: "from-sky-400/[0.18] via-transparent to-violet-500/[0.12]",
  },
  pricing: {
    orbA: "from-violet-500/[0.28] via-fuchsia-500/[0.18] to-transparent",
    orbB: "from-sky-400/[0.22] via-blue-500/[0.18] to-transparent",
    orbC: "from-indigo-500/[0.2] to-transparent",
    stroke: "stroke-violet-600/42",
    mesh: "from-violet-500/[0.16] via-transparent to-cyan-500/[0.12]",
  },
  dashboard: {
    orbA: "from-sky-400/[0.26] via-cyan-500/[0.18] to-transparent",
    orbB: "from-violet-500/[0.22] via-indigo-500/[0.15] to-transparent",
    orbC: "from-emerald-500/[0.14] to-transparent",
    stroke: "stroke-sky-600/44",
    mesh: "from-sky-500/[0.15] via-transparent to-violet-500/[0.12]",
  },
  analytics: {
    orbA: "from-sky-400/[0.28] via-cyan-500/[0.2] to-transparent",
    orbB: "from-violet-500/[0.22] via-fuchsia-500/[0.15] to-transparent",
    orbC: "from-emerald-500/[0.16] to-transparent",
    stroke: "stroke-cyan-600/46",
    mesh: "from-sky-400/[0.16] via-transparent to-violet-600/[0.14]",
  },
} as const;

export function AppPageGraphicsBackdrop({
  variant,
}: {
  variant: AppPageBackdropVariant;
}) {
  const { resolvedTheme } = useTheme();
  const v = resolvedTheme === "dark" ? VARIANT[variant] : VARIANT_LIGHT[variant];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base tint */}
      <div className="absolute inset-0 bg-[var(--lp-background)]" />

      {/* Slow mesh wash */}
      <div
        className={`app-backdrop-mesh absolute -inset-[40%] bg-gradient-to-br ${v.mesh} app-backdrop-mesh-shift opacity-90`}
      />

      {/* Large gradient orbs — transform animations only */}
      <div
        className={`absolute -left-[15%] top-[-18%] h-[min(85vw,720px)] w-[min(85vw,720px)] rounded-full bg-gradient-to-br ${v.orbA} app-backdrop-float-a`}
      />
      <div
        className={`absolute -right-[12%] top-[28%] h-[min(70vw,600px)] w-[min(70vw,600px)] rounded-full bg-gradient-to-bl ${v.orbB} app-backdrop-float-b`}
      />
      <div
        className={`absolute bottom-[-20%] left-[22%] h-[min(65vw,560px)] w-[min(65vw,560px)] rounded-full bg-gradient-to-tr ${v.orbC} app-backdrop-float-c`}
      />

      {/* Wire grid */}
      <svg
        className="app-backdrop-grid-fade absolute inset-0 h-full w-full text-primary/35"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`app-grid-${variant}`}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#app-grid-${variant})`} />
      </svg>

      {/* Arc / chart-like curves (stroke animation) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          className={`app-backdrop-path-dash ${v.stroke}`}
          fill="none"
          strokeWidth="1.2"
          d="M 0 520 Q 300 380 600 480 T 1200 420"
        />
        <path
          className={`app-backdrop-path-dash-slow ${v.stroke}`}
          fill="none"
          strokeWidth="0.9"
          opacity={0.45}
          d="M 0 620 Q 400 500 800 560 T 1200 500"
        />
        <circle
          className={`${v.stroke} app-backdrop-ring-a`}
          cx="880"
          cy="220"
          r="120"
          fill="none"
          strokeWidth="0.8"
          opacity={0.35}
        />
        <circle
          className={`${v.stroke} app-backdrop-ring-b`}
          cx="320"
          cy="480"
          r="90"
          fill="none"
          strokeWidth="0.7"
          opacity={0.28}
        />
      </svg>

      {/* Corner accents — small diamonds */}
      <div className="app-backdrop-twinkle absolute right-[8%] top-[14%] h-3 w-3 border border-primary/20" />
      <div className="app-backdrop-twinkle-delayed absolute bottom-[22%] left-[10%] h-2 w-2 border border-cyan-400/25" />
    </div>
  );
}
