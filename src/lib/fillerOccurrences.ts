/** Shared filler matching for transcript highlighting and approximate audio timeline markers (delivery analysis breakdown). */

export type FillerWordBreakdownItem = {
  word: string;
  count: number;
};

/** Letter or number — adjacent match would sit inside another word. Unicode-aware. */
export function isAlphanumericOrDigit(ch: string | undefined): boolean {
  return ch !== undefined && /\p{L}|\p{N}/u.test(ch);
}

export function fillerHasPhraseBoundaries(
  transcript: string,
  startIdx: number,
  phraseLen: number,
): boolean {
  const before = transcript[startIdx - 1];
  const after = transcript[startIdx + phraseLen];
  return !isAlphanumericOrDigit(before) && !isAlphanumericOrDigit(after);
}

/**
 * Deduped fillers, longest-first, so multi-word phrases win over shared substrings ("sort of" vs "sort").
 */
export function orderedFillerPhrases(items: FillerWordBreakdownItem[]): string[] {
  const uniq = [...new Set(items.map((f) => f.word.trim()).filter(Boolean))];
  uniq.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return uniq;
}

type EarliestMatch = { start: number; len: number };

export function findEarliestFillerMatch(
  transcript: string,
  phrases: string[],
  from: number,
): EarliestMatch | null {
  let best: EarliestMatch | null = null;
  const low = transcript.toLowerCase();

  for (const phrase of phrases) {
    if (!phrase.length) continue;
    const needle = phrase.toLowerCase();
    let searchPos = from;
    while (searchPos <= transcript.length) {
      const idx = low.indexOf(needle, searchPos);
      if (idx === -1) break;
      if (fillerHasPhraseBoundaries(transcript, idx, needle.length)) {
        if (
          !best ||
          idx < best.start ||
          (idx === best.start && needle.length > best.len)
        ) {
          best = { start: idx, len: needle.length };
        }
        break;
      }
      searchPos = idx + 1;
    }
  }

  return best;
}

export type FillerOccurrence = {
  /** Text as spoken/written in the transcript */
  surfaceText: string;
  start: number;
  end: number;
};

/**
 * Non-overlapping filler spans in reading order (same rules as transcript `<mark>` highlighting).
 */
export function collectFillerOccurrencesInOrder(
  transcript: string,
  fillerWords: FillerWordBreakdownItem[] | null | undefined,
): FillerOccurrence[] {
  if (!transcript || !fillerWords?.length) return [];
  const phrases = orderedFillerPhrases(fillerWords);
  if (!phrases.length) return [];

  const out: FillerOccurrence[] = [];
  let pos = 0;
  while (pos < transcript.length) {
    const m = findEarliestFillerMatch(transcript, phrases, pos);
    if (!m) break;
    out.push({
      surfaceText: transcript.slice(m.start, m.start + m.len),
      start: m.start,
      end: m.start + m.len,
    });
    pos = m.start + m.len;
  }
  return out;
}

/**
 * Map a character offset in the transcript to an approximate time in the recording.
 * Speech is assumed roughly uniform across the clip (no forced alignment API yet).
 */
export function approximateAudioTimeSec(
  startChar: number,
  transcriptLen: number,
  durationSec: number,
): number {
  const len = Math.max(1, transcriptLen);
  const d = Math.max(0, durationSec);
  if (d === 0) return 0;
  return Math.min(d, Math.max(0, (startChar / len) * d));
}
