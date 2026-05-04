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
import { useTheme } from "next-themes";
import {
  pickChartColors,
  TICK_STYLE,
  TOOLTIP_STYLE,
  CHART_ANIM_MS,
  RADAR_GRID_STROKE,
  RADAR_DOT_FILL,
} from "./chartTheme";

type ModalityPayload = {
  technical: number | null;
  delivery: number | null;
  voice: number | null;
  video: number | null;
  contentQuality: number | null;
  combined: number | null;
};

type Props = {
  modality: ModalityPayload;
};

export function ModalityRadar({ modality }: Props) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";
  const C = pickChartColors(isLight);
  const animMs = reduceMotion ? 0 : CHART_ANIM_MS;

  const chartData = useMemo(
    () => [
      { subject: "Technical", score: Math.round(modality.technical ?? 0) },
      { subject: "Content", score: Math.round(modality.contentQuality ?? 0) },
      { subject: "Delivery", score: Math.round(modality.delivery ?? 0) },
      { subject: "Voice", score: Math.round(modality.voice ?? 0) },
      { subject: "Video", score: Math.round(modality.video ?? 0) },
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
              <stop offset="0%" stopColor={C.violetLight} stopOpacity={isLight ? 0.78 : 0.55} />
              <stop offset="100%" stopColor={C.violet} stopOpacity={isLight ? 0.42 : 0.18} />
            </linearGradient>
            <linearGradient id={`radarStroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isLight ? C.violet : "#DDD6FE"} />
              <stop offset="100%" stopColor={isLight ? C.violet : C.violetLight} />
            </linearGradient>
          </defs>
          <PolarGrid
            stroke={RADAR_GRID_STROKE}
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
              fill: RADAR_DOT_FILL,
              stroke: C.violet,
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
