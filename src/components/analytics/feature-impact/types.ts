/**

 * Feature Impact / SHAP explainability payload (from GET /api/analytics → featureImpactAnalysis).

 */

export type FeatureImpactPayload = {

  interviewId?: string;

  questions: string[];

  scores: Record<string, number[]>;

  shap_values: Record<string, number[]>;

};



export type ImpactRow = {

  qShort: string;

  questionFull: string;

  index: number;

} & Record<string, number | string | undefined>;



export function shapKey(feature: string): string {

  return `shap__${feature}`;

}

