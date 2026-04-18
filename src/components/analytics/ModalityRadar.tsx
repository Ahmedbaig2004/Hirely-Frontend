"use client";

import { useId, useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  CHART_COLORS,
  TICK_STYLE,
  TOOLTIP_STYLE,
  CHART_ANIM_MS,
} from "./chartTheme";

type ModalityPayload = {
  technical: number | null;
  delivery: number | null;
  voice: number | null;
  contentQuality: number | null;
  combined: number | null;
};

type Props = {
  modality: ModalityPayload;
};

export function ModalityRadar({ modality }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  const chartData = useMemo(
    () => [
      { subject: "Technical", score: Math.round(modality.technical ?? 0) },
      { subject: "Content", score: Math.round(modality.contentQuality ?? 0) },
      { subject: "Delivery", score: Math.round(modality.delivery ?? 0) },
      { subject: "Voice", score: Math.round(modality.voice ?? 0) },
      { subject: "Combined", score: Math.round(modality.combined ?? 0) },
    ],
    [modality],
  );

  return (
    <motion.div
      className="h-[260px] w-full"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="52%"
          outerRadius="72%"
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <defs>
            <linearGradient id={`radarFill-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.violetLight} stopOpacity={0.55} />
              <stop offset="100%" stopColor={CHART_COLORS.violet} stopOpacity={0.18} />
            </linearGradient>
            <linearGradient id={`radarStroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#DDD6FE" />
              <stop offset="100%" stopColor={CHART_COLORS.violetLight} />
            </linearGradient>
          </defs>
          <PolarGrid
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="3 6"
            gridType="polygon"
          />
          <PolarAngleAxis dataKey="subject" tick={TICK_STYLE} tickLine={false} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${value ?? "—"}`, "Score"]}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke={`url(#radarStroke-${uid})`}
            strokeWidth={2.5}
            fill={`url(#radarFill-${uid})`}
            fillOpacity={1}
            dot={{
              r: 4,
              fill: "#fff",
              stroke: CHART_COLORS.violet,
              strokeWidth: 2,
            }}
            isAnimationActive={animMs > 0}
            animationDuration={animMs}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
