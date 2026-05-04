"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <HeroCanvasLoadingFallback />
    ),
  },
);

function HeroCanvasLoadingFallback() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";
  return (
    <div
      className="absolute inset-0 flex items-center justify-center text-xs font-medium uppercase tracking-[0.25em]"
      style={{
        background: isLight ? "#f2f9ff" : "#060a12",
        color: isLight ? "#0c4a6e" : "#64748b",
      }}
      aria-hidden
    >
      Loading scene
    </div>
  );
}

export function HeroVisual() {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== "dark";

  if (reduced === true) {
    return (
      <div
        role="img"
        aria-label="Decorative 3D backdrop — reduced motion"
        className="absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f2f9ff 42%, #dbeafe 100%)"
            : "radial-gradient(ellipse at 50% 40%, #0c1629 0%, #060a12 100%)",
        }}
      />
    );
  }

  if (reduced === null) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: isLight ? "#f2f9ff" : "#060a12" }}
        aria-hidden
      />
    );
  }

  return (
    <div
      role="img"
      aria-label="3D interview chamber that follows pointer movement"
      className="absolute inset-0"
    >
      <HeroCanvas />
    </div>
  );
}
