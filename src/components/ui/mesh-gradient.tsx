"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MeshGradient() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Primary orb — top-left */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, var(--md-sys-color-primary) 0%, transparent 70%)",
          opacity: isDark ? 0.28 : 0.1,
          animation: "meshFloat1 18s ease-in-out infinite",
        }}
      />
      {/* Secondary orb — bottom-right */}
      <div
        className="absolute rounded-full blur-[140px]"
        style={{
          width: 500,
          height: 500,
          bottom: "-5%",
          right: "-5%",
          background: "radial-gradient(circle, var(--md-sys-color-secondary) 0%, transparent 70%)",
          opacity: isDark ? 0.18 : 0.08,
          animation: "meshFloat2 22s ease-in-out infinite",
        }}
      />
      {/* Tertiary orb — center */}
      <div
        className="absolute rounded-full blur-[160px]"
        style={{
          width: 700,
          height: 700,
          bottom: "10%",
          left: "30%",
          background: "radial-gradient(circle, var(--md-sys-color-tertiary) 0%, transparent 70%)",
          opacity: isDark ? 0.18 : 0.07,
          animation: "meshFloat3 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
