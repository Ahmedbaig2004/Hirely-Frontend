"use client";

import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { AXIS_COLOR, GRID_COLOR, TOOLTIP_STYLE, CHART_COLORS } from "./chartTheme";

interface TrendPoint {
  date: string;
  avgScore: number | null;
  count: number;
}

interface Props {
  trend: TrendPoint[];
}

const NO_DATA = (
  <div className="flex items-center justify-center h-[280px] lp-muted text-sm">
    No trend data for this period
  </div>
);

export function ScoreTrendChart({ trend }: Props) {
  const hasData = trend.length > 0 && trend.some((t) => t.avgScore !== null);
  if (!hasData) return NO_DATA;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CHART_COLORS.violet} stopOpacity={0.35} />
            <stop offset="95%" stopColor={CHART_COLORS.violet} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="date"
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
          formatter={(value) => [`${value ?? "—"}`, "Avg Score"]}
          labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
          cursor={{ stroke: CHART_COLORS.violetLight, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="avgScore"
          stroke={CHART_COLORS.violetLight}
          strokeWidth={2.5}
          fill="url(#scoreGradient)"
          dot={{ r: 3, fill: CHART_COLORS.violetLight, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: CHART_COLORS.violet, stroke: CHART_COLORS.violetLight, strokeWidth: 2 }}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
