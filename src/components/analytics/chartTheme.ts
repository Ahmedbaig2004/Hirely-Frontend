import type { CSSProperties } from "react";

export const CHART_COLORS = {
  violet: "#7C3AED",
  violetLight: "#A78BFA",
  cyan: "#22D3EE",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#EF4444",
  emeraldLight: "#34D399",
  amberLight: "#FCD34D",
};

export const AXIS_COLOR = "rgba(255,255,255,0.35)";
export const GRID_COLOR = "rgba(255,255,255,0.07)";
/** Lighter grid for “premium” charts — less visual noise */
export const GRID_FAINT = "rgba(255,255,255,0.045)";

/** Deep analytics chart motion (Recharts) */
export const CHART_ANIM_MS = 1500;
export const CHART_ANIM_EASE = "ease-out" as const;

export const TOOLTIP_STYLE: CSSProperties = {
  background: "rgba(8,8,16,0.97)",
  border: "1px solid rgba(124,58,237,0.45)",
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  color: "rgba(255,255,255,0.9)",
  fontSize: 12,
  boxShadow: "0 0 24px rgba(124,58,237,0.15), 0 8px 32px rgba(0,0,0,0.35)",
};

export const TICK_STYLE = {
  fontSize: 11,
  fill: AXIS_COLOR,
};

export const DECISION_COLORS: Record<string, string> = {
  "Strong Hire": "#10B981",
  "Hire": "#22D3EE",
  "Weak Hire": "#F59E0B",
  "No Hire": "#EF4444",
};
