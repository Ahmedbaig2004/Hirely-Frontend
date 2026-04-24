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

/** Stronger hues for light-theme canvases (analytics + dashboard) */
export const CHART_COLORS_ON_LIGHT = {
  violet: "#5b21b6",
  violetLight: "#6d28d9",
  cyan: "#0e7490",
  emerald: "#047857",
  amber: "#c2410c",
  rose: "#b91c1c",
  emeraldLight: "#059669",
  amberLight: "#d97706",
} as const;

export type ChartPalette = typeof CHART_COLORS;

export function pickChartColors(isLight: boolean): ChartPalette {
  return isLight ? { ...CHART_COLORS, ...CHART_COLORS_ON_LIGHT } : CHART_COLORS;
}

export const AXIS_COLOR = "var(--chart-axis-color)";
export const GRID_COLOR = "var(--chart-grid-color)";
/** Lighter grid for “premium” charts — less visual noise */
export const GRID_FAINT = "var(--chart-grid-faint)";
export const AXIS_MUTED = "var(--chart-axis-muted)";
export const RADAR_GRID_STROKE = "var(--chart-radar-grid)";
export const RADAR_DOT_FILL = "var(--chart-radar-dot)";
export const RADAR_LABEL_FILL = "var(--chart-radar-label-fill)";
export const CHART_TICK_FAINT = "var(--chart-tick-faint)";
export const PIE_CELL_STROKE = "var(--chart-pie-cell-stroke)";
export const REF_LINE_1 = "var(--chart-ref-line-1)";
export const REF_LINE_2 = "var(--chart-ref-line-2)";
export const DECISION_RING_STROKE = "var(--chart-decision-ring)";
export const CHART_CURSOR_STROKE = "var(--chart-cursor-stroke)";

/** Deep analytics chart motion (Recharts) */
export const CHART_ANIM_MS = 1500;
export const CHART_ANIM_EASE = "ease-out" as const;

export const TOOLTIP_STYLE: CSSProperties = {
  background: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  color: "var(--chart-tooltip-color)",
  fontSize: 12,
  boxShadow: "var(--chart-tooltip-shadow)",
};

export const TICK_STYLE = {
  fontSize: 11,
  fill: AXIS_COLOR,
};

export const DECISION_COLORS: Record<string, string> = {
  "Strong Hire": "#10B981",
  Hire: "#22D3EE",
  "Weak Hire": "#F59E0B",
  "No Hire": "#EF4444",
};
