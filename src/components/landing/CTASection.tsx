"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  Home,
  Info,
  LayoutList,
  Lightbulb,
  Loader2,
  Mic,
  Settings,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { LpGradientText } from "./LpGradientText";

const APP_MOCKUP_PALETTE = {
  dark: {
    shellBg: "rgba(255,255,255,0.04)",
    shellBorder: "1px solid rgba(244,114,182,0.22)",
    shellShadow:
      "0 -20px 80px rgba(244,114,182,0.12), 0 -40px 120px rgba(251,146,60,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
    sidebarBg: "rgba(255,255,255,0.03)",
    sidebarBorder: "1px solid rgba(255,255,255,0.06)",
    icon: "#94a3b8",
    iconActive: "#e879f9",
    panelBg: "rgba(248,252,255,0.04)",
    panelBorder: "1px solid rgba(255,255,255,0.06)",
    muted: "#94a3b8",
    title: "#f1f5f9",
    kicker: "#64748b",
    badgeBg: "rgba(52,211,153,0.12)",
    badgeFg: "#34d399",
    pillDoneBg: "rgba(16,185,129,0.14)",
    pillDoneBd: "1px solid rgba(16,185,129,0.35)",
    pillLiveBg: "rgba(255,255,255,0.06)",
    pillLiveBd: "1px solid rgba(167,139,250,0.35)",
    tipBg: "rgba(255,255,255,0.06)",
    tipBd: "1px solid rgba(167,139,250,0.25)",
    stageTint: "rgba(15,23,42,0.35)",
    gridLine: "rgba(148,163,184,0.14)",
    blobA: "rgba(56,189,248,0.35)",
    blobB: "rgba(253,224,71,0.28)",
    blobC: "rgba(167,139,250,0.32)",
    questionInk: "#e2e8f0",
    listenCardBg: "rgba(255,255,255,0.94)",
    listenCardBd: "1px solid rgba(226,232,240,0.85)",
    listenMuted: "#64748b",
    micGlow: "rgba(45,212,191,0.35)",
    waveBar: "#14b8a6",
    doneBtn: "linear-gradient(135deg, #059669, #10b981)",
    footerBg: "rgba(15,23,42,0.92)",
    footerMuted: "#94a3b8",
    ringTrack: "rgba(148,163,184,0.2)",
    accentPurple: "#a855f7",
    accentTeal: "#2dd4bf",
    dashedLine: "rgba(148,163,184,0.35)",
  },
  light: {
    shellBg: "rgba(255,255,255,0.97)",
    shellBorder: "1px solid rgba(219,39,119,0.28)",
    shellShadow:
      "0 28px 72px rgba(80, 60, 120, 0.14), 0 12px 32px rgba(251, 146, 60, 0.1), inset 0 1px 0 rgba(255,255,255,1)",
    sidebarBg: "rgba(244,249,255,0.98)",
    sidebarBorder: "1px solid rgba(57,72,103,0.1)",
    icon: "#64748b",
    iconActive: "#7c3aed",
    panelBg: "rgba(255,255,255,0.92)",
    panelBorder: "1px solid rgba(57,72,103,0.1)",
    muted: "#64748b",
    title: "#0f172a",
    kicker: "#64748b",
    badgeBg: "rgba(16,185,129,0.14)",
    badgeFg: "#047857",
    pillDoneBg: "rgba(236,253,245,0.95)",
    pillDoneBd: "1px solid rgba(16,185,129,0.35)",
    pillLiveBg: "rgba(255,255,255,0.98)",
    pillLiveBd: "1px solid rgba(167,139,250,0.35)",
    tipBg: "rgba(248,250,252,0.95)",
    tipBd: "1px solid rgba(226,232,240,0.95)",
    stageTint: "rgba(241,245,249,0.5)",
    gridLine: "rgba(57,72,103,0.08)",
    blobA: "rgba(125,211,252,0.55)",
    blobB: "rgba(253,224,71,0.4)",
    blobC: "rgba(196,181,253,0.5)",
    questionInk: "#0f172a",
    listenCardBg: "rgba(255,255,255,0.98)",
    listenCardBd: "1px solid rgba(226,232,240,0.95)",
    listenMuted: "#64748b",
    micGlow: "rgba(45,212,191,0.25)",
    waveBar: "#0d9488",
    doneBtn: "linear-gradient(135deg, #059669, #14b8a6)",
    footerBg: "rgba(248,250,252,0.98)",
    footerMuted: "#64748b",
    ringTrack: "rgba(148,163,184,0.25)",
    accentPurple: "#7c3aed",
    accentTeal: "#14b8a6",
    dashedLine: "rgba(71,85,105,0.28)",
  },
} as const;

