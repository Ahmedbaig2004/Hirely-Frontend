"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TOOLTIP_STYLE, DECISION_COLORS } from "./chartTheme";

interface DecisionRow {
  decision: string;
  count: number;
}

interface Props {
  decisionBreakdown: DecisionRow[];
  totalInterviews: number;
}

const NO_DATA = (
  <div className="flex items-center justify-center h-[280px] lp-muted text-sm">
    No completed interviews yet
  </div>
);

export function DecisionBreakdown({ decisionBreakdown, totalInterviews }: Props) {
  if (!decisionBreakdown || decisionBreakdown.length === 0) return NO_DATA;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={decisionBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="count"
            nameKey="decision"
            paddingAngle={3}
            strokeWidth={0}
          >
            {decisionBreakdown.map((entry) => (
              <Cell
                key={entry.decision}
                fill={DECISION_COLORS[entry.decision] ?? "#7C3AED"}
                opacity={0.88}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [`${value} interview${value !== 1 ? "s" : ""}`, String(name)]}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{value}</span>
            )}
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "0%", paddingBottom: "32px" }}
      >
        <span className="text-3xl font-black lp-hi">{totalInterviews}</span>
        <span className="text-xs lp-muted mt-0.5">total</span>
      </div>
    </div>
  );
}
