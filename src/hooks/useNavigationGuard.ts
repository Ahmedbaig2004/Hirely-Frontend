"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";

/**
 * Intercepts all navigation away from /interview while isActive is true.
 * Three vectors covered:
 *   1. <Link> clicks    — capture-phase click listener (Next.js respects preventDefault)
 *   2. Tab close/refresh — beforeunload native dialog
 *   3. Browser back     — guard history entry + popstate
 *
 * pendingUrl is non-null when navigation was intercepted.
 * "__BACK__" sentinel means the browser back button was pressed.
 * Call clearPending() after handling (confirm or cancel).
 */
export function useNavigationGuard(isActive: boolean) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Stable refs so event handlers always see latest values without re-registering
  const setPendingRef = useRef(setPendingUrl);
  setPendingRef.current = setPendingUrl;
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    if (!isActive) return;

    // 1. beforeunload — tab close, F5, typing a new URL
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2. Capture <a href> clicks before Next.js router processes them.
    //    Next.js <Link> checks e.defaultPrevented in its onClick and skips
    //    navigation when true, so this reliably blocks client-side transitions.
    const handleLinkClick = (e: MouseEvent) => {
      if (!isActiveRef.current) return;
      const anchor = (e.target as Element).closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return; // external — allow
        if (url.pathname === "/interview") return; // same page — allow
        e.preventDefault();
        // flushSync forces synchronous modal render so the UI appears before
        // React can batch/defer the update during a concurrent transition.
        flushSync(() =>
          setPendingRef.current(url.pathname + url.search + url.hash),
        );
      } catch {
        // malformed href — allow navigation
      }
    };
    document.addEventListener("click", handleLinkClick, true);

    // 3. Back button — push a guard entry (same URL) so pressing back hits it
    //    first. popstate re-pushes the guard to hold position and shows modal.
    const guardState = { interviewGuard: true };
    window.history.pushState(guardState, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(guardState, "", window.location.href);
      flushSync(() => setPendingRef.current("__BACK__"));
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isActive]);

  const clearPending = useCallback(() => setPendingUrl(null), []);
  return { pendingUrl, clearPending };
}
