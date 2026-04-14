"use client";

import { useEffect, useRef } from "react";

export function PageCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX - 300}px`;
      glowRef.current.style.top = `${e.clientY - 300}px`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(59,130,246,0.13) 0%, rgba(34,211,238,0.06) 35%, rgba(139,92,246,0.03) 55%, transparent 70%)",
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 40,
        willChange: "left, top",
        transition: "left 0.12s ease-out, top 0.12s ease-out",
      }}
    />
  );
}

export function AmbientOrbs() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Top-left blue orb */}
      <div
        style={{
          position: "absolute",
          top: "2%",
          left: "-5%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "lp-pulse-slow 10s ease-in-out infinite",
        }}
      />
      {/* Mid-right cyan orb */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-8%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 65%)",
          filter: "blur(90px)",
          animation: "lp-pulse-slow 14s ease-in-out 3s infinite",
        }}
      />
      {/* Bottom-left accent orb */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "10%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "lp-pulse-slow 12s ease-in-out 6s infinite",
        }}
      />
      {/* Far bottom right */}
      <div
        style={{
          position: "absolute",
          top: "85%",
          right: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "lp-pulse-slow 16s ease-in-out 2s infinite",
        }}
      />
    </div>
  );
}

/**
 * Background layer for lp-page themed pages.
 * Renders the four animated ambient orbs. The cursor-follow glow is
 * intentionally excluded — it only appears on the landing page via explicit
 * use of <PageCursorGlow />.
 */
export default function LpBackground() {
  return <AmbientOrbs />;
}
