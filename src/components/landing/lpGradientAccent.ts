import type { CSSProperties } from "react";

const inlineBase: Pick<CSSProperties, "display"> = {
  display: "inline",
};

/**
 * Default landing accent — solid, readable color (theme from `html.dark` via CSS var).
 */
export function getLpGradientAccentStyle(italic = false): CSSProperties {
  return {
    ...inlineBase,
    ...(italic ? { fontStyle: "italic" as const } : {}),
    color: "var(--lp-enhance-chip-cyan-text)",
  };
}

/**
 * CTA block headline — distinct emphasis in light vs dark without gradient clipping.
 */
export function getLpCtaGradientTextStyle(light: boolean): CSSProperties {
  return {
    ...inlineBase,
    color: light ? "#1d4ed8" : "#fbbf24",
  };
}
