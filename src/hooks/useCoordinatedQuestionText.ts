import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type Opts = {
  /** TTS: reveal characters in lockstep with the HTMLAudioElement timeline. */
  syncToAudio: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Bumps the audio sync effect when playback starts (ref may be ready). */
  isAudioActive?: boolean;
  /** When not syncing, fixed-speed typewriter. */
  typewriterEnabled: boolean;
  msPerChar?: number;
};

/**
 * Question copy for audio/video: with TTS, characters appear in time with
 * voice (`currentTime` / `duration`). Without TTS, uses a simple typewriter.
 */
export function useCoordinatedQuestionText(
  text: string | null | undefined,
  {
    syncToAudio,
    audioRef,
    isAudioActive,
    typewriterEnabled,
    msPerChar = 20,
  }: Opts,
) {
  const reduceMotion = useReducedMotion();
  const [out, setOut] = useState("");
  const [isComplete, setIsComplete] = useState(!!(text && reduceMotion));

  useEffect(() => {
    if (!text) {
      setOut("");
      setIsComplete(true);
    }
  }, [text]);

  // TTS: lockstep with audio (layout effect so the hidden <audio> ref exists)
  useLayoutEffect(() => {
    if (!text || !syncToAudio) return;
    if (reduceMotion) {
      setOut(text);
      setIsComplete(true);
      return;
    }

    const el = audioRef.current;
    if (!el) {
      setOut("");
      setIsComplete(false);
      return;
    }

    setOut("");
    setIsComplete(false);

    const update = () => {
      const t = el.currentTime;
      const d = el.duration;
      if (!d || !isFinite(d) || d <= 0) {
        return;
      }
      const n = Math.min(
        text.length,
        Math.max(0, Math.floor((t / d) * text.length)),
      );
      setOut(text.slice(0, n));
      if (n >= text.length) setIsComplete(true);
    };

    const onEnded = () => {
      if (text) {
        setOut(text);
        setIsComplete(true);
      }
    };

    let raf = 0;
    const tick = () => {
      update();
      if (!el.paused && !el.ended) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onPlay = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const onPause = () => {
      cancelAnimationFrame(raf);
      update();
    };

    el.addEventListener("timeupdate", update);
    el.addEventListener("ended", onEnded);
    el.addEventListener("loadedmetadata", update);
    el.addEventListener("playing", update);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    update();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("timeupdate", update);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("loadedmetadata", update);
      el.removeEventListener("playing", update);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [text, syncToAudio, reduceMotion, audioRef, isAudioActive]);

  // No TTS: typewriter
  useEffect(() => {
    if (!text) return;
    if (syncToAudio) return;

    if (!typewriterEnabled) {
      setOut(text);
      setIsComplete(true);
      return;
    }
    if (reduceMotion) {
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
  }, [text, syncToAudio, typewriterEnabled, reduceMotion, msPerChar]);

  return {
    displayedText: out,
    isComplete: !text ? true : isComplete,
  };
}
