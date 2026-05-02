import type { ReactNode } from "react";

import type { ImpactRow } from "./types";

import { labelFeature, formatSigned } from "./utils";

import { shapKey } from "./types";

import { TOOLTIP_STYLE } from "../chartTheme";



type TooltipEntry = {

  dataKey?: string | number | ((obj: unknown) => unknown);

  value?: number | string;

  color?: string;

  payload?: ImpactRow;

};



type Props = {

  active?: boolean;

  payload?: TooltipEntry[];

  /** Full row series for comparing previous score */

  allRows?: ImpactRow[];

};



function scoreDroppedAt(rows: ImpactRow[] | undefined, rowIndex: number, featureKey: string): boolean {

  if (!rows || rowIndex < 1) return false;

  const cur = Number(rows[rowIndex][featureKey]);

  const prev = Number(rows[rowIndex - 1][featureKey]);

  return cur < prev;

}



export function ImpactLineTooltip({ active, payload, allRows }: Props) {

  if (!active || !payload?.length) return null;



  const pl = payload[0].payload;

  if (!pl || typeof pl.index !== "number") return null;



  const rowIndex = pl.index;



  return (

    <div style={{ ...TOOLTIP_STYLE, padding: "12px 14px", maxWidth: 360 }}>

      <p className="mb-2 border-b border-[var(--chart-tooltip-border)] pb-2 text-xs font-semibold text-[var(--chart-tooltip-color)]">

        {String(pl.questionFull)}

      </p>

      <div className="flex flex-col gap-2.5">

        {payload.map((entry) => {

          const dk = typeof entry.dataKey === "string" ? entry.dataKey : null;

          if (!dk || dk.startsWith("shap__")) return null;



          const score = Number(pl[dk]);

          const sh = Number(pl[shapKey(dk)]);

          const dropped = scoreDroppedAt(allRows, rowIndex, dk);



          let shapMessage: ReactNode = null;

          if (Number.isFinite(sh) && sh < 0) {

            if (dropped) {

              shapMessage = (

                <p className="mt-1 text-[11px] font-semibold text-rose-500">

                  Negative SHAP impact (causing score decrease)

                </p>

              );

            } else {

              shapMessage = (

                <p className="mt-1 text-[11px] font-medium text-amber-500">

                  Negative SHAP impact — model attributes downward pressure here

                  {!dropped ? " (score did not fall vs prior question)" : ""}

                </p>

              );

            }

          }



          return (

            <div

              key={dk}

              className="text-[11px] text-[var(--chart-tooltip-color)]"

              style={{ borderLeft: `3px solid ${entry.color}`, paddingLeft: 8 }}

            >

              <span className="font-semibold">{labelFeature(dk)}</span>

              <div className="mt-0.5 opacity-95">

                Score: {Number.isFinite(score) ? score.toFixed(4) : "—"}

              </div>

              <div className={sh < 0 ? "font-medium text-rose-500/95" : "opacity-90"}>

                SHAP:{" "}

                {Number.isFinite(sh) ? (

                  <>

                    {formatSigned(sh)}

                    {dropped ? (

                      <span className="ml-1 rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500">

                        drop

                      </span>

                    ) : null}

                  </>

                ) : (

                  "—"

                )}

              </div>

              {shapMessage}

            </div>

          );

        })}

      </div>

    </div>

  );

}

