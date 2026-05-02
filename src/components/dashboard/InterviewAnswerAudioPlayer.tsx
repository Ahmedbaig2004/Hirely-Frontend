"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MoreHorizontal, Pause, Play, Volume2 } from "lucide-react";
import type { FillerWordBreakdownItem } from "@/lib/fillerOccurrences";
import {
  approximateAudioTimeSec,
  collectFillerOccurrencesInOrder,
} from "@/lib/fillerOccurrences";

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  audioUrl: string;
  transcript: string;
  fillerWords?: FillerWordBreakdownItem[] | null;
};

/**
 * Custom scrubber + play controls so filler moments can be marked on the timeline.
 * Times are estimated from each filler’s position in the transcript vs. total audio length.
 */
export function InterviewAnswerAudioPlayer({
  audioUrl,
  transcript,
  fillerWords,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const occurrences = useMemo(
    () => collectFillerOccurrencesInOrder(transcript, fillerWords),
    [transcript, fillerWords],
  );

  const transcriptLen = transcript.length;
  const markers = useMemo(() => {
    if (!duration || transcriptLen <= 0 || !occurrences.length) return [];
    return occurrences.map((o, i) => ({
      id: i,
      sec: approximateAudioTimeSec(o.start, transcriptLen, duration),
      word: o.surfaceText,
    }));
  }, [duration, transcriptLen, occurrences]);

  const syncState = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const d = Number.isFinite(el.duration) ? el.duration : 0;
    setCurrentTime(el.currentTime);
    setDuration(d);
    setPlaying(!el.paused);
  }, []);

  useEffect(() => {
    setReady(false);
    setDuration(0);
    setCurrentTime(0);
    setPlaying(false);
  }, [audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onMeta = () => {
      const d = Number.isFinite(el.duration) ? el.duration : 0;
      setDuration(d);
      setReady(true);
      syncState();
    };
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(el.currentTime);
    };
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [audioUrl, syncState]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }, []);

  const seekToClientX = useCallback(
    (clientX: number) => {
      const el = audioRef.current;
      const bar = trackRef.current;
      if (!el || !bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = rect.width > 0 ? Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) : 0;
      el.currentTime = pct * duration;
      setCurrentTime(el.currentTime);
    },
    [duration],
  );

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full overflow-visible">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

      <div className="flex w-full items-center gap-3 overflow-visible rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-900/50">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-900 transition hover:bg-neutral-200/80 disabled:opacity-40 dark:text-neutral-100 dark:hover:bg-neutral-800"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause size={17} strokeWidth={2.25} />
          ) : (
            <Play size={17} strokeWidth={2.25} className="ml-0.5" />
          )}
        </button>

        <span className="shrink-0 text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
          {formatTime(currentTime)} / {ready && duration ? formatTime(duration) : "0:00"}
        </span>

        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration * 1000) || 100}
          aria-valuenow={Math.round(currentTime * 1000)}
          aria-label="Playback position"
          className="relative min-w-0 flex-1 cursor-pointer overflow-visible py-2 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-neutral-900"
          onClick={(e) => seekToClientX(e.clientX)}
          onKeyDown={(e) => {
            const el = audioRef.current;
            if (!el || !duration) return;
            const step = Math.min(5, duration * 0.05);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              el.currentTime = Math.min(duration, el.currentTime + step);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              el.currentTime = Math.max(0, el.currentTime - step);
            }
          }}
        >
          {/* Thin, high-contrast track (native-like grey bar) */}
          <div
            ref={trackRef}
            className="relative h-[5px] w-full overflow-visible rounded-full bg-[#d4d4d4] dark:bg-[#525252]"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-[#737373] dark:bg-[#a3a3a3]"
              style={{ width: `${progressPct}%` }}
            />
            {markers.map((m) => {
              const leftPct = duration > 0 ? (m.sec / duration) * 100 : 0;
              const label = `Filler word: “${m.word}”`;
              return (
                <div
                  key={m.id}
                  className="group absolute top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 isolate"
                  style={{ left: `${leftPct}%` }}
                >
                  <button
                    type="button"
                    aria-label={label}
                    className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow outline-none ring-offset-1 transition hover:scale-125 hover:ring-2 hover:ring-orange-400/70 focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-neutral-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      const el = audioRef.current;
                      if (el && duration) {
                        el.currentTime = Math.min(duration, Math.max(0, m.sec));
                        void el.play();
                      }
                    }}
                  />
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1.5 text-[10px] font-semibold leading-snug text-orange-950 opacity-0 shadow-md ring-1 ring-orange-500/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-orange-500/35 dark:bg-orange-950/90 dark:text-orange-50 dark:ring-orange-400/15"
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-neutral-400 dark:text-neutral-500" aria-hidden>
          <Volume2 size={18} strokeWidth={1.75} />
          <MoreHorizontal size={18} strokeWidth={1.75} />
        </div>
      </div>

      {markers.length > 0 && (
        <p className="mt-1.5 text-[10px] leading-snug text-neutral-500 dark:text-neutral-500">
          Orange dots mark estimated filler moments (from transcript position vs. recording length). Hover the dot for
          the word; click to jump.
        </p>
      )}
    </div>
  );
}
