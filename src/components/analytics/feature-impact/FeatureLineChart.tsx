"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import type { FeatureImpactPayload, ImpactRow } from "./types";
import { ImpactLineTooltip } from "./CustomTooltip";
import {
  buildImpactRows,
  labelFeature,
} from "./utils";
import { shapKey } from "./types";
import {
  GRID_FAINT,
  TICK_STYLE,
  CHART_ANIM_MS,
  pickChartColors,
} from "../chartTheme";

const STROKES = ["#8b5cf6", "#22d3ee", "#34d399", "#f59e0b", "#f87171", "#c084fc"];

type RechartsDot = {
  cx?: number;
  cy?: number;
  payload?: ImpactRow;
  index?: number;
};

function Dot({
  cx,
  cy,
  payload,
  index,
  featureKey,
  rows,
  showOnlyDropMarkers,
  strokeDefault,
}: RechartsDot & {
  featureKey: string;
  rows: ImpactRow[];
  showOnlyDropMarkers: boolean;
  strokeDefault: string;
}) {
  if (cx == null || cy == null || !payload || index == null) return null;

  const sk = shapKey(featureKey);
  const cur = Number(payload[featureKey]);
  const prev = index > 0 ? Number(rows[index - 1]?.[featureKey]) : null;
  const isDrop = prev != null && cur < prev;
  const negShap = Number(payload[sk]) < 0;

  if (showOnlyDropMarkers && !isDrop) return <g />;

  let r = !isDrop ? 4 : 6;
  let fill = strokeDefault;

  if (negShap && isDrop) {
    fill = "#7f1d1d";
    r = 10;
  } else if (negShap) {
    fill = "#dc2626";
    r = 8;
  } else if (isDrop) {
    fill = "#fb923c";
    r = 8;
  }

  return (
    <g className="recharts-cartesian-dot">
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="#0f172a" strokeOpacity={0.55} strokeWidth={1} />
      {isDrop && negShap && (
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#fca5a5"
          fontSize={9}
          fontWeight={600}
        >
          !
        </text>
      )}
    </g>
  );
}

export type Props = {
  payload: FeatureImpactPayload;
  /** Feature keys to render (normalized list) */
  visibleFeatures: string[];
  showOnlyDropMarkers?: boolean;
};

export function FeatureLineChart({
  payload,
  visibleFeatures,
  showOnlyDropMarkers = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === "light";
  const palette = pickChartColors(isLightTheme);
  const duration = reduceMotion ? 0 : CHART_ANIM_MS;

  const rows = useMemo(() => buildImpactRows(payload), [payload]);

  if (visibleFeatures.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm lp-sub">
        Select at least one feature to plot.
      </div>
    );
  }

  return (
    <motion.div
      className="h-[min(460px,60vh)] w-full min-h-[280px]"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 12, right: 14, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={GRID_FAINT} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="qShort" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: palette.violet, opacity: 0.2 }} />
          <YAxis
            domain={[0, 1]}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: palette.violet, opacity: 0.2 }}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            content={<ImpactLineTooltip allRows={rows} />}
            wrapperStyle={{ zIndex: 50 }}
          />
          <Legend
            formatter={(value) => labelFeature(String(value))}
            wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
          />
          {visibleFeatures.map((fk, idx) => {
            const stroke = STROKES[idx % STROKES.length];
            return (
              <Line
                key={fk}
                type="monotone"
                dataKey={fk}
                name={fk}
                stroke={stroke}
                strokeWidth={2.8}
                connectNulls
                dot={(d) =>
                  Dot({
                    ...(d as RechartsDot),
                    featureKey: fk,
                    rows,
                    showOnlyDropMarkers,
                    strokeDefault: stroke,
                  })
                }
                activeDot={{ r: 11 }}
                isAnimationActive={duration > 0}
                animationDuration={duration}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      <ul className="mt-3 flex flex-wrap gap-3 border-t border-[var(--lp-border-sub)] pt-3 text-[11px] lp-sub">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-400" aria-hidden /> Score drop marker
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" aria-hidden /> Drop + negative SHAP
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/90" aria-hidden /> Negative SHAP only
        </li>
      </ul>
    </motion.div>
  );
}
