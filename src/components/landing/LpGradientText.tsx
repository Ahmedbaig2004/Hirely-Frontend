"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";
import { getLpCtaGradientTextStyle, getLpGradientAccentStyle } from "./lpGradientAccent";

export type LpGradientTextVariant = "accent" | "cta";

type LpGradientTextProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Serif accent headline (e.g. features title); ignored when `variant="cta"` */
  italic?: boolean;
  /** `accent` — default LP gradient; `cta` — CTA section palette */
  variant?: LpGradientTextVariant;
};

export function LpGradientText({
  children,
  className,
  style,
  italic = false,
  variant = "accent",
}: LpGradientTextProps) {
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme !== "dark";
  const base =
    variant === "cta" ? getLpCtaGradientTextStyle(light) : getLpGradientAccentStyle(italic);
  return (
    <span className={className} style={{ ...base, ...style }}>
      {children}
    </span>
  );
}
