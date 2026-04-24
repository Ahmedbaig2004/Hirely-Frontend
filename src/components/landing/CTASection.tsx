"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LpGradientText } from "./LpGradientText";

const APP_MOCKUP_PALETTE = {
  dark: {
    shellBg: "rgba(255,255,255,0.04)",
    shellBorder: "1px solid rgba(244,114,182,0.22)",
    shellShadow:
      "0 -20px 80px rgba(244,114,182,0.12), 0 -40px 120px rgba(251,146,60,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
    sidebarBg: "rgba(255,255,255,0.02)",
    sidebarBorder: "1px solid rgba(255,255,255,0.04)",
    icon: "#94a3b8",
    panelBg: "rgba(255,255,255,0.02)",
    panelBorder: "1px solid rgba(255,255,255,0.04)",
    muted: "#94a3b8",
    title: "#e2e8f0",
    badgeBg: "rgba(52,211,153,0.1)",
    badgeFg: "#34d399",
    tabRule: "1px solid rgba(255,255,255,0.04)",
    tabActive: "#e879f9",
    tabInactive: "#64748b",
    searchBg: "rgba(255,255,255,0.03)",
    searchBorder: "1px solid rgba(255,255,255,0.05)",
    searchMuted: "#64748b",
    entryName: "#e2e8f0",
    entryTime: "#64748b",
    entryBody: "#94a3b8",
    vidNameBg: "rgba(17,24,39,0.6)",
    vidNameFg: "#fff",
    controlBg: "rgba(17,24,39,0.85)",
    controlMuted: "#94a3b8",
    controlTime: "#64748b",
    waveEmpty: "rgba(255,255,255,0.06)",
    playIcon: "#fff",
  },
  light: {
    shellBg: "rgba(255,255,255,0.97)",
    shellBorder: "1px solid rgba(219,39,119,0.28)",
    shellShadow:
      "0 28px 72px rgba(80, 60, 120, 0.14), 0 12px 32px rgba(251, 146, 60, 0.1), inset 0 1px 0 rgba(255,255,255,1)",
    sidebarBg: "rgba(244,249,255,0.95)",
    sidebarBorder: "1px solid rgba(57,72,103,0.12)",
    icon: "#5c6b82",
    panelBg: "rgba(255,255,255,0.98)",
    panelBorder: "1px solid rgba(57,72,103,0.1)",
    muted: "#5c6b82",
    title: "#1b262c",
    badgeBg: "rgba(16,185,129,0.12)",
    badgeFg: "#047857",
    tabRule: "1px solid rgba(57,72,103,0.12)",
    tabActive: "#a21caf",
    tabInactive: "#64748b",
    searchBg: "rgba(248,251,255,0.98)",
    searchBorder: "1px solid rgba(57,72,103,0.14)",
    searchMuted: "#64748b",
    entryName: "#1b262c",
    entryTime: "#64748b",
    entryBody: "#475569",
    vidNameBg: "rgba(255,255,255,0.92)",
    vidNameFg: "#1b262c",
    controlBg: "rgba(241,245,249,0.98)",
    controlMuted: "#5c6b82",
    controlTime: "#64748b",
    waveEmpty: "rgba(27,38,44,0.08)",
    playIcon: "#fff",
  },
} as const;

/* ─── App Mockup (warm accent — distinct from lp blue canvas) ─── */
function AppMockup() {
  const { resolvedTheme } = useTheme();
  const p = resolvedTheme === "light" ? APP_MOCKUP_PALETTE.light : APP_MOCKUP_PALETTE.dark;

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
      <div style={{ display: "flex", minHeight: 360 }}>
        {/* Left sidebar */}
        <div
          style={{
            width: 44,
            background: p.sidebarBg,
            borderRight: p.sidebarBorder,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            gap: 16,
          }}
        >
          {["⌂", "📷", "☰", "⏱", "👥", "⚙"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                opacity: i === 0 ? 0.85 : 0.45,
                color: p.icon,
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Left panel — Transcript */}
        <div
          style={{
            flex: "0 0 40%",
            background: p.panelBg,
            borderRight: p.panelBorder,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: p.muted }}>←</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: p.title }}>Weekly dev sync</span>
            </div>
            <div
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 999,
                background: p.badgeBg,
                color: p.badgeFg,
                fontWeight: 600,
              }}
            >
              Development
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, fontSize: 10, color: p.muted }}>
            <span>📅 Apr 10, 2026</span>
            <span>🕐 2:30 PM</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              borderBottom: p.tabRule,
              paddingBottom: 8,
            }}
          >
            {["Summary", "Transcript", "Notes"].map((tab, i) => (
              <span
                key={tab}
                style={{
                  fontSize: 11,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? p.tabActive : p.tabInactive,
                  borderBottom: i === 0 ? `2px solid ${p.tabActive}` : "none",
                  paddingBottom: 4,
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          <div
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: p.searchBg,
              border: p.searchBorder,
              fontSize: 11,
              color: p.searchMuted,
            }}
          >
            🔍 Search transcript...
          </div>

          {[
            { initials: "AK", color: "#c026d3", name: "Alex Kim", time: "2:31 PM", text: "Let's review the sprint progress..." },
            { initials: "SJ", color: "#ea580c", name: "Sarah J.", time: "2:33 PM", text: "The auth module is complete. Running at 99.2% uptime..." },
            { initials: "AK", color: "#c026d3", name: "Alex Kim", time: "2:35 PM", text: "Great work. What about the API redesign?" },
          ].map((entry, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: entry.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {entry.initials}
              </div>
              <div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: p.entryName }}>{entry.name}</span>
                  <span style={{ fontSize: 9, color: p.entryTime }}>{entry.time}</span>
                </div>
                <p style={{ fontSize: 11, color: p.entryBody, margin: "2px 0 0", lineHeight: 1.5 }}>{entry.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel — Video grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 2,
              padding: 2,
            }}
          >
            {[
              { name: "Alex Kim", gradient: "linear-gradient(135deg, #a21caf, #1e1b2e)" },
              { name: "Sarah J.", gradient: "linear-gradient(135deg, #c2410c, #1e1b2e)" },
              { name: "Mike T.", gradient: "linear-gradient(135deg, #0891b2, #1e1b2e)" },
              { name: "Lisa W.", gradient: "linear-gradient(135deg, #059669, #1e1b2e)" },
            ].map((person, i) => (
              <div
                key={i}
                style={{
                  background: person.gradient,
                  borderRadius: i === 0 ? "0" : "0",
                  position: "relative",
                  minHeight: 80,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: p.vidNameBg,
                    fontSize: 10,
                    color: p.vidNameFg,
                    fontWeight: 500,
                  }}
                >
                  {person.name}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "8px 12px",
              background: p.controlBg,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f97316, #db2777)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={p.playIcon}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <span style={{ fontSize: 10, color: p.controlMuted }}>1x</span>
            <div
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                display: "flex",
                overflow: "hidden",
                gap: 1,
              }}
            >
              <div style={{ flex: 3, background: "#f97316", borderRadius: 2 }} />
              <div style={{ flex: 2, background: "#e879f9", borderRadius: 2 }} />
              <div style={{ flex: 2, background: "#22d3ee", borderRadius: 2 }} />
              <div style={{ flex: 1, background: "#34d399", borderRadius: 2 }} />
              <div style={{ flex: 4, background: p.waveEmpty, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: p.controlTime }}>23:41</span>
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
      style={{ padding: "120px 48px 0", overflow: "hidden" }}
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
