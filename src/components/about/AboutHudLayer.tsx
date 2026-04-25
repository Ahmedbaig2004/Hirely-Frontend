"use client";

const LABELS = ["AI", "DATA", "INNOVATION", "NETWORK", "INSIGHT", "GROWTH"];

/** Subtle floating labels — no blur, low opacity, CSS-only drift */
export function AboutHudLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]"
      aria-hidden
    >
      {LABELS.map((label, i) => (
        <span
          key={label}
          className="about-hud-float absolute font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300"
          style={{
            left: `${8 + (i * 17) % 75}%`,
            top: `${12 + (i * 23) % 70}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
