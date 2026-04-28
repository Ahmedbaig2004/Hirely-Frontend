"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = { className?: string };

/** Soft grid, blobs, and curved dashes for start-flow screens after the main form. */
export function StartFlowBackdrop({ className }: Props) {
  const gradId = useId().replace(/:/g, "");
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -20%, color-mix(in srgb, var(--lp-foreground) 4%, transparent), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute -left-[10%] top-[8%] h-[min(420px,55vw)] w-[min(420px,55vw)] rounded-full opacity-[0.32] blur-[100px] motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.45), transparent 60%)",
        }}
      />
      <div
        className="absolute right-[-5%] top-[18%] h-[min(480px,60vw)] w-[min(480px,60vw)] rounded-full opacity-[0.28] blur-[110px] motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(139, 92, 246, 0.4), transparent 58%)",
          animationDelay: "0.5s",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-1/2 h-[min(280px,40vh)] w-[min(90vw,800px)] -translate-x-1/2 rounded-full opacity-[0.22] blur-[90px] motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.45), transparent 65%)",
          animationDelay: "1s",
        }}
      />
      <div
        className="absolute bottom-[12%] left-[-4%] h-[200px] w-[200px] rounded-full opacity-[0.2] blur-[80px] motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.35), transparent 60%)",
        }}
      />
      <svg
        className="absolute left-1/2 top-[20%] w-[min(720px,92vw)] -translate-x-1/2 opacity-[0.28] dark:opacity-[0.18]"
        viewBox="0 0 720 120"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="0"
            y1="0"
            x2="720"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="0.5" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="1" stopColor="rgba(139, 92, 246, 0.45)" />
          </linearGradient>
        </defs>
        <path
          d="M0 96 C 120 24, 200 104, 360 56 S 560 8, 720 88"
          stroke={`url(#${gradId})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="6 10"
        />
      </svg>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[min(520px,80vw)] w-[min(520px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px] motion-reduce:opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
