"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AXIS_COLOR, GRID_COLOR, TOOLTIP_STYLE, CHART_COLORS } from "./chartTheme";

interface TypeData {
  type: string;
  count: number;
  avgScore: number | null;
  avgDelivery: number | null;
  avgVoice: number | null;
}

interface Props {
  byType: TypeData[];
}

const TYPE_LABELS: Record<string, string> = {
  JOB_SPECIFIC: "Job-Specific",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
};

const NO_DATA = (
  <div className="flex items-center justify-center h-[280px] lp-muted text-sm">
    No type breakdown available
  </div>
);

export function TypeBreakdownChart({ byType }: Props) {
  if (!byType || byType.length === 0) return NO_DATA;

  const data = byType.map((d) => ({
    ...d,
    name: TYPE_LABELS[d.type] ?? d.type,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="name"
          stroke={AXIS_COLOR}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          stroke={AXIS_COLOR}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
          cursor={{ fill: "rgba(124,58,237,0.08)" }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{value}</span>
          )}
        />
        <Bar dataKey="avgScore" name="Avg Score" fill={CHART_COLORS.violet} radius={[4, 4, 0, 0]} maxBarSize={48} />
        <Bar dataKey="avgDelivery" name="Avg Delivery" fill={CHART_COLORS.cyan} radius={[4, 4, 0, 0]} maxBarSize={48} />
        <Bar dataKey="avgVoice" name="Avg Voice" fill={CHART_COLORS.emerald} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
