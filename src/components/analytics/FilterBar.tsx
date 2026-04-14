"use client";

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

const activePill: React.CSSProperties = {
  borderColor: "rgba(124,58,237,0.5)",
  boxShadow: "0 0 14px rgba(124,58,237,0.18)",
  color: "rgba(255,255,255,0.95)",
};

const inactivePill: React.CSSProperties = {
  color: "rgba(255,255,255,0.45)",
};

interface FilterBarProps {
  value: AnalyticsFilters;
  onChange: (f: AnalyticsFilters) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
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
