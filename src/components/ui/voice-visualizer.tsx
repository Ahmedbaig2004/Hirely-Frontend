"use client";

import { motion } from "framer-motion";

// Bell-curve shape: outer bars shorter, center bar tallest
const MULTIPLIERS = [0.4, 0.6, 0.85, 1.0, 0.85, 0.6, 0.4];
const MAX_H = 44;
const MIN_H = 4;

interface VoiceVisualizerProps {
  volume: number;       // raw 0-255 from useVoiceActivity
  isRecording: boolean;
  isAIThinking: boolean;
}

export function VoiceVisualizer({ volume, isRecording, isAIThinking }: VoiceVisualizerProps) {
  // Map raw analyzer value (avg of 256 frequency bins) to 0-1
  const norm = Math.min(volume / 80, 1);

  /* MD light primary/tertiary are too pale on lp-background; use saturated hues */
  const color = isAIThinking
    ? "rgb(8, 145, 178)"
    : isRecording
    ? "rgb(13, 148, 136)"
    : "rgb(100, 116, 139)";

  return (
    <div
      className="flex items-center justify-center gap-[5px]"
      aria-hidden="true"
      style={{ height: MAX_H + 8 }}
    >
      {MULTIPLIERS.map((m, i) => {
        const h = isAIThinking
          ? MIN_H + m * 8
          : !isRecording
          ? MIN_H
          : Math.max(MIN_H, norm * MAX_H * m);

        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 4, backgroundColor: color }}
            animate={{
              height: h,
              opacity: isAIThinking
                ? 0.55 + m * 0.35
                : isRecording
                  ? 0.7 + m * 0.3
                  : 0.4,
            }}
            transition={{
              delay: isRecording ? i * 0.015 : 0,
              duration: isRecording ? 0.08 : 0.4,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