type MockupPalette =
  | (typeof APP_MOCKUP_PALETTE)["dark"]
  | (typeof APP_MOCKUP_PALETTE)["light"];

function PipelineRing({
  pct,
  track,
  from,
  to,
}: {
  pct: number;
  track: string;
  from: string;
  to: string;
}) {
  const r = 26;
  const cx = 32;
  const cy = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="mock-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth="5" />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#mock-ring-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}

function StageBackdrop({ p }: { p: MockupPalette }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "0 12px 0 0",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: p.stageTint,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.9,
          backgroundImage: `linear-gradient(${p.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${p.gridLine} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-12%",
          left: "-8%",
          width: "58%",
          height: "58%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.blobA} 0%, transparent 72%)`,
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-6%",
          left: "12%",
          width: "46%",
          height: "46%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.blobB} 0%, transparent 70%)`,
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4%",
          right: "-10%",
          width: "52%",
          height: "56%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.blobC} 0%, transparent 70%)`,
          filter: "blur(2px)",
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.55 }}
        preserveAspectRatio="none"
      >
        <path
          d="M 0 48 C 120 88, 200 24, 320 52 S 520 20, 640 56 L 640 360 L 0 360 Z"
          fill="none"
          stroke={p.dashedLine}
          strokeWidth="1"
          strokeDasharray="5 7"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 120 C 140 96, 260 168, 400 132 S 540 180, 640 148"
          fill="none"
          stroke={p.dashedLine}
          strokeWidth="1"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function WaveformBars({ color }: { color: string }) {
  const heights = [22, 44, 32, 56, 38, 62, 34, 48, 28, 52, 36, 40];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 3,
        height: 44,
      }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          style={{
            width: 4,
            borderRadius: 3,
            background: color,
            transformOrigin: "bottom",
          }}
          animate={{ height: [h * 0.35, h, h * 0.45, h * 0.9] }}
          transition={{
            duration: 1.2 + i * 0.06,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── App Mockup — Hirely interview journey (prep → live listening) ─── */
function AppMockup() {
  const { resolvedTheme } = useTheme();
  const p = resolvedTheme === "light" ? APP_MOCKUP_PALETTE.light : APP_MOCKUP_PALETTE.dark;

  const rail = [
    { Icon: Home, active: true },
    { Icon: Video, active: false },
    { Icon: LayoutList, active: false },
    { Icon: Clock, active: false },
    { Icon: Users, active: false },
    { Icon: Settings, active: false },
  ];

  return (
    <div
      style={{
        background: p.shellBg,
        border: p.shellBorder,
        backdropFilter: "blur(24px) saturate(1.4)",
        borderRadius: "20px 20px 0 0",
        overflow: "hidden",
        boxShadow: p.shellShadow,
      }}
    >
      <div style={{ display: "flex", minHeight: 384 }}>
        {/* Icon rail */}
        <div
          style={{
            width: 44,
            flexShrink: 0,
            background: p.sidebarBg,
            borderRight: p.sidebarBorder,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14,
            gap: 14,
          }}
        >
          {rail.map(({ Icon, active }, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "rgba(167,139,250,0.15)" : "transparent",
                border: active ? "1px solid rgba(167,139,250,0.35)" : "1px solid transparent",
                color: active ? p.iconActive : p.icon,
                opacity: active ? 1 : 0.55,
              }}
            >
              <Icon size={15} strokeWidth={2} />
            </div>
          ))}
        </div>

        {/* Prep pipeline — mirrors “Preparing your interview” */}
        <div
          style={{
            flex: "0 0 42%",
            maxWidth: 280,
            background: p.panelBg,
            borderRight: p.panelBorder,
            padding: "14px 14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  color: p.kicker,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                Session setup
              </p>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: p.title, lineHeight: 1.25, margin: 0 }}>
                Preparing your interview
              </h3>
              <p style={{ fontSize: 10, color: p.muted, margin: "6px 0 0", lineHeight: 1.45 }}>
                We personalize questions from your profile—resume, role fit, and focus areas.
              </p>
            </div>
            <div
              style={{
                fontSize: 9,
                padding: "4px 8px",
                borderRadius: 999,
                background: p.badgeBg,
                color: p.badgeFg,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Live prep
            </div>
          </div>

          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              fontWeight: 700,
              color: p.kicker,
              margin: "4px 0 0",
              textTransform: "uppercase",
            }}
          >
            This usually takes ~15 seconds
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 12,
                background: p.pillDoneBg,
                border: p.pillDoneBd,
              }}
            >
              <CheckCircle2 size={16} style={{ color: p.badgeFg, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: p.title, margin: 0 }}>Interview context ready</p>
                <p style={{ fontSize: 9, color: p.muted, margin: "2px 0 0" }}>Resume & role signals merged</p>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: p.badgeFg }}>Done</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 12,
                background: p.pillLiveBg,
                border: p.pillLiveBd,
              }}
            >
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: p.accentPurple, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: p.title, margin: 0 }}>Generating interview questions</p>
                <p style={{ fontSize: 9, color: p.muted, margin: "2px 0 0" }}>Tailoring difficulty & topics…</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 10 }}>
            <PipelineRing pct={82} track={p.ringTrack} from={p.accentPurple} to={p.accentTeal} />
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: p.title, letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>
                82%
              </p>
              <p style={{ fontSize: 9, color: p.muted, margin: "4px 0 0", maxWidth: 120, lineHeight: 1.35 }}>
                Setup progress (estimated from stage)
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              borderRadius: 12,
              background: p.tipBg,
              border: p.tipBd,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 10,
                background: "rgba(167,139,250,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Lightbulb size={13} style={{ color: p.accentPurple }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: p.accentPurple,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                While you wait
              </p>
              <p style={{ fontSize: 10, color: p.muted, margin: "4px 0 0", lineHeight: 1.45 }}>
                Breathe evenly—clear beats fast. The AI scores clarity, not pace.
              </p>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[1, 2, 3, 4].map((dot) => (
                  <div
                    key={dot}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: dot === 1 ? p.accentPurple : "rgba(148,163,184,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live stage — question + listening card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
          <StageBackdrop p={p} />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "14px 14px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(167,139,250,0.12)",
                border: "1px solid rgba(167,139,250,0.28)",
                marginBottom: 10,
              }}
            >
              <Sparkles size={11} style={{ color: p.accentPurple }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: p.accentPurple }}>
                Technical • Question 2 of 5
              </span>
            </div>

            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: p.questionInk,
                lineHeight: 1.45,
                margin: 0,
                maxWidth: 260,
              }}
            >
              Tell me about yourself and your professional background.
            </p>

            <div style={{ flex: 1, minHeight: 8 }} />

            <div
              style={{
                width: "100%",
                maxWidth: 220,
                borderRadius: 18,
                padding: "12px 12px 10px",
                background: p.listenCardBg,
                border: p.listenCardBd,
                boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `radial-gradient(circle at 30% 30%, ${p.micGlow}, rgba(255,255,255,0))`,
                    border: "1px solid rgba(45,212,191,0.35)",
                  }}
                >
                  <Mic size={18} style={{ color: "#0f766e" }} strokeWidth={2.2} />
                </div>
              </div>
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  fontWeight: 800,
                  color: p.listenMuted,
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                }}
              >
                Listening
              </p>
              <WaveformBars color={p.waveBar} />
              <motion.button
                type="button"
                style={{
                  marginTop: 12,
                  width: "100%",
                  border: "none",
                  borderRadius: 999,
                  padding: "9px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "default",
                  background: p.doneBtn,
                  boxShadow: "0 8px 22px rgba(16,185,129,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <BrainCircuit size={14} />
                Done speaking
              </motion.button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "8px 12px",
              background: p.footerBg,
              borderTop: p.panelBorder,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Info size={12} style={{ color: p.accentPurple, opacity: 0.85, flexShrink: 0 }} aria-hidden />
              <span style={{ fontSize: 9, fontWeight: 700, color: p.footerMuted, letterSpacing: "0.04em" }}>
                Heads-up
              </span>
              <span style={{ fontSize: 9, color: p.footerMuted, opacity: 0.85 }}>
                You can re-read the question while you answer.
              </span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: d === 0 ? p.accentPurple : "rgba(148,163,184,0.35)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CTA SECTION — motion-poster mesh (not lp-page blue)
═══════════════════════════ */
export function CTASection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="lp-cta-section"
      style={{
        padding: "120px 48px clamp(48px, 8vw, 88px)",
        overflow: "hidden",
      }}
    >
      <div
        className="lp-cta-mesh-blob lp-cta-mesh-a"
        style={{
          top: "-12%",
          left: "-8%",
          width: "58%",
          height: "58%",
          background: "radial-gradient(circle, rgba(236,72,153,0.42) 0%, transparent 70%)",
        }}
      />
      <div
        className="lp-cta-mesh-blob lp-cta-mesh-b"
        style={{
          top: "0%",
          right: "-10%",
          width: "52%",
          height: "52%",
          background: "radial-gradient(circle, rgba(251,146,60,0.36) 0%, transparent 70%)",
        }}
      />
      <div
        className="lp-cta-mesh-blob lp-cta-mesh-c"
        style={{
          bottom: "-18%",
          left: "15%",
          width: "62%",
          height: "58%",
          background: "radial-gradient(circle, rgba(129,140,248,0.38) 0%, transparent 72%)",
        }}
      />
      <div className="lp-cta-noise" aria-hidden />

      <div
        className="lp-cta-sparkle"
        style={{
          position: "absolute",
          top: "28%",
          right: "16%",
          fontSize: 28,
          animation: "lp-float 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        ✦
      </div>
      <div
        className="lp-cta-sparkle-pink"
        style={{
          position: "absolute",
          top: "38%",
          right: "12%",
          fontSize: 14,
          animation: "lp-float 5s ease-in-out 1s infinite",
          pointerEvents: "none",
        }}
      >
        ✦
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="lp-cta-kicker"
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              border: "1px solid transparent",
              backdropFilter: "blur(12px)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Let&apos;s get started!
          </div>
        </motion.div>

        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            transitionDelay: "0.1s",
            willChange: "transform, opacity",
          }}
        >
          <h2
            className="lp-cta-heading-line"
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Make every interview
          </h2>
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            <LpGradientText variant="cta">worth showing up to</LpGradientText>
          </h2>
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            transitionDelay: "0.2s",
            willChange: "transform, opacity",
          }}
        >
          <Link
            href="/start"
            className="lp-cta-primary-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 40px",
              borderRadius: 14,
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            Get Started for Free
          </Link>
        </div>

        <div
          style={{
            marginTop: 60,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(60px)",
            transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: "0.4s",
            willChange: "transform, opacity",
          }}
        >
          <AppMockup />
        </div>
      </div>
    </section>
  );
}
