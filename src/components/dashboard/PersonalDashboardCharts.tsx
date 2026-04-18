"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
} from "recharts";
import {
  AXIS_COLOR,
  GRID_COLOR,
  TOOLTIP_STYLE,
} from "@/components/analytics/chartTheme";
import type { TrendPoint, CompetencyRadarPoint } from "@/lib/dashboardAnalytics";

const ANIM_MS = 1100;
const ANIM_MS_LONG = 1650;
const ANIM_EASE = "ease-out" as const;

const AXIS_MUTED = "rgba(255,255,255,0.32)";
const GRID_FAINT = "rgba(255,255,255,0.06)";

type LineProps = {
  data: TrendPoint[];
  compact?: boolean;
};

export function ScoreProgressLine({ data, compact }: LineProps) {
  const h = compact ? 220 : 300;
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container/40 text-sm lp-muted"
        style={{ height: h }}
      >
        Complete interviews to see your score progression
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    displayDate: d.date,
  }));

  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}>
        <defs>
          <linearGradient id="personalLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="displayDate"
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
          formatter={(value) => [`${value ?? "—"}%`, "Score"]}
          labelFormatter={(_, rows) => {
            const row = rows?.[0]?.payload as TrendPoint | undefined;
            return row ? `Session · ${row.date}` : "";
          }}
          cursor={{
            stroke: "rgba(167,139,250,0.6)",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#C4B5FD"
          strokeWidth={2.5}
          fill="url(#personalLineGrad)"
          dot={{ r: 4, fill: "#A78BFA", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
          animationDuration={ANIM_MS}
          animationEasing={ANIM_EASE}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Overview sparkline: clear scale + vocal summary stats + entrance motion. */
export function ScoreProgressSparkline({ data }: { data: TrendPoint[] }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `dashSparkGrad-${uid}`;
  const reduceMotion = useReducedMotion();

  const summary = useMemo(() => {
    if (data.length === 0) return null;
    const scores = data.map((d) => d.score);
    const latest = scores[scores.length - 1]!;
    const peak = Math.max(...scores);
    const low = Math.min(...scores);
    const delta =
      scores.length >= 2 ? latest - scores[scores.length - 2]! : 0;
    return {
      latest,
      peak,
      low,
      sessions: data.length,
      delta,
      trend: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    };
  }, [data]);

  const h = 210;
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container/30 text-xs text-on-surface-variant/60">
        Complete sessions to see progression
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, displayDate: d.date }));

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
    >
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <motion.div
            className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.35 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/55">
              Latest
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-primary">
              {summary.latest}%
            </p>
          </motion.div>
          <motion.div
            className="rounded-lg border border-outline-variant/40 bg-surface-container/40 px-3 py-2"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.14, duration: 0.35 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/55">
              Peak
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-on-surface">{summary.peak}%</p>
          </motion.div>
          <motion.div
            className="rounded-lg border border-outline-variant/40 bg-surface-container/40 px-3 py-2"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/55">
              Range
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-on-surface">
              {summary.low}% – {summary.peak}%
            </p>
          </motion.div>
          <motion.div
            className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.26, duration: 0.35 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/55">
              vs last
            </p>
            <p
              className={`mt-0.5 text-lg font-bold tabular-nums ${
                summary.delta > 0
                  ? "text-emerald-400"
                  : summary.delta < 0
                    ? "text-rose-400"
                    : "text-on-surface-variant"
              }`}
            >
              {summary.delta === 0 ? "—" : `${summary.delta > 0 ? "+" : ""}${summary.delta}`}
            </p>
          </motion.div>
        </div>
      )}

      <motion.div
        className="relative rounded-lg border border-outline-variant/30 bg-black/20"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <ResponsiveContainer width="100%" height={h}>
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 4, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.55} />
                <stop offset="45%" stopColor="#7C3AED" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#4C1D95" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 8"
              stroke={GRID_FAINT}
              vertical={false}
            />
            <ReferenceLine
              y={50}
              stroke="rgba(52,211,153,0.35)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <ReferenceLine
              y={75}
              stroke="rgba(167,139,250,0.2)"
              strokeDasharray="6 6"
              strokeWidth={1}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              orientation="right"
              width={36}
              ticks={[0, 50, 100]}
              tick={{ fontSize: 10, fill: AXIS_MUTED }}
              tickLine={false}
              axisLine={false}
            />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fill: AXIS_MUTED }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [`${value ?? "—"}%`, "Score"]}
              labelFormatter={(_, rows) => {
                const row = rows?.[0]?.payload as TrendPoint | undefined;
                return row ? `Session · ${row.date}` : "";
              }}
              cursor={{
                stroke: "rgba(167,139,250,0.55)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#E9D5FF"
              strokeWidth={3}
              fill={`url(#${gradId})`}
              dot={{
                r: 3,
                fill: "#A78BFA",
                stroke: "#fff",
                strokeWidth: 1,
              }}
              activeDot={{ r: 6, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={reduceMotion ? 0 : ANIM_MS_LONG}
              animationEasing={ANIM_EASE}
              isAnimationActive={!reduceMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {summary && (
        <p className="text-center text-[11px] text-on-surface-variant/50 sm:text-left">
          <span className="text-on-surface-variant/70">{summary.sessions} sessions</span>
          {" · "}
          Scale 0–100%. Green line = 50% reference.
        </p>
      )}
    </motion.div>
  );
}

const RADAR_LABEL = { fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 500 };

export function CompetencyRadarChart({ data }: { data: CompetencyRadarPoint[] }) {
  const reduceMotion = useReducedMotion();
  const h = 280;
  const chartRows = data.map((d) => ({
    subject: d.name,
    value: d.value,
    fullMark: 100,
  }));

  const hasData = data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container/30 text-xs text-on-surface-variant/60">
        Competency shape after more sessions
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
    >
      <motion.div
        className="relative rounded-lg border border-outline-variant/30 bg-black/15"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <ResponsiveContainer width="100%" height={h}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartRows}>
            <PolarGrid
              gridType="polygon"
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="4 6"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={RADAR_LABEL}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={5}
              tick={{ fontSize: 9, fill: "rgba(255,255,255,0.28)" }}
              tickLine={false}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#DDD6FE"
              strokeWidth={2.5}
              fill="#7C3AED"
              fillOpacity={0.48}
              animationDuration={reduceMotion ? 0 : ANIM_MS_LONG}
              animationEasing={ANIM_EASE}
              isAnimationActive={!reduceMotion}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => {
                const n = typeof value === "number" ? value : Number(value ?? 0);
                return [`${Number.isFinite(n) ? n : 0} / 100`, "Score"];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.06, delayChildren: 0.2 },
          },
        }}
      >
        {data.map((d) => (
          <motion.div
            key={d.name}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            className="flex flex-col rounded-lg border border-outline-variant/40 bg-surface-container/35 px-2.5 py-2"
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-on-surface-variant/55">
              {d.name}
            </span>
            <span className="mt-0.5 text-lg font-bold tabular-nums text-primary">
              {d.value}
              <span className="text-xs font-normal text-on-surface-variant/45">/100</span>
            </span>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-[11px] text-on-surface-variant/45 sm:text-left">
        Rings: 0 → 100. Hover the chart for detail.
      </p>
    </motion.div>
  );
}

type BarProps = {
  data: { name: string; avg: number; count: number; type: string; fill: string }[];
  compact?: boolean;
  onBarClick?: (type: string) => void;
};

export function AvgScoreByTypeBar({ data, compact, onBarClick }: BarProps) {
  const h = compact ? 220 : 280;
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container/40 text-sm lp-muted"
        style={{ height: h }}
      >
        No type breakdown yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke={AXIS_COLOR}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          stroke={AXIS_COLOR}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value, _name, item) => {
            const v = typeof value === "number" ? value : Number(value ?? 0);
            const count = (item?.payload as { count?: number })?.count;
            return [`${Number.isFinite(v) ? v : 0}% avg · ${count ?? "—"} sessions`, "Performance"];
          }}
          cursor={{ fill: "rgba(124,58,237,0.08)" }}
        />
        <Bar
          dataKey="avg"
          radius={[0, 8, 8, 0]}
          animationDuration={ANIM_MS}
          animationEasing={ANIM_EASE}
          isAnimationActive
          onClick={(rect) => {
            const t = (rect?.payload as { type?: string } | undefined)?.type;
            if (t && onBarClick) onBarClick(t);
          }}
        >
          {data.map((entry) => (
            <Cell key={entry.type} fill={entry.fill} stroke="rgba(255,255,255,0.06)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

type PieProps = {
  data: { name: string; value: number; type: string; fill: string }[];
  compact?: boolean;
  onSliceClick?: (type: string) => void;
};

export function InterviewMixPie({ data, compact, onSliceClick }: PieProps) {
  const h = compact ? 220 : 280;
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container/40 text-sm lp-muted"
        style={{ height: h }}
      >
        No distribution data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={h}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={compact ? 52 : 64}
          outerRadius={compact ? 78 : 96}
          paddingAngle={4}
          dataKey="value"
          nameKey="name"
          animationDuration={ANIM_MS}
          animationEasing={ANIM_EASE}
          isAnimationActive
          onClick={(sector) => {
            const p = sector?.payload as { type?: string } | undefined;
            const t = p?.type ?? (sector as { type?: string }).type;
            if (t && onSliceClick) onSliceClick(t);
          }}
        >
          {data.map((entry) => (
            <Cell
              key={entry.type}
              fill={entry.fill}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth={1}
              className="outline-none transition-opacity hover:opacity-90 focus-visible:opacity-90"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value, name) => {
            const n = typeof value === "number" ? value : Number(value ?? 0);
            return [`${Number.isFinite(n) ? n : 0} sessions`, String(name ?? "")];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => (
            <span className="text-on-surface-variant opacity-80">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
