"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  getScoreCellColor,
  getScoreCellBorder,
  getScoreCellFg,
  type ScoreHeatmapTheme,
} from "@/lib/scoreColors";

interface TopicRow {
  topic: string;
  count: number;
  Easy: number | null;
  Medium: number | null;
  Hard: number | null;
}

interface Props {
  topicHeatmap: TopicRow[];
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const DIFF_COLORS: Record<ScoreHeatmapTheme, Record<string, string>> = {
  light: {
    Easy: "text-emerald-700",
    Medium: "text-amber-800",
    Hard: "text-rose-800",
  },
  dark: {
    Easy: "text-emerald-400",
    Medium: "text-amber-400",
    Hard: "text-rose-400",
  },
};

const NO_DATA = (
  <div className="flex items-center justify-center py-12 lp-sub text-sm">
    No topic data available — topics appear after interviews with per-question tracking
  </div>
);

export function TopicHeatmap({ topicHeatmap }: Props) {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const heatTheme: ScoreHeatmapTheme = resolvedTheme === "dark" ? "dark" : "light";
  const diffTone = DIFF_COLORS[heatTheme];

  if (!topicHeatmap || topicHeatmap.length === 0) return NO_DATA;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th className="label-caps text-left pb-3 pr-6 lp-sub font-semibold w-1/3">Topic</th>
            {DIFFICULTIES.map((d) => (
              <th key={d} className={`label-caps text-center pb-3 px-3 ${diffTone[d]}`}>
                {d}
              </th>
            ))}
            <th className="label-caps text-right pb-3 pl-3 lp-sub">Turns</th>
          </tr>
        </thead>
        <tbody>
          {topicHeatmap.map((row, i) => (
            <motion.tr
              key={row.topic}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <td className="py-2 pr-6">
                <span className="text-sm lp-hi font-medium truncate block max-w-[180px]">
                  {row.topic}
                </span>
              </td>
              {DIFFICULTIES.map((diff) => {
                const score = row[diff];
                return (
                  <td key={diff} className="py-2 px-3 text-center">
                    <motion.span
                      className="inline-flex items-center justify-center w-14 h-9 rounded-lg text-sm font-bold cursor-default"
                      style={{
                        background: getScoreCellColor(score, heatTheme),
                        border: `1px solid ${getScoreCellBorder(score, heatTheme)}`,
                        color: getScoreCellFg(score, heatTheme),
                        boxShadow: score !== null ? "0 0 0 0 rgba(124,58,237,0)" : undefined,
                      }}
                      whileHover={
                        reduceMotion || score === null
                          ? undefined
                          : { scale: 1.06, boxShadow: "0 0 20px rgba(124,58,237,0.35)" }
                      }
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      {score !== null ? score : "—"}
                    </motion.span>
                  </td>
                );
              })}
              <td className="py-2 pl-3 text-right">
                <span className="text-xs lp-sub">{row.count}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
