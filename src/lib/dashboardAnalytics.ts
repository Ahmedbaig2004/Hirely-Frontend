/**
 * Pure analytics derived from interview list — no extra API calls.
 */

export type InterviewLike = {
  id: string;
  jobDescription: string | null;
  interviewType?: string;
  finalScore: number;
  createdAt: string;
};

export type DashboardKpis = {
  total: number;
  avgScore: number | null;
  bestScore: number | null;
  last7Days: number;
  improvementDelta: number | null;
  /** Share of sessions at or above 70% score */
  successRate: number | null;
};

export type TrendPoint = {
  date: string;
  sortKey: number;
  score: number;
  id: string;
};

export type TypeSlice = {
  type: string;
  label: string;
  count: number;
  avgScore: number | null;
  fill: string;
};

const TYPE_LABEL: Record<string, string> = {
  JOB_SPECIFIC: "Job-specific",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
};

const TYPE_COLOR: Record<string, string> = {
  JOB_SPECIFIC: "#7C3AED",
  TECHNICAL: "#22D3EE",
  BEHAVIORAL: "#10B981",
};

export function normalizeType(t?: string): string {
  return t ?? "JOB_SPECIFIC";
}

export function labelForType(t: string): string {
  return TYPE_LABEL[t] ?? t;
}

export function colorForType(t: string): string {
  return TYPE_COLOR[t] ?? "#A78BFA";
}

export function buildKpis(interviews: InterviewLike[]): DashboardKpis {
  if (interviews.length === 0) {
    return {
      total: 0,
      avgScore: null,
      bestScore: null,
      last7Days: 0,
      improvementDelta: null,
      successRate: null,
    };
  }

  const scores = interviews.map((i) => i.finalScore);
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = sum / scores.length;
  const best = Math.max(...scores);

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const last7Days = interviews.filter(
    (i) => new Date(i.createdAt).getTime() >= weekAgo,
  ).length;

  const sorted = [...interviews].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const half = Math.floor(sorted.length / 2);
  let improvementDelta: number | null = null;
  if (sorted.length >= 4) {
    const firstHalf = sorted.slice(0, half);
    const secondHalf = sorted.slice(half);
    const a1 =
      firstHalf.reduce((s, x) => s + x.finalScore, 0) / firstHalf.length;
    const a2 =
      secondHalf.reduce((s, x) => s + x.finalScore, 0) / secondHalf.length;
    improvementDelta = Math.round((a2 - a1) * 10) / 10;
  }

  const passThreshold = 70;
  const passed = interviews.filter((i) => i.finalScore >= passThreshold).length;
  const successRate = Math.round((passed / interviews.length) * 100);

  return {
    total: interviews.length,
    avgScore: Math.round(avg * 10) / 10,
    bestScore: best,
    last7Days,
    improvementDelta,
    successRate,
  };
}

export function buildScoreTrend(interviews: InterviewLike[]): TrendPoint[] {
  return [...interviews]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((i) => {
      const d = new Date(i.createdAt);
      return {
        date: d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        sortKey: d.getTime(),
        score: i.finalScore,
        id: i.id,
      };
    });
}

export function buildTypeSlices(interviews: InterviewLike[]): TypeSlice[] {
  const map = new Map<
    string,
    { count: number; sum: number }
  >();

  for (const i of interviews) {
    const t = normalizeType(i.interviewType);
    const cur = map.get(t) ?? { count: 0, sum: 0 };
    cur.count += 1;
    cur.sum += i.finalScore;
    map.set(t, cur);
  }

  return Array.from(map.entries()).map(([type, v]) => ({
    type,
    label: labelForType(type),
    count: v.count,
    avgScore: v.count ? Math.round((v.sum / v.count) * 10) / 10 : null,
    fill: colorForType(type),
  }));
}

export function buildPieData(interviews: InterviewLike[]) {
  return buildTypeSlices(interviews).map((s) => ({
    name: s.label,
    value: s.count,
    type: s.type,
    fill: s.fill,
  }));
}

