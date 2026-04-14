"use client";

import { motion } from "framer-motion";
import { getScoreCellColor, getScoreCellBorder } from "@/lib/scoreColors";

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

const DIFF_COLORS: Record<string, string> = {
  Easy:   "text-emerald-400",
  Medium: "text-amber-400",
  Hard:   "text-rose-400",
};

const NO_DATA = (
  <div className="flex items-center justify-center py-12 lp-muted text-sm">
    No topic data available — topics appear after interviews with per-question tracking
  </div>
);

export function TopicHeatmap({ topicHeatmap }: Props) {
  if (!topicHeatmap || topicHeatmap.length === 0) return NO_DATA;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th className="label-caps text-left pb-3 pr-6 lp-dim font-semibold w-1/3">Topic</th>
            {DIFFICULTIES.map((d) => (
              <th key={d} className={`label-caps text-center pb-3 px-3 ${DIFF_COLORS[d]}`}>
                {d}
              </th>
            ))}
            <th className="label-caps text-right pb-3 pl-3 lp-dim">Turns</th>
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
                    <span
                      className="inline-flex items-center justify-center w-14 h-9 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: getScoreCellColor(score),
                        border: `1px solid ${getScoreCellBorder(score)}`,
                        color: score !== null ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                      }}
                    >
                      {score !== null ? score : "—"}
                    </span>
                  </td>
                );
              })}
              <td className="py-2 pl-3 text-right">
                <span className="text-xs lp-dim">{row.count}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
