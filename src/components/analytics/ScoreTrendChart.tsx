"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  CHART_COLORS,
  GRID_FAINT,
  TICK_STYLE,
  TOOLTIP_STYLE,
  CHART_ANIM_MS,
} from "./chartTheme";

type TrendPoint = { date: string; avgScore: number | null; count: number };

type Props = {
  trend: TrendPoint[];
};

export function ScoreTrendChart({ trend }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  const chartData = useMemo(() => {
    const rows = trend
      .filter((d) => d.avgScore !== null)
      .map((d) => ({ date: d.date, score: Math.round(d.avgScore as number) }));
    return rows;
  }, [trend]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center lp-muted text-sm">
        No trend data for this range
      </div>
    );
  }

  return (
    <motion.div
      className="h-[260px] w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`scoreTrendFill-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.violetLight} stopOpacity={0.55} />
              <stop offset="45%" stopColor={CHART_COLORS.violet} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_COLORS.violet} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`scoreTrendStroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor={CHART_COLORS.violetLight} />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id={`scoreTrendGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={GRID_FAINT}
            vertical={false}
          />
          <ReferenceLine
            y={50}
            stroke="rgba(34,211,238,0.25)"
            strokeDasharray="4 6"
            strokeWidth={1}
          />
          <ReferenceLine
            y={75}
            stroke="rgba(124,58,237,0.2)"
            strokeDasharray="4 6"
            strokeWidth={1}
          />
          <XAxis
            dataKey="date"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
            tickMargin={8}
          />
          <YAxis
            domain={[0, 100]}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={36}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            cursor={{ stroke: "rgba(124,58,237,0.35)", strokeWidth: 1 }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${value ?? "—"}`, "Score"]}
            labelFormatter={(l) => l}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={`url(#scoreTrendStroke-${uid})`}
            strokeWidth={2.5}
            fill={`url(#scoreTrendFill-${uid})`}
            fillOpacity={1}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
            dot={{
              r: 5,
              strokeWidth: 2,
              stroke: "rgba(255,255,255,0.9)",
              fill: CHART_COLORS.violetLight,
              filter: `url(#scoreTrendGlow-${uid})`,
            }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff", fill: CHART_COLORS.violet }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