export function buildBarAvgByType(interviews: InterviewLike[]) {
  return buildTypeSlices(interviews).map((s) => ({
    name: s.label,
    avg: s.avgScore ?? 0,
    count: s.count,
    type: s.type,
    fill: s.fill,
  }));
}

export type InsightItem = {
  title: string;
  body: string;
  tone: "positive" | "neutral" | "attention";
};

export function buildInsights(interviews: InterviewLike[]): InsightItem[] {
  const out: InsightItem[] = [];
  if (interviews.length === 0) {
    out.push({
      title: "Get started",
      body: "Complete your first mock interview to unlock personalized trends and insights.",
      tone: "neutral",
    });
    return out;
  }

  const kpis = buildKpis(interviews);
  if (kpis.avgScore !== null) {
    if (kpis.avgScore >= 75) {
      out.push({
        title: "Strong overall performance",
        body: `Your average score is ${kpis.avgScore}%. Keep practicing edge cases to stay sharp.`,
        tone: "positive",
      });
    } else if (kpis.avgScore < 55) {
      out.push({
        title: "Room to grow",
        body: `Average score ${kpis.avgScore}% — focus on one interview type and review feedback after each session.`,
        tone: "attention",
      });
    } else {
      out.push({
        title: "Solid progress",
        body: `You're averaging ${kpis.avgScore}%. Try a different interview type to balance skills.`,
        tone: "neutral",
      });
    }
  }

  const slices = buildTypeSlices(interviews);
  const sorted = [...slices].sort((a, b) => b.count - a.count);
  if (sorted.length >= 2 && sorted[0].count > sorted[1].count * 2) {
    out.push({
      title: "Mix your practice",
      body: `Most sessions are ${sorted[0].label}. Adding ${sorted[1].label} builds a more rounded profile.`,
      tone: "neutral",
    });
  }

  if (kpis.improvementDelta !== null) {
    if (kpis.improvementDelta > 3) {
      out.push({
        title: "Momentum",
        body: `Recent sessions score about ${kpis.improvementDelta} points higher on average than earlier ones.`,
        tone: "positive",
      });
    } else if (kpis.improvementDelta < -3) {
      out.push({
        title: "Check in",
        body: `Recent scores dipped vs earlier sessions — revisit summaries and retry weaker topics.`,
        tone: "attention",
      });
    }
  }

  if (kpis.last7Days >= 3) {
    out.push({
      title: "Consistency",
      body: `${kpis.last7Days} interviews in the last 7 days — regular practice compounds faster.`,
      tone: "positive",
    });
  }

  return out.slice(0, 5);
}

/** Radar spokes (0–100) derived from session scores — high-level overview only; deep metrics live in Analytics. */
export type CompetencyRadarPoint = {
  name: string;
  value: number;
};

export function buildCompetencyRadar(interviews: InterviewLike[]): CompetencyRadarPoint[] {
  if (interviews.length === 0) {
    return [
      { name: "Confidence", value: 0 },
      { name: "Pace", value: 0 },
      { name: "Technical", value: 0 },
      { name: "Body Language", value: 0 },
    ];
  }

  const kpis = buildKpis(interviews);
  const scores = interviews.map((i) => i.finalScore);
  const avg = kpis.avgScore ?? 0;

  const tech = interviews.filter((i) => normalizeType(i.interviewType) === "TECHNICAL");
  const techAvg = tech.length
    ? tech.reduce((s, i) => s + i.finalScore, 0) / tech.length
    : avg;

  const beh = interviews.filter((i) => normalizeType(i.interviewType) === "BEHAVIORAL");
  const behAvg = beh.length
    ? beh.reduce((s, i) => s + i.finalScore, 0) / beh.length
    : Math.min(100, avg * 0.96);

  const confidence = Math.min(100, Math.round(avg));
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((s, x) => s + (x - mean) ** 2, 0) / scores.length;
  const std = Math.sqrt(variance);
  const pace = Math.max(0, Math.min(100, Math.round(100 - std * 1.15)));

  return [
    { name: "Confidence", value: confidence },
    { name: "Pace", value: pace },
    { name: "Technical", value: Math.round(techAvg) },
    { name: "Body Language", value: Math.round(behAvg) },
  ];
}
