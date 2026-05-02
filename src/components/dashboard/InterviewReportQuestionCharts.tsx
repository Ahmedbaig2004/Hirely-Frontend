"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { Mic, MessageSquare } from "lucide-react";
import {
  GRID_COLOR,
  TOOLTIP_STYLE,
  REF_LINE_1,
  CHART_CURSOR_STROKE,
  pickChartColors,
} from "@/components/analytics/chartTheme";

function chartAxisTickFill(isLight: boolean) {
  return isLight ? "rgba(51, 65, 85, 0.9)" : "rgba(248, 250, 252, 0.82)";
}

function truncateQuestion(text: string | undefined, max = 72): string {
  if (!text) return "";
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function scoreTierFill(score: number | null, C: ReturnType<typeof pickChartColors>): string {
  if (score == null) return "transparent";
  if (score >= 70) return C.emerald;
  if (score >= 50) return C.amber;
  return C.rose;
}

export type InterviewTurn = {
  question?: string;
  /** Answer score /100 — API may send number or numeric string */
  score?: number | string | null;
  voiceAnalysis?: {
    status?: string;
    confidenceLevel?: number;
  };
};

/** Normalize scores from DB / JSON (number, string, Prisma-like Decimal). */
export function parseNumericScore(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(Math.min(100, Math.max(0, value)));
  }
  if (typeof value === "string") {
    const n = parseFloat(value.trim());
    if (!Number.isFinite(n)) return undefined;
    return Math.round(Math.min(100, Math.max(0, n)));
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (value as { toNumber: unknown }).toNumber === "function"
  ) {
    try {
      const n = (value as { toNumber: () => number }).toNumber();
      if (!Number.isFinite(n)) return undefined;
      return Math.round(Math.min(100, Math.max(0, n)));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/** Unified row for Recharts — optional score omits bar segment / line point handling via connectNulls */
export type QuestionScoreRow = {
  name: string;
  fullLabel: string;
  questionPreview: string;
  score?: number;
};

function buildVocalScoreRows(turns: InterviewTurn[]): QuestionScoreRow[] {
  return turns.map((t, i) => {
    const row: QuestionScoreRow = {
      name: `Q${i + 1}`,
      fullLabel: `Question ${i + 1}`,
      questionPreview: truncateQuestion(t.question),
    };
    const completed =
      t.voiceAnalysis?.status === "completed" &&
      typeof t.voiceAnalysis?.confidenceLevel === "number";
    if (completed) {
      row.score = Math.round(
        Math.min(1, Math.max(0, t.voiceAnalysis!.confidenceLevel!)) * 100,
      );
    }
    return row;
  });
}

/** Per-question score shown on each transcript card (Score: X/100). */
function buildTranscriptScoreRows(turns: InterviewTurn[]): QuestionScoreRow[] {
  return turns.map((t, i) => {
    const row: QuestionScoreRow = {
      name: `Q${i + 1}`,
      fullLabel: `Question ${i + 1}`,
      questionPreview: truncateQuestion(t.question),
    };
    const parsed = parseNumericScore(t.score);
    if (parsed !== undefined) row.score = parsed;
    return row;
  });
}

type PairProps = {
  data: QuestionScoreRow[];
  tooltipScoreLabel: string;
  lineStroke: string;
  emptyMessage: string;
};

function QuestionScoreBarLinePair({
  data,
  tooltipScoreLabel,
  lineStroke,
  emptyMessage,
}: PairProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";
  const tickFill = chartAxisTickFill(isLight);
  const C = pickChartColors(isLight);
  const hasAny = data.some((r) => r.score !== undefined);

  const tooltipBody = (row: QuestionScoreRow) => (
    <div style={TOOLTIP_STYLE}>
      <div className="font-semibold">{row.fullLabel}</div>
      <div className="mt-0.5 max-w-[240px] text-[11px] opacity-90">
        {row.questionPreview || "—"}
      </div>
      <div className="mt-2 font-medium">
        {tooltipScoreLabel}:{" "}
        <span className="tabular-nums">
          {row.score !== undefined ? `${row.score}` : "—"}
        </span>
        {row.score !== undefined ? <span className="opacity-80"> / 100</span> : null}
      </div>
    </div>
  );

  if (!hasAny) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-outline-variant/70 bg-surface-container-low/40 text-sm text-slate-600 dark:text-slate-400"
        style={{ minHeight: 280 }}
      >
        {emptyMessage}
      </div>
    );
  }

  const chartHeight = 280;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            barCategoryGap="16%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: tickFill }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: tickFill }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: CHART_CURSOR_STROKE, opacity: 0.12 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return tooltipBody(payload[0].payload as QuestionScoreRow);
              }}
            />
            <ReferenceLine
              y={70}
              stroke={REF_LINE_1}
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: "Good (70)",
                position: "insideTopRight",
                fill: tickFill,
                fontSize: 10,
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {data.map((entry, i) => (
                <Cell
                  key={`bar-${entry.name}-${i}`}
                  fill={scoreTierFill(entry.score ?? null, C)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: tickFill }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: tickFill }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{
                stroke: CHART_CURSOR_STROKE,
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return tooltipBody(payload[0].payload as QuestionScoreRow);
              }}
            />
            <ReferenceLine
              y={70}
              stroke={REF_LINE_1}
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: "Good (70)",
                position: "insideTopRight",
                fill: tickFill,
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={lineStroke}
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: lineStroke,
                strokeWidth: 2,
                stroke: isLight ? "#fff" : "#0f172a",
              }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CARDSHELL =
  "glass-card mb-8 rounded-xl border-l-4 border-cyan-600/60 p-6 dark:border-primary";

