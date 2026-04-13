"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── App Mockup ─── */
function AppMockup() {
  return (
    <div style={{
      background: "var(--lp-glass)",
      border: "1px solid var(--lp-glass-border)",
      backdropFilter: "blur(24px) saturate(1.4)",
      borderRadius: "20px 20px 0 0",
      overflow: "hidden",
      boxShadow: "0 -20px 80px rgba(167,139,250,0.08), 0 -40px 120px rgba(59,130,246,0.1)",
    }}>
      <div style={{ display: "flex", minHeight: 360 }}>
        {/* Left sidebar */}
        <div style={{
          width: 44,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          gap: 16,
        }}>
          {["⌂", "📷", "☰", "⏱", "👥", "⚙"].map((icon, i) => (
            <div key={i} style={{
              width: 24, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, opacity: i === 0 ? 0.8 : 0.35,
              color: "#94a3b8",
            }}>
              {icon}
            </div>
          ))}
        </div>

        {/* Left panel — Transcript */}
        <div style={{
          flex: "0 0 40%",
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>←</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Weekly dev sync</span>
            </div>
            <div style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 999,
              background: "rgba(52,211,153,0.1)", color: "#34d399", fontWeight: 600,
            }}>
              Development
            </div>
          </div>

          {/* Date info */}
          <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#94a3b8" }}>
            <span>📅 Apr 10, 2026</span>
            <span>🕐 2:30 PM</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 8 }}>
            {["Summary", "Transcript", "Notes"].map((tab, i) => (
              <span key={tab} style={{
                fontSize: 11, fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "#3b82f6" : "#64748b",
                borderBottom: i === 0 ? "2px solid #3b82f6" : "none",
                paddingBottom: 4,
              }}>
                {tab}
              </span>
            ))}
          </div>

          {/* Search */}
          <div style={{
            padding: "6px 10px", borderRadius: 8,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
            fontSize: 11, color: "#64748b",
          }}>
            🔍 Search transcript...
          </div>

          {/* Transcript entries */}
          {[
            { initials: "AK", color: "#3b82f6", name: "Alex Kim", time: "2:31 PM", text: "Let's review the sprint progress..." },
            { initials: "SJ", color: "#a78bfa", name: "Sarah J.", time: "2:33 PM", text: "The auth module is complete. Running at 99.2% uptime..." },
            { initials: "AK", color: "#3b82f6", name: "Alex Kim", time: "2:35 PM", text: "Great work. What about the API redesign?" },
          ].map((entry, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: entry.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff",
              }}>
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
          <div style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 2,
            padding: 2,
          }}>
            {[
              { name: "Alex Kim", gradient: "linear-gradient(135deg, #1d4ed8, #111827)" },
              { name: "Sarah J.", gradient: "linear-gradient(135deg, #7c3aed, #111827)" },
              { name: "Mike T.", gradient: "linear-gradient(135deg, #0891b2, #111827)" },
              { name: "Lisa W.", gradient: "linear-gradient(135deg, #059669, #111827)" },
            ].map((person, i) => (
              <div key={i} style={{
                background: person.gradient,
                borderRadius: i === 0 ? "0" : "0",
                position: "relative",
                minHeight: 80,
              }}>
                <div style={{
                  position: "absolute", bottom: 6, left: 6,
                  padding: "2px 8px", borderRadius: 4,
                  background: "rgba(17,24,39,0.6)",
                  fontSize: 10, color: "#fff", fontWeight: 500,
                }}>
                  {person.name}
                </div>
              </div>
            ))}
          </div>

          {/* Video controls */}
          <div style={{
            padding: "8px 12px",
            background: "rgba(17,24,39,0.85)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#3b82f6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>1x</span>
            <div style={{
              flex: 1, height: 4, borderRadius: 2,
              display: "flex", overflow: "hidden", gap: 1,
            }}>
              <div style={{ flex: 3, background: "#3b82f6", borderRadius: 2 }} />
              <div style={{ flex: 2, background: "#a78bfa", borderRadius: 2 }} />
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
   CTA SECTION
═══════════════════════════ */
export function CTASection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "radial-gradient(ellipse at 50% 0%, #2563eb 0%, #1d4ed8 35%, #111827 100%)",
        padding: "120px 48px 0",
        overflow: "hidden",
      }}
    >
      {/* Dot grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.12) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* Sparkle decorations */}
      <div style={{
        position: "absolute", top: "30%", right: "18%",
        fontSize: 28, color: "rgba(34,211,238,0.45)",
        animation: "lp-float 4s ease-in-out infinite",
        pointerEvents: "none",
      }}>✦</div>
      <div style={{
        position: "absolute", top: "40%", right: "15%",
        fontSize: 14, color: "rgba(34,211,238,0.3)",
        animation: "lp-float 5s ease-in-out 1s infinite",
        pointerEvents: "none",
      }}>✦</div>

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Badge */}
        <motion.div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            willChange: "transform, opacity",
          }}
        >
          <div style={{
            display: "inline-block",
            padding: "6px 18px",
            borderRadius: 999,
            background: "rgba(37,99,235,0.18)",
            border: "1px solid rgba(37,99,235,0.35)",
            backdropFilter: "blur(12px)",
            fontSize: 12,
            fontWeight: 600,
            color: "#e2e8f0",
            marginBottom: 20,
          }}>
            Let&apos;s get started!
          </div>
        </motion.div>

        {/* Headline */}
        <div style={{
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          transitionDelay: "0.1s",
          willChange: "transform, opacity",
        }}>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 8,
            color: "#e2e8f0",
          }}>
            Make every interview
          </h2>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 28,
          }}>
            <span className="lp-gradient-text">worth showing up to</span>
          </h2>
        </div>

        {/* CTA Button */}
        <div style={{
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          transitionDelay: "0.2s",
          willChange: "transform, opacity",
        }}>
          <Link
            href="/start"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 40px",
              borderRadius: 14,
              background: "#2563eb",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(37,99,235,0.5)",
              boxShadow: "0 4px 24px rgba(59,130,246,0.15), 0 0 40px -10px rgba(34,211,238,0.08)",
              transition: "transform 0.2s, box-shadow 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(59,130,246,0.25), 0 0 60px -10px rgba(34,211,238,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.15), 0 0 40px -10px rgba(34,211,238,0.08)";
            }}
          >
            Get Started for Free
          </Link>
        </div>

        {/* App mockup */}
        <div style={{
          marginTop: 60,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(60px)",
          transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
          transitionDelay: "0.4s",
          willChange: "transform, opacity",
        }}>
          <AppMockup />
        </div>
      </div>
    </section>
  );
}
