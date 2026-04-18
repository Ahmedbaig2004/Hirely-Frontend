"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── App Mockup (warm accent — distinct from lp blue canvas) ─── */
function AppMockup() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(244,114,182,0.22)",
        backdropFilter: "blur(24px) saturate(1.4)",
        borderRadius: "20px 20px 0 0",
        overflow: "hidden",
        boxShadow:
          "0 -20px 80px rgba(244,114,182,0.12), 0 -40px 120px rgba(251,146,60,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", minHeight: 360 }}>
        {/* Left sidebar */}
        <div
          style={{
            width: 44,
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
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
                opacity: i === 0 ? 0.8 : 0.35,
                color: "#94a3b8",
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
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>←</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Weekly dev sync</span>
            </div>
            <div
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 999,
                background: "rgba(52,211,153,0.1)",
                color: "#34d399",
                fontWeight: 600,
              }}
            >
              Development
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#94a3b8" }}>
            <span>📅 Apr 10, 2026</span>
            <span>🕐 2:30 PM</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              paddingBottom: 8,
            }}
          >
            {["Summary", "Transcript", "Notes"].map((tab, i) => (
              <span
                key={tab}
                style={{
                  fontSize: 11,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? "#e879f9" : "#64748b",
                  borderBottom: i === 0 ? "2px solid #e879f9" : "none",
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
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              fontSize: 11,
              color: "#64748b",
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
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{entry.name}</span>
                  <span style={{ fontSize: 9, color: "#64748b" }}>{entry.time}</span>
                </div>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.5 }}>{entry.text}</p>
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
                    background: "rgba(17,24,39,0.6)",
                    fontSize: 10,
                    color: "#fff",
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
              background: "rgba(17,24,39,0.85)",
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>1x</span>
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
              <div style={{ flex: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: "#64748b" }}>23:41</span>
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
        style={{
          position: "absolute",
          top: "28%",
          right: "16%",
          fontSize: 28,
          color: "rgba(251,191,36,0.35)",
          animation: "lp-float 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "absolute",
          top: "38%",
          right: "12%",
          fontSize: 14,
          color: "rgba(244,114,182,0.35)",
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
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(244,114,182,0.12)",
              border: "1px solid rgba(251,191,36,0.35)",
              backdropFilter: "blur(12px)",
              fontSize: 12,
              fontWeight: 600,
              color: "#fde68a",
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
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 8,
              color: "#faf5ff",
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
            <span className="lp-cta-gradient-text">worth showing up to</span>
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
