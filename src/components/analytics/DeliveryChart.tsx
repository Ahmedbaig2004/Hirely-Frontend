"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { AXIS_COLOR, GRID_COLOR, TOOLTIP_STYLE, CHART_COLORS } from "./chartTheme";

interface DeliveryData {
  avgFillers: number | null;
  avgHedging: number | null;
  avgRestarts: number | null;
  avgRelevance: number | null;
  avgSpecificity: number | null;
}

interface Props {
  delivery: DeliveryData;
}

const NO_DATA = (
  <div className="flex items-center justify-center h-[220px] lp-muted text-sm">
    No delivery data available — requires audio or transcribed answers
  </div>
);

export function DeliveryChart({ delivery }: Props) {
  const hasData =
    delivery.avgFillers !== null ||
    delivery.avgHedging !== null ||
    delivery.avgRestarts !== null;

  const hasQuality =
    delivery.avgRelevance !== null ||
    delivery.avgSpecificity !== null;

  if (!hasData && !hasQuality) return NO_DATA;

  const patternData = hasData
    ? [
        { name: "Fillers",   value: delivery.avgFillers   ?? 0, color: CHART_COLORS.amber },
        { name: "Hedging",   value: delivery.avgHedging   ?? 0, color: CHART_COLORS.rose },
        { name: "Restarts",  value: delivery.avgRestarts  ?? 0, color: CHART_COLORS.cyan },
      ]
    : [];

  const qualityData = hasQuality
    ? [
        { name: "Relevance",    value: delivery.avgRelevance    ?? 0, color: CHART_COLORS.emerald },
        { name: "Specificity",  value: delivery.avgSpecificity  ?? 0, color: CHART_COLORS.violet },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Filler / Hedging / Restart counts */}
      {patternData.length > 0 && (
        <div>
          <p className="label-caps lp-dim mb-4">avg per answer</p>
          <div className="flex gap-6 flex-wrap">
            {patternData.map(({ name, value, color }) => (
              <div key={name} className="glass-card rounded-xl px-5 py-4 flex flex-col items-center gap-1 min-w-[96px]">
                <span className="text-2xl font-black" style={{ color }}>
                  {value.toFixed(1)}
                </span>
                <span className="text-xs lp-muted">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relevance + Specificity bar */}
      {qualityData.length > 0 && (
        <div>
          <p className="label-caps lp-dim mb-4">quality scores (0–100)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={qualityData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke={AXIS_COLOR}
                tick={{ fontSize: 11, fill: AXIS_COLOR }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={AXIS_COLOR}
                tick={{ fontSize: 11, fill: AXIS_COLOR }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [`${v ?? "—"}`, "Score"]}
                labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                cursor={{ fill: "rgba(124,58,237,0.08)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
                fill={CHART_COLORS.cyan}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
