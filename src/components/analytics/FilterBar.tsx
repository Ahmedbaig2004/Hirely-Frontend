"use client";

import { useTheme } from "next-themes";

export type InterviewTypeFilter = "all" | "JOB_SPECIFIC" | "TECHNICAL" | "BEHAVIORAL";
export type DateRangeFilter = "7d" | "30d" | "90d" | "all";

export interface AnalyticsFilters {
  type: InterviewTypeFilter;
  range: DateRangeFilter;
}

const TYPE_OPTIONS: { value: InterviewTypeFilter; label: string }[] = [
  { value: "all",          label: "All Types" },
  { value: "JOB_SPECIFIC", label: "Job-Specific" },
  { value: "TECHNICAL",    label: "Technical" },
  { value: "BEHAVIORAL",   label: "Behavioral" },
];

const RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: "7d",  label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All time" },
];

interface FilterBarProps {
  value: AnalyticsFilters;
  onChange: (f: AnalyticsFilters) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const activePill: React.CSSProperties = isDark
    ? {
        borderColor: "rgba(124,58,237,0.5)",
        boxShadow: "0 0 14px rgba(124,58,237,0.18)",
        color: "rgba(255,255,255,0.95)",
      }
    : {
        borderColor: "rgba(91, 33, 182, 0.45)",
        boxShadow: "0 2px 12px rgba(91, 33, 182, 0.2), 0 0 0 1px rgba(91, 33, 182, 0.12)",
        color: "rgb(49, 46, 129)",
        background: "rgba(237, 233, 254, 0.75)",
      };

  const inactivePill: React.CSSProperties = isDark
    ? { color: "rgba(255,255,255,0.45)" }
    : { color: "var(--lp-text-body)" };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((opt) => {
          const isActive = value.type === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange({ ...value, type: opt.value })}
              className="glass-card rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
              style={isActive ? activePill : inactivePill}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 lp-surface-hi hidden md:block" />

      {/* Date range filter */}
      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((opt) => {
          const isActive = value.range === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange({ ...value, range: opt.value })}
              className="glass-card rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
              style={isActive ? activePill : inactivePill}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