/** Bar + line side-by-side — vocal perception per question */
export function InterviewReportVocalQuestionCharts({
  turns,
}: {
  turns: InterviewTurn[];
}) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";
  const C = pickChartColors(isLight);
  const vocalRows = useMemo(() => buildVocalScoreRows(turns), [turns]);

  return (
    <div className={CARDSHELL}>
      <div className="mb-4">
        <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
          <Mic size={20} aria-hidden />
          Question-by-Question Vocal Score
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-500">
          Bar and trend line for vocal perception across each question.
        </p>
      </div>
      <QuestionScoreBarLinePair
        data={vocalRows}
        tooltipScoreLabel="Vocal score"
        lineStroke={C.cyan}
        emptyMessage="No per-question vocal scores for this session yet."
      />
    </div>
  );
}

const TRANSCRIPT_CARDSHELL =
  "glass-card mb-10 rounded-xl border-l-4 border-cyan-600/60 p-6 dark:border-primary";

/** Bar + line after Transcript — same per-question scores as each transcript card. */
export function InterviewReportTranscriptQuestionCharts({
  turns,
}: {
  turns: InterviewTurn[];
}) {
  const [layoutReady, setLayoutReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setLayoutReady(true);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";
  const transcriptRows = useMemo(() => buildTranscriptScoreRows(turns), [turns]);

  const lineStroke = isLight ? "#1e3a5f" : "#38bdf8";

  return (
    <div
      className={`${TRANSCRIPT_CARDSHELL} relative z-[1]`}
      data-testid="interview-transcript-score-charts"
    >
      <div className="mb-4">
        <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-400">
          <MessageSquare size={20} aria-hidden />
          Question-by-Question Transcript Score
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-500">
          Bar and trend line for each question&apos;s score — matches the transcript cards above.
        </p>
      </div>
      {!layoutReady ? (
        <div
          className="rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/30"
          style={{ minHeight: 280 }}
          aria-hidden
        />
      ) : (
        <QuestionScoreBarLinePair
          data={transcriptRows}
          tooltipScoreLabel="Transcript score"
          lineStroke={lineStroke}
          emptyMessage="No per-question transcript scores for this session yet."
        />
      )}
    </div>
  );
}
