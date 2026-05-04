"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import type { FeatureImpactPayload, ImpactRow } from "./types";
import { buildImpactRows } from "./utils";
import { shapKey } from "./types";
import { labelFeature, formatSigned } from "./utils";
import {
  GRID_FAINT,
  TICK_STYLE,
  CHART_ANIM_MS,
  pickChartColors,
} from "../chartTheme";
import { TOOLTIP_STYLE } from "../chartTheme";

const POS = "#16a34a";
const NEG = "#dc2626";

function ShapBarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value?: number; name?: string; payload?: Record<string, unknown>; color?: string }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <div style={{ ...TOOLTIP_STYLE, padding: "11px 12px", maxWidth: 300 }}>
      <p className="mb-2 text-xs font-semibold text-[var(--chart-tooltip-color)]">
        {String(row?.questionFull ?? "")}
      </p>
      {payload.map((p) => {
        const val = typeof p.value === "number" ? p.value : Number(p.value);
        const negative = Number.isFinite(val) && val < 0;

        return (
          <div key={String(p.name)} className="text-[11px] text-[var(--chart-tooltip-color)]">
            <span className="font-semibold">{p.name}: </span>
            <span className={negative ? "font-semibold text-rose-500" : "text-emerald-600"}>
              {Number.isFinite(val) ? formatSigned(val) : "—"}
            </span>
            {negative ? (
              <span className="block text-[10px] font-medium text-rose-400">
                Negative impact on this latent dimension for this clip
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export type Props = {
  payload: FeatureImpactPayload;
  visibleFeatures: string[];
};

export function ShapBarChart({ payload, visibleFeatures }: Props) {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const palette = pickChartColors(resolvedTheme === "light");
  const duration = reduceMotion ? 0 : CHART_ANIM_MS;

  const rows = useMemo(() => buildImpactRows(payload), [payload]);

  if (visibleFeatures.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm lp-sub">
        Select features to compare SHAP by question.
      </div>
    );
  }

  return (
    <motion.div
      className="h-[min(360px,50vh)] w-full min-h-[240px]"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 12, right: 10, left: 0, bottom: 12 }} barGap={3}>
          <CartesianGrid stroke={GRID_FAINT} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="qShort" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: palette.violet, opacity: 0.2 }} />
          <YAxis tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: palette.violet, opacity: 0.2 }} />
          <Tooltip cursor={{ fillOpacity: 0.08 }} content={<ShapBarTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} formatter={(value) => String(value)} />

          {visibleFeatures.map((fk) => {
            const nm = `${labelFeature(fk)}`;
            const dataKeyPath = shapKey(fk);
            return (
              <Bar
                key={fk}
                name={nm}
                dataKey={dataKeyPath}
                isAnimationActive={duration > 0}
                animationDuration={duration}
                radius={[4, 4, 0, 0]}
              >
                {rows.map((row: ImpactRow, ci) => {
                  const v = Number(row[dataKeyPath]);
                  const fill = v < 0 ? NEG : POS;
                  return <Cell key={ci} fill={fill} stroke="#172033" strokeWidth={0.3} />;
                })}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[var(--lp-border-sub)] pt-3 text-[11px] lp-sub">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-emerald-600" aria-hidden /> Positive φ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-rose-600" aria-hidden /> Negative φ (explains downward pressure)
        </span>
      </div>
    </motion.div>
  );
}
