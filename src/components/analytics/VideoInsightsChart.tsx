"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pickChartColors } from "./chartTheme";

type LabelBreakdown = { label: string; count: number };
type Signal = { name: string; impact: number };

interface VideoData {
  avgConfidence: number | null;
  avgRawScore: number | null;
  analyzedTurns: number;
  labelBreakdown: LabelBreakdown[];
  topSignals: Signal[];
}

interface Props {
  video: VideoData;
}

export function VideoInsightsChart({ video }: Props) {
  const reduceMotion = useReducedMotion();
  const C = pickChartColors(true);

  const hasVideoData =
    video.analyzedTurns > 0 ||
    video.labelBreakdown.length > 0 ||
    video.topSignals.length > 0;

  if (!hasVideoData) {
    return (
      <div className="flex items-center justify-center h-[220px] lp-sub text-sm">
        No video analysis data available yet
      </div>
    );
  }

  const normalized = { high: 0, medium: 0, low: 0 };
  for (const row of video.labelBreakdown) {
    const key = row.label.toLowerCase();
    if (key.includes("high")) normalized.high += row.count;
    else if (key.includes("medium")) normalized.medium += row.count;
    else normalized.low += row.count;
  }
  const total = Math.max(1, normalized.high + normalized.medium + normalized.low);
  const highPct = Math.round((normalized.high * 100) / total);
  const mediumPct = Math.round((normalized.medium * 100) / total);
  const lowPct = Math.max(0, 100 - highPct - mediumPct);
  const confidence = video.avgConfidence ?? 0;

  const confidenceLabel =
    confidence >= 75
      ? "Strong camera presence"
      : confidence >= 50
        ? "Moderate camera presence"
        : "Needs improvement";
  const confidenceColor =
    confidence >= 75 ? C.emerald : confidence >= 50 ? C.amber : C.rose;

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <div className="glass-card rounded-xl border lp-border-sub px-4 py-3">
          <p className="text-[11px] lp-sub">Avg Video Confidence</p>
          <p className="text-2xl font-black lp-hi tabular-nums">
            {video.avgConfidence ?? "-"}{video.avgConfidence != null ? "%" : ""}
          </p>
        </div>
        <div className="glass-card rounded-xl border lp-border-sub px-4 py-3">
          <p className="text-[11px] lp-sub">Video Turns</p>
          <p className="text-2xl font-black lp-hi tabular-nums">{video.analyzedTurns}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl border lp-border-sub p-4">
        <p className="label-caps lp-sub mb-2">Overall Video Presence</p>
        <p className="text-sm font-semibold mb-3" style={{ color: confidenceColor }}>
          {confidenceLabel}
        </p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            className="h-full rounded-full"
            style={{ background: confidenceColor }}
            initial={reduceMotion ? false : { width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="mt-2 text-xs lp-sub">
          This score summarizes eye contact, posture stability, and on-camera confidence.
        </p>
      </div>

      <div>
        <p className="label-caps lp-sub mb-3">Turn-by-Turn Result Mix</p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/70">
          <div className="flex h-full w-full">
            <div style={{ width: `${highPct}%`, background: C.emerald }} />
            <div style={{ width: `${mediumPct}%`, background: C.amber }} />
            <div style={{ width: `${lowPct}%`, background: C.rose }} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border lp-border-sub p-2">
            <p className="lp-sub">Strong</p>
            <p className="font-bold" style={{ color: C.emerald }}>{normalized.high} ({highPct}%)</p>
          </div>
          <div className="rounded-lg border lp-border-sub p-2">
            <p className="lp-sub">Medium</p>
            <p className="font-bold" style={{ color: C.amber }}>{normalized.medium} ({mediumPct}%)</p>
          </div>
          <div className="rounded-lg border lp-border-sub p-2">
            <p className="lp-sub">Needs work</p>
            <p className="font-bold" style={{ color: C.rose }}>{normalized.low} ({lowPct}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
