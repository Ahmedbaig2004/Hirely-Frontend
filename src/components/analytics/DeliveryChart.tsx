"use client";

import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import { pickChartColors, CHART_ANIM_MS } from "./chartTheme";

interface DeliveryData {
  avgFillers: number | null;
  avgHedging: number | null;
  avgRestarts: number | null;
}

interface Props {
  delivery: DeliveryData;
}

const NO_DATA = (
  <div className="flex items-center justify-center h-[220px] lp-sub text-sm">
    No delivery data available - requires audio or transcribed answers
  </div>
);

export function DeliveryChart({ delivery }: Props) {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const C = pickChartColors(!isDark);
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  const hasData =
    delivery.avgFillers !== null ||
    delivery.avgHedging !== null ||
    delivery.avgRestarts !== null;

  if (!hasData) return NO_DATA;

  const patternData = [
    { name: "Fillers", value: delivery.avgFillers ?? 0, color: C.amber },
    { name: "Hedging", value: delivery.avgHedging ?? 0, color: C.rose },
    { name: "Restarts", value: delivery.avgRestarts ?? 0, color: C.cyan },
  ];

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
                isDark
                  ? "border-white/[0.08]"
                  : "border-[rgba(57,72,103,0.18)]"
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
    </motion.div>
  );
}
