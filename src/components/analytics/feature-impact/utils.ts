import type { FeatureImpactPayload, ImpactRow } from "./types";

import { shapKey } from "./types";



export const FEATURE_DISPLAY_LABELS: Record<string, string> = {

  confidence: "Confidence",

  engagement: "Engagement",

  sentiment: "Vocal steadiness",

};



export function labelFeature(key: string): string {

  return FEATURE_DISPLAY_LABELS[key] ?? key.replace(/_/g, " ");

}



/** Validate lengths; derives feature keys from `scores`. */

export function deriveFeatures(payload: FeatureImpactPayload): string[] {

  return Object.keys(payload.scores || {});

}



export function validatePayload(payload: FeatureImpactPayload | null | undefined): payload is FeatureImpactPayload {

  if (!payload?.questions?.length) return false;

  const feats = deriveFeatures(payload);

  if (feats.length === 0) return false;

  const n = payload.questions.length;

  for (const f of feats) {

    if ((payload.scores[f]?.length ?? 0) !== n) return false;

    if ((payload.shap_values[f]?.length ?? 0) !== n) return false;

  }

  return true;

}



export function buildImpactRows(payload: FeatureImpactPayload): ImpactRow[] {

  const feats = deriveFeatures(payload);

  const { questions } = payload;

  return questions.map((full, i) => {

    const row: ImpactRow = {

      qShort: `Q${i + 1}`,

      questionFull: full,

      index: i,

    };

    for (const f of feats) {

      row[f] = payload.scores[f][i];

      row[shapKey(f)] = payload.shap_values[f][i];

    }

    return row;

  });

}



export type DropKind = "negative_shap_drop" | "neutral_shap_drop";



export type DropInsight = {

  featureKey: string;

  featureLabel: string;

  questionIdx: number;

  qShort: string;

  questionFull: string;

  scoreBefore: number;

  scoreAfter: number;

  shapAtPoint: number;

  kind: DropKind;

};



/**

 * Requirement #7/#8 — per feature compare score[i] vs score[i-1].

 */

export function analyzeScoreDrops(payload: FeatureImpactPayload): DropInsight[] {

  const rows = buildImpactRows(payload);

  const feats = deriveFeatures(payload);

  const out: DropInsight[] = [];



  for (const featureKey of feats) {

    for (let i = 1; i < rows.length; i++) {

      const cur = Number(rows[i][featureKey]);

      const prev = Number(rows[i - 1][featureKey]);

      if (!(cur < prev)) continue;



      const shapAtPoint = Number(rows[i][shapKey(featureKey)]);

      const negativeShap = shapAtPoint < 0;



      out.push({

        featureKey,

        featureLabel: labelFeature(featureKey),

        questionIdx: i,

        qShort: rows[i].qShort,

        questionFull: String(rows[i].questionFull),

        scoreBefore: prev,

        scoreAfter: cur,

        shapAtPoint,

        kind: negativeShap ? "negative_shap_drop" : "neutral_shap_drop",

      });

    }

  }

  return out;

}



export function humanDropSentence(d: DropInsight): string {

  if (d.kind === "negative_shap_drop") {

    return `${d.featureLabel} dropped at ${d.qShort} due to negative SHAP contribution (${d.shapAtPoint.toFixed(4)}).`;

  }

  return `${d.featureLabel} dropped at ${d.qShort} vs the previous question. SHAP on this answer: ${formatSigned(

    d.shapAtPoint,

  )} — not classified as negative attribution.`;

}



export function formatSigned(x: number): string {

  if (!Number.isFinite(x)) return "—";

  const s = x > 0 ? "+" : "";

  return `${s}${x.toFixed(4)}`;

}



/** Short label shown on chart badges / annotations */

export function shortDropInsight(d: DropInsight): string {

  if (d.kind === "negative_shap_drop") {

    return `↓ ${d.featureLabel}: negative SHAP at ${d.qShort}`;

  }

  return `↓ ${d.featureLabel} at ${d.qShort}`;

}

