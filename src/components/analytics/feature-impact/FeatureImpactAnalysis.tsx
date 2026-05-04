"use client";



import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Activity, Info, Sparkles } from "lucide-react";

import type { FeatureImpactPayload } from "./types";

import { FeatureLineChart } from "./FeatureLineChart";

import { ShapBarChart } from "./ShapBarChart";

import {

  analyzeScoreDrops,

  deriveFeatures,

  humanDropSentence,

  validatePayload,

  labelFeature,

} from "./utils";



type Props = {

  data: FeatureImpactPayload;

};



export function FeatureImpactAnalysis({ data }: Props) {

  const features = useMemo(() => deriveFeatures(data), [data]);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const [dropsOnly, setDropsOnly] = useState(false);



  useEffect(() => {

    setSelected(Object.fromEntries(features.map((f) => [f, true])));

  }, [features]);



  const visible = useMemo(

    () => features.filter((f) => selected[f] !== false),

    [features, selected],

  );



  const drops = useMemo(() => analyzeScoreDrops(data), [data]);



  if (!validatePayload(data)) {

    return (

      <section className="glass-card rounded-2xl border lp-border-sub p-6 lp-sub text-sm">

        Feature impact data is incomplete for this account.

      </section>

    );

  }



  function toggleFeature(key: string) {

    setSelected((s) => ({ ...s, [key]: !(s[key] !== false) }));

  }



  return (

    <motion.section

      initial={{ opacity: 0, y: 16 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}

      className="flex flex-col gap-6"

    >

      <div className="glass-card rounded-2xl border lp-border-sub p-6 lg:p-8">

        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex gap-3">

            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/35 bg-violet-500/15 text-violet-300">

              <Activity size={22} aria-hidden />

            </div>

            <div>

              <p className="label-caps lp-sub mb-1">Explainability</p>

              <h2 className="text-xl font-bold tracking-tight lp-hi">Feature Impact Analysis</h2>

              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed lp-sub">

                Understand how voice-derived metrics move across questions — and when SHAP attribution flags a

                downward driver.{" "}

                {data.interviewId ? (

                  <span className="lp-hi opacity-90">

                    Source session: <code className="rounded bg-[var(--lp-inner-well)] px-1.5 py-0.5 text-[11px]">{data.interviewId.slice(0, 8)}…</code>

                  </span>

                ) : null}

              </p>

            </div>

          </div>



          <div className="flex flex-col gap-3 rounded-xl border border-[var(--lp-border-sub)] bg-[var(--lp-inner-well)] p-4 text-sm lg:min-w-[280px]">

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-xs font-semibold uppercase tracking-wide lp-sub">Features</span>

              {features.map((f) => (

                <button

                  key={f}

                  type="button"

                  onClick={() => toggleFeature(f)}

                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${

                    selected[f] !== false

                      ? "bg-violet-600/80 text-white shadow-sm"

                      : "bg-[var(--lp-surface-md)] text-[var(--lp-text-muted)] hover:lp-hi"

                  }`}

                >

                  {labelFeature(f)}

                </button>

              ))}

            </div>

            <label className="flex cursor-pointer items-center gap-2 lp-hi">

              <input

                type="checkbox"

                className="h-4 w-4 rounded border-[var(--lp-border)] accent-violet-600"

                checked={dropsOnly}

                onChange={(e) => setDropsOnly(e.target.checked)}

              />

              <span className="text-sm font-medium">Markers: show only score drops</span>

            </label>

            <p className="flex gap-2 text-[11px] leading-snug lp-sub">

              <Info size={14} className="mt-0.5 shrink-0 opacity-80" aria-hidden />

              SHAP values are model-local contributions; they summarize pressure on each score track, not causal

              certainty.

            </p>

          </div>

        </header>



        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">

          <div className="xl:col-span-7">

            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold lp-hi">

              <Sparkles size={16} className="text-cyan-400" aria-hidden /> Score trajectories

            </h3>

            <FeatureLineChart payload={data} visibleFeatures={visible} showOnlyDropMarkers={dropsOnly} />

          </div>



          <aside className="flex flex-col gap-4 xl:col-span-5">

            <h3 className="text-sm font-semibold lp-hi">Explainable drops</h3>

            {drops.length === 0 ? (

              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-sm lp-body">

                No score drops detected between consecutive questions for visible features. Great consistency.

              </p>

            ) : (

              <ul className="scrollbar-thin max-h-[min(460px,52vh)] space-y-3 overflow-y-auto pr-1">

                {drops.map((d, idx) => (

                  <motion.li

                    key={`${d.featureKey}-${d.questionIdx}-${idx}`}

                    initial={{ opacity: 0, x: 12 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: idx * 0.04, duration: 0.35 }}

                    className={`rounded-xl border px-4 py-3 text-sm leading-snug ${

                      d.kind === "negative_shap_drop"

                        ? "border-rose-500/35 bg-rose-500/10 lp-body"

                        : "border-[var(--lp-border-sub)] bg-[var(--lp-inner-well)] lp-body"

                    }`}

                  >

                    <span className="font-semibold lp-hi">{d.qShort}</span>

                    <span className="mx-1 opacity-50">—</span>

                    {humanDropSentence(d)}

                  </motion.li>

                ))}

              </ul>

            )}

          </aside>

        </div>

      </div>



      <div className="glass-card rounded-2xl border lp-border-sub p-6 lg:p-8">

        <h3 className="mb-1 text-sm font-semibold lp-hi">SHAP breakdown by question</h3>

        <p className="mb-6 text-xs lp-sub">

          For each answer, see which features the model pushed up (green) or pulled down (red) for that clip.

        </p>

        <ShapBarChart payload={data} visibleFeatures={visible} />

      </div>

    </motion.section>

  );

}

