"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  AXIS_COLOR,
  GRID_FAINT,
  TOOLTIP_STYLE,
  pickChartColors,
  CHART_ANIM_MS,
} from "./chartTheme";

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
  <div className="flex items-center justify-center h-[280px] lp-sub text-sm">
    No type breakdown available
  </div>
);

export function TypeBreakdownChart({ byType }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const C = pickChartColors(resolvedTheme !== "dark");
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  if (!byType || byType.length === 0) return NO_DATA;

  const data = byType.map((d) => ({
    ...d,
    name: TYPE_LABELS[d.type] ?? d.type,
  }));

  return (
    <motion.div
      className="h-[280px] w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
          <defs>
            <linearGradient id={`barScore-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={C.violet} />
              <stop offset="100%" stopColor={C.violetLight} />
            </linearGradient>
            <linearGradient id={`barDel-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="100%" stopColor={resolvedTheme !== "dark" ? "#06b6d4" : "#22d3ee"} />
            </linearGradient>
            <linearGradient id={`barVoice-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={C.emerald} />
              <stop offset="100%" stopColor={C.emeraldLight} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 8" stroke={GRID_FAINT} vertical={false} />
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
            labelStyle={{ color: "var(--chart-axis-muted)", marginBottom: 4 }}
            cursor={{ fill: "rgba(91, 33, 182, 0.12)" }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-[11px] text-on-surface-variant/90">{value}</span>
            )}
          />
          <Bar
            dataKey="avgScore"
            name="Avg Score"
            fill={`url(#barScore-${uid})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="avgDelivery"
            name="Avg Delivery"
            fill={`url(#barDel-${uid})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="avgVoice"
            name="Avg Voice"
            fill={`url(#barVoice-${uid})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
