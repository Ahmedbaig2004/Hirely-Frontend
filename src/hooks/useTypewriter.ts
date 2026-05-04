import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Opts = {
  /** Typing speed in ms per character. */
  msPerChar?: number;
  /** If false, show full text immediately. */
  enabled?: boolean;
};

/**
 * Reveals `text` one character at a time; resets when `text` changes.
 * When `reduceMotion` is on, returns full text with `isComplete` true.
 */
export function useTypewriter(
  text: string | null | undefined,
  { msPerChar = 22, enabled = true }: Opts = {},
) {
  const reduceMotion = useReducedMotion();
  const [out, setOut] = useState("");
  const [isComplete, setIsComplete] = useState(!!(text && reduceMotion && enabled));

  useEffect(() => {
    if (!text || !String(text).length) {
      setOut("");
      setIsComplete(true);
      return;
    }
    if (!enabled || reduceMotion) {
      setOut(text);
      setIsComplete(true);
      return;
    }

    setOut("");
    setIsComplete(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setIsComplete(true);
      }
    }, msPerChar);
    return () => clearInterval(id);
  }, [text, enabled, reduceMotion, msPerChar]);

  return {
    /** Visible substring */
    displayedText: out,
    isComplete: !text ? true : isComplete,
    full: text || "",
  };
}
