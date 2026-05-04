"use client";

import { useTheme } from "next-themes";

interface EliteZoneBarProps {
  label: string;
  tip: string;
  val: number;
  zoneMin: number;
  zoneMax: number;
  direction: "INCREASING" | "DECREASING" | "INVERTED_U";
  status: "green" | "yellow" | "red";
}

const directionLabels: Record<string, string> = {
  INCREASING: "More is better",
  DECREASING: "Less is better",
  INVERTED_U: "Middle is best",
};

const statusColors: Record<string, { dot: string }> = {
  green: { dot: "bg-emerald-500 dark:bg-emerald-400" },
  yellow: { dot: "bg-amber-500 dark:bg-amber-400" },
  red: { dot: "bg-rose-500 dark:bg-rose-400" },
};

export default function EliteZoneBar({
  label,
  tip,
  val,
  zoneMin,
  zoneMax,
  direction,
  status,
}: EliteZoneBarProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";

  const padding = (zoneMax - zoneMin) * 0.5 || 0.5;
  const rangeMin = Math.min(val, zoneMin) - padding;
  const rangeMax = Math.max(val, zoneMax) + padding;
  const totalRange = rangeMax - rangeMin || 1;

  const zoneLeftPct = ((zoneMin - rangeMin) / totalRange) * 100;
  const zoneWidthPct = ((zoneMax - zoneMin) / totalRange) * 100;
  const userPct = ((val - rangeMin) / totalRange) * 100;
  const inZone = val >= zoneMin && val <= zoneMax;

  const colors = statusColors[status] || statusColors.yellow;
  const markerColor = inZone ? "#10B981" : status === "red" ? "#EF4444" : "#F59E0B";
  const zoneFill = isLight
    ? "rgba(124, 58, 237, 0.12)"
    : "rgba(124, 58, 237, 0.2)";
  const zoneBorder = isLight
    ? "1px solid rgba(124, 58, 237, 0.35)"
    : "1px solid rgba(124, 58, 237, 0.35)";
  const trackBg = isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255,255,255,0.06)";

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-start gap-2">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {label}
          </span>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
            {tip}
          </p>
        </div>
      </div>

      <div
        className="relative ml-0 h-3 overflow-visible rounded-full sm:ml-4"
        style={{ background: trackBg }}
      >
        {/* Elite zone highlight */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${zoneLeftPct}%`,
            width: `${zoneWidthPct}%`,
            background: zoneFill,
            border: zoneBorder,
          }}
        />
        {/* User marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${Math.max(2, Math.min(98, userPct))}%` }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full border-2"
            style={{
              backgroundColor: markerColor,
              borderColor: isLight
                ? "rgba(15,23,42,0.22)"
                : "rgba(255,255,255,0.35)",
              boxShadow: `0 0 8px ${markerColor}80`,
            }}
          />
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between sm:ml-4">
        <span className="text-[10px] text-slate-500 dark:text-slate-500">
          {directionLabels[direction] || direction}
        </span>
        <span className="text-[10px] font-medium text-violet-700 dark:text-violet-400/80">
          Elite zone
        </span>
      </div>
    </div>
  );
}
