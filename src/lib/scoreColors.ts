import React from "react";

export function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

export function getScoreGlow(score: number): string {
  if (score >= 80) return "0 0 16px rgba(16,185,129,0.6)";
  if (score >= 50) return "0 0 16px rgba(245,158,11,0.6)";
  return "0 0 16px rgba(239,68,68,0.6)";
}

export function getScoreColor(score: number, bg = false): string {
  if (bg) {
    if (score >= 80) return "bg-emerald-500/15 text-emerald-400";
    if (score >= 50) return "bg-amber-500/15 text-amber-400";
    return "bg-rose-500/15 text-rose-400";
  }
  return getScoreTextColor(score);
}

export function getScoreBarStyle(score: number): React.CSSProperties {
  if (score >= 75) {
    return {
      background: "linear-gradient(90deg, #10B981, #34D399)",
      boxShadow: "0 0 12px rgba(16,185,129,0.5)",
    };
  }
  if (score >= 50) {
    return {
      background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
      boxShadow: "0 0 12px rgba(245,158,11,0.5)",
    };
  }
  return {
    background: "linear-gradient(90deg, #EF4444, #F87171)",
    boxShadow: "0 0 12px rgba(239,68,68,0.5)",
  };
}

export type ScoreHeatmapTheme = "light" | "dark";

/** Fill for heatmap cells — light theme uses stronger tints + readable contrast with dark text */
export function getScoreCellColor(score: number | null, theme: ScoreHeatmapTheme = "light"): string {
  if (score === null) {
    return theme === "light" ? "rgba(27, 38, 44, 0.05)" : "rgba(255,255,255,0.03)";
  }
  if (theme === "light") {
    if (score >= 75) return "rgba(16, 185, 129, 0.35)";
    if (score >= 50) return "rgba(245, 158, 11, 0.38)";
    return "rgba(248, 113, 113, 0.38)";
  }
  if (score >= 75) return "rgba(16,185,129,0.22)";
  if (score >= 50) return "rgba(245,158,11,0.22)";
  return "rgba(239,68,68,0.22)";
}

export function getScoreCellBorder(score: number | null, theme: ScoreHeatmapTheme = "light"): string {
  if (score === null) {
    return theme === "light" ? "rgba(57, 72, 103, 0.14)" : "rgba(255,255,255,0.06)";
  }
  if (theme === "light") {
    if (score >= 75) return "rgba(5, 150, 105, 0.55)";
    if (score >= 50) return "rgba(180, 83, 9, 0.55)";
    return "rgba(185, 28, 28, 0.55)";
  }
  if (score >= 75) return "rgba(16,185,129,0.35)";
  if (score >= 50) return "rgba(245,158,11,0.35)";
  return "rgba(239,68,68,0.35)";
}

/** Text on heatmap score cells */
export function getScoreCellFg(score: number | null, theme: ScoreHeatmapTheme = "light"): string {
  if (score === null) {
    return theme === "light" ? "rgba(57, 72, 103, 0.5)" : "rgba(255,255,255,0.2)";
  }
  if (theme === "dark") return "rgba(255,255,255,0.92)";
  if (score >= 75) return "#065f46";
  if (score >= 50) return "#9a3412";
  return "#9f1239";
}
