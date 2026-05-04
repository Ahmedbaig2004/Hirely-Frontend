"use client";

import { useId } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  TOOLTIP_STYLE,
  DECISION_COLORS,
  CHART_ANIM_MS,
  DECISION_RING_STROKE,
} from "./chartTheme";

interface DecisionRow {
  decision: string;
  count: number;
}

interface Props {
  decisionBreakdown: DecisionRow[];
  totalInterviews: number;
}

const NO_DATA = (
  <div className="flex items-center justify-center h-[280px] lp-sub text-sm">
    No completed interviews yet
  </div>
);

export function DecisionBreakdown({ decisionBreakdown, totalInterviews }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  if (!decisionBreakdown || decisionBreakdown.length === 0) return NO_DATA;

  return (
    <motion.div
      className="relative"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <defs>
            <linearGradient id={`donut-${uid}-default`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
              <stop offset="100%" stopColor="#5B21B6" stopOpacity={0.75} />
            </linearGradient>
            {Object.entries(DECISION_COLORS).map(([key, base]) => (
              <linearGradient key={key} id={`donut-${uid}-${key.replace(/\s/g, "")}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={base} stopOpacity={1} />
                <stop offset="100%" stopColor={base} stopOpacity={0.72} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={decisionBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={112}
            dataKey="count"
            nameKey="decision"
            paddingAngle={4}
            stroke={DECISION_RING_STROKE}
            strokeWidth={2}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
          >
            {decisionBreakdown.map((entry) => {
              const gid = entry.decision.replace(/\s/g, "");
              const hasGrad = Boolean(DECISION_COLORS[entry.decision]);
              return (
                <Cell
                  key={entry.decision}
                  fill={hasGrad ? `url(#donut-${uid}-${gid})` : `url(#donut-${uid}-default)`}
                />
              );
            })}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [`${value} interview${value !== 1 ? "s" : ""}`, String(name)]}
            labelStyle={{ color: "var(--chart-axis-muted)" }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-[11px] text-on-surface-variant/85">{value}</span>
            )}
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "0%", paddingBottom: "32px" }}
      >
        <span
          className="text-3xl font-black lp-hi tabular-nums"
          style={{ textShadow: "0 0 24px rgba(124,58,237,0.35)" }}
        >
          {totalInterviews}
        </span>
        <span className="text-xs lp-sub mt-0.5 tracking-wide">total</span>
      </div>
    </motion.div>
  );
}
