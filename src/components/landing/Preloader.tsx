"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePreloaderContext } from "./PreloaderContext";

const BRAND = "HIRELY";
const DELAY_BEFORE_FLY_S = 1;

function measureFlyTargets(text: HTMLElement) {
  const target = document.querySelector<HTMLElement>("[data-navbar-logo-text]");
  if (!target) return null;
  const textRect = text.getBoundingClientRect();
  const logoRect = target.getBoundingClientRect();
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;
  const endX = logoRect.left + logoRect.width / 2;
  const endY = logoRect.top + logoRect.height / 2;
  return {
    dx: endX - startX,
    dy: endY - startY,
    scale: Math.min(
      logoRect.height / Math.max(textRect.height, 1),
      logoRect.width / Math.max(textRect.width, 1),
      1,
    ),
  };
}

/**
 * Landing-only: typewriter → pause → fly to navbar. Runs on every full load or client navigation to `/`.
 */
export function LandingPreloader() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const { revealNavbarLogo } = usePreloaderContext();
  const [active, setActive] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const innerFlyRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (pathname !== "/") {
      setActive(false);
      return;
    }
    setActive(true);
  }, [pathname]);

  /* If loader unmounts (route change / Strict Mode), ensure we never leave GSAP opacity on the page. */
  useLayoutEffect(() => {
    return () => {
      const main = document.getElementById("landing-scroll-content");
      if (main) gsap.set(main, { clearProps: "opacity" });
    };
  }, []);

  useGSAP(
    () => {
      if (!active) return;

      const root = rootRef.current;
      const bg = bgRef.current;
      const left = curtainLeftRef.current;
      const right = curtainRightRef.current;
      const text = textRef.current;
      const main = document.getElementById("landing-scroll-content");
      if (!root || !bg || !left || !right || !text || !main) return;

      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.set(letters, { opacity: 0 });
      /* Never hide #landing-scroll-content with opacity — if this timeline is killed (Strict Mode,
         navigation, errors), opacity:0 would stick and the whole page looks blank/white. */
      gsap.set([left, right], { xPercent: 0 });
      gsap.set(bg, { opacity: 1, filter: "blur(0px)" });
      gsap.set(text, {
        position: "fixed",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        zIndex: 2,
        transformOrigin: "50% 50%",
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      });

      const finishLoader = () => {
        gsap.set(root, { display: "none", pointerEvents: "none" });
        revealNavbarLogo();
      };

      const outer = gsap.timeline();
      outer.to(letters, {
        opacity: 1,
        duration: 0.06,
        stagger: 0.11,
        ease: "power2.out",
      });
      outer.to({}, {
        duration: DELAY_BEFORE_FLY_S,
        onComplete: () => {
          const pos = measureFlyTargets(text);
          if (!pos) {
            revealNavbarLogo();
            gsap.set(root, { display: "none", pointerEvents: "none" });
            return;
          }

          innerFlyRef.current?.kill();
          const fly = gsap.timeline({ onComplete: finishLoader });
          innerFlyRef.current = fly;

          fly.to(
            bg,
            {
              opacity: 0.35,
              filter: "blur(10px)",
              duration: 0.9,
              ease: "power2.inOut",
            },
            0,
          );
          fly.to(left, { xPercent: -100, duration: 1.15, ease: "expo.inOut" }, 0.05);
          fly.to(right, { xPercent: 100, duration: 1.15, ease: "expo.inOut" }, 0.05);
          fly.to(
            text,
            {
              x: pos.dx,
              y: pos.dy,
              scale: pos.scale,
              duration: 1.35,
              ease: "expo.inOut",
            },
            0,
          );
          fly.to(text, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.15");
          fly.to(bg, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.25");
        },
      });

      return () => {
        outer.kill();
        innerFlyRef.current?.kill();
        innerFlyRef.current = null;
        gsap.set(main, { clearProps: "opacity" });
      };
    },
    { scope: rootRef, dependencies: [active, revealNavbarLogo] },
  );

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto fixed inset-0 z-[999] overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ background: "var(--lp-background)" }}
      />
      <div
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: isLight
            ? "linear-gradient(90deg, rgba(180, 218, 252, 0.85), rgba(242, 249, 255, 0))"
            : "linear-gradient(90deg, rgba(15,23,42,0.95), transparent)",
        }}
      />
      <div
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background: isLight
            ? "linear-gradient(270deg, rgba(180, 218, 252, 0.85), rgba(242, 249, 255, 0))"
            : "linear-gradient(270deg, rgba(15,23,42,0.95), transparent)",
        }}
      />

      <div
        ref={textRef}
        className="relative flex select-none"
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(2.75rem, 10vw, 4.25rem)",
          letterSpacing: "0.08em",
          color: isLight ? "#0c2748" : "#f1f5f9",
        }}
        aria-hidden
      >
        {BRAND.split("").map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            style={{ display: "inline-block" }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
