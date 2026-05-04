"use client";

import { Fragment, useMemo } from "react";
import type { ReactNode } from "react";
import type { FillerOccurrence, FillerWordBreakdownItem } from "@/lib/fillerOccurrences";
import { collectFillerOccurrencesInOrder } from "@/lib/fillerOccurrences";

export type { FillerWordBreakdownItem } from "@/lib/fillerOccurrences";

function buildHighlightedNodes(transcript: string, occ: FillerOccurrence[]): ReactNode[] {
  if (!occ.length) return [transcript];
  const out: ReactNode[] = [];
  let pos = 0;
  let key = 0;
  for (const o of occ) {
    if (o.start > pos) {
      out.push(<Fragment key={key++}>{transcript.slice(pos, o.start)}</Fragment>);
    }
    const slice = transcript.slice(o.start, o.end);
    out.push(
      <mark
        key={key++}
        className="rounded-sm border-b border-orange-400/55 bg-orange-400/22 px-0.5 py-px font-semibold text-orange-950 not-italic dark:border-orange-400/40 dark:bg-orange-500/18 dark:text-orange-50"
        title="Counted as a filler word in delivery analysis"
      >
        {slice}
      </mark>,
    );
    pos = o.end;
  }
  if (pos < transcript.length) {
    out.push(<Fragment key={key++}>{transcript.slice(pos)}</Fragment>);
  }
  return out;
}

type Props = {
  /** Raw answer text shown in the transcript block */
  transcript: string;
  /** From `deliveryFeedback.fillerWords` (Gemini breakdown). When missing, renders plain text. */
  fillerWords?: FillerWordBreakdownItem[] | null | undefined;
};

/**
 * Marks occurrences of fillers reported by the analyzer (word-boundary-aware, case-insensitive).
 */
export function TranscriptWithFillerHighlight({
  transcript,
  fillerWords,
}: Props) {
  const occ = useMemo(
    () => collectFillerOccurrencesInOrder(transcript, fillerWords),
    [transcript, fillerWords],
  );

  const nodes = useMemo(() => {
    if (!transcript) return null;
    if (!occ.length) return transcript;
    return buildHighlightedNodes(transcript, occ);
  }, [transcript, occ]);

  return <>{nodes}</>;
}
