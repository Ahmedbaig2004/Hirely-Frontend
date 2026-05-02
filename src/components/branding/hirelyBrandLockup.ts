/**
 * HIRELY brand lockup (reference: wordmark + three-bar E + H mark + gradient).
 * Gradient: `--hirely-brand-gradient` in `globals.css` (cyan → blue → purple).
 * Wordmark: `--hirely-wordmark-ink`; nav/footer may use `text-[color:var(--hirely-wordmark-ink)]`.
 */

/**
 * E bar model: thin bars vs gaps (design ratio), then scaled to 3B + 2G = 1em so the
 * stack fills the cap–baseline box and aligns with H I R L Y.
 */
const E_RAW_BAR = 0.04;
const E_RAW_GAP = 0.095;
const E_PACK = 3 * E_RAW_BAR + 2 * E_RAW_GAP;
const E_SCALE = 1 / E_PACK;

const barEm = E_RAW_BAR * E_SCALE;
const gapEm = E_RAW_GAP * E_SCALE;

export const eBarGeometry = {
  barEm,
  gapEm,
  offset0: 0,
  offset1: barEm + gapEm,
  offset2: 2 * (barEm + gapEm),
} as const;

/** E width: optical match to a bold “E” in Montserrat, relative to 1em cap height. */
export const eWidth = {
  nav: "0.56em" as const,
  hero: "0.64em" as const,
};

/** Clear space from H mark to first letter of HIRELY (em of the wordmark size). */
export const iconToWordmarkGapEm = "0.44em" as const;

/**
 * Nav H mark display height in em of the wordmark `font-size`.
 * Raster assets often include extra transparent padding; >1em matches cap height vs H I R L Y.
 */
export const navHMarkHeightEm = 1.28;

