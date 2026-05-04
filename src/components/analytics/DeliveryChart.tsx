"use client";

import { useId } from "react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  AXIS_COLOR,
  GRID_FAINT,
  TOOLTIP_STYLE,
  pickChartColors,
  CHART_ANIM_MS,
} from "./chartTheme";

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
  <div className="flex items-center justify-center h-[220px] lp-sub text-sm">
    No delivery data available — requires audio or transcribed answers
  </div>
);

export function DeliveryChart({ delivery }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const C = pickChartColors(!isDark);
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

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
        { name: "Fillers", value: delivery.avgFillers ?? 0, color: C.amber },
        { name: "Hedging", value: delivery.avgHedging ?? 0, color: C.rose },
        { name: "Restarts", value: delivery.avgRestarts ?? 0, color: C.cyan },
      ]
    : [];

  const qualityData = hasQuality
    ? [
        { name: "Relevance", value: delivery.avgRelevance ?? 0, key: "rel" as const },
        { name: "Specificity", value: delivery.avgSpecificity ?? 0, key: "spec" as const },
      ]
    : [];

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {patternData.length > 0 && (
        <div>
          <p className="label-caps lp-sub mb-4">avg per answer</p>
          <div className="flex gap-4 flex-wrap">
            {patternData.map(({ name, value, color }, i) => (
              <motion.div
                key={name}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.35 }}
                className={`glass-card rounded-xl px-5 py-4 flex flex-col items-center gap-1 min-w-[96px] border ${
                  isDark ? "border-white/[0.08]" : "border-[rgba(57,72,103,0.18)]"
                }`}
                style={{
                  boxShadow: isDark
                    ? `0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px -12px ${color}44`
                    : `0 1px 0 rgba(255,255,255,0.9), 0 10px 32px -8px ${color}55, 0 0 0 1px rgba(57,72,103,0.08)`,
                }}
              >
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{
                    color,
                    textShadow: `0 0 20px ${color}55`,
                  }}
                >
                  {value.toFixed(1)}
                </span>
                <span className="text-xs lp-sub">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {qualityData.length > 0 && (
        <div>
          <p className="label-caps lp-sub mb-4">quality scores (0–100)</p>
          <ResponsiveContainer width="100%" height={168}>
            <BarChart
              data={qualityData}
              layout="vertical"
              margin={{ top: 0, right: 12, left: 4, bottom: 0 }}
              barCategoryGap="32%"
            >
              <defs>
                <linearGradient id={`qualRel-${uid}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.emerald} />
                  <stop offset="100%" stopColor={C.emeraldLight} />
                </linearGradient>
                <linearGradient id={`qualSpec-${uid}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.violet} />
                  <stop offset="100%" stopColor={C.cyan} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke={GRID_FAINT} horizontal={false} />
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
                width={88}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [`${v ?? "—"}`, "Score"]}
                labelStyle={{ color: "var(--chart-axis-muted)" }}
                cursor={{ fill: "rgba(14, 116, 144, 0.08)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                maxBarSize={30}
                isAnimationActive={animMs > 0}
                animationDuration={animMs}
                animationEasing="ease-out"
              >
                {qualityData.map((row) => (
                  <Cell
                    key={row.key}
                    fill={row.key === "rel" ? `url(#qualRel-${uid})` : `url(#qualSpec-${uid})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
