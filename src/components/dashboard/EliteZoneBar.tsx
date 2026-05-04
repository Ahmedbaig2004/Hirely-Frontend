"use client";

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

const statusColors: Record<string, { dot: string; text: string }> = {
  green: { dot: "bg-emerald-400", text: "text-emerald-400" },
  yellow: { dot: "bg-amber-400", text: "text-amber-400" },
  red: { dot: "bg-rose-400", text: "text-rose-400" },
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

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start gap-2 mb-1.5">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
        <div>
          <span className="text-xs font-semibold text-white/80">{label}</span>
          <p className="text-[11px] text-white/50 leading-tight mt-0.5">{tip}</p>
        </div>
      </div>

      <div className="relative h-3 rounded-full bg-white/[0.06] overflow-visible ml-4">
        {/* Elite zone highlight */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${zoneLeftPct}%`,
            width: `${zoneWidthPct}%`,
            background: "rgba(124, 58, 237, 0.2)",
            border: "1px solid rgba(124, 58, 237, 0.35)",
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
              borderColor: "rgba(255,255,255,0.3)",
              boxShadow: `0 0 8px ${markerColor}80`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 ml-4">
        <span className="text-[10px] text-white/30">
          {directionLabels[direction] || direction}
        </span>
        <span className="text-[10px] text-violet-400/60">Elite Zone</span>
      </div>
    </div>
  );
}
