"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Tooltip, ResponsiveContainer, PolarRadiusAxis,
} from "recharts";
import { TOOLTIP_STYLE, CHART_COLORS, GRID_COLOR } from "./chartTheme";

interface Modality {
  technical: number | null;
  delivery: number | null;
  voice: number | null;
  contentQuality: number | null;
  combined: number | null;
}

interface Props {
  modality: Modality;
}

const AXIS_LABELS: { key: keyof Modality; label: string }[] = [
  { key: "technical",     label: "Technical" },
  { key: "contentQuality",label: "Content" },
  { key: "delivery",      label: "Delivery" },
  { key: "voice",         label: "Voice" },
  { key: "combined",      label: "Combined" },
];

const NO_DATA = (
  <div className="flex items-center justify-center h-[320px] lp-muted text-sm">
    No modality data available
  </div>
);

export function ModalityRadar({ modality }: Props) {
  // Only include axes that have non-null values
  const axes = AXIS_LABELS.filter(({ key }) => modality[key] !== null);
  if (axes.length === 0) return NO_DATA;

  const data = axes.map(({ key, label }) => ({
    subject: label,
    value: modality[key] as number,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
        <PolarGrid stroke={GRID_COLOR} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
          axisLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [`${value ?? "—"}`, "Score"]}
          labelStyle={{ color: "rgba(255,255,255,0.5)" }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke={CHART_COLORS.violetLight}
          fill={CHART_COLORS.violet}
          fillOpacity={0.22}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.violetLight, strokeWidth: 0 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
