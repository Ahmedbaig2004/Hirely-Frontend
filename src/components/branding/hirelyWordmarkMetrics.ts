/**
 * Shared metrics for the HIRELY text lockup so nav, footer, and preloader match the brand
 * reference (letter spacing, weight, and E-bar rhythm use the same em-based scale).
 */
export const hirelyWordmarkMetrics = {
  /** Space between letters (matches brand card / lockup). */
  letterSpacing: "0.09em",
  fontWeight: 900 as const,
} as const;
