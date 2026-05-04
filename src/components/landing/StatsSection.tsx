"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LpGradientText } from "./LpGradientText";

/* ─── Animated Counter ─── */
function CountUp({ target, suffix = "", prefix = "", duration = 2000 }: {
  target: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

const stats = [
  {
    value: 110,
    suffix: "K+",
    label: "Mock Interviews",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(34,211,238,0.03))",
    borderColor: "rgba(34,211,238,0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    value: 1.8,
    suffix: "M",
    label: "Questions Answered",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.03))",
    borderColor: "rgba(167,139,250,0.15)",
    isDecimal: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    value: 35,
    suffix: "",
    label: "Industries Covered",
    color: "#34d399",
    gradient: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.03))",
    borderColor: "rgba(52,211,153,0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
];

export function StatsSection() {
  return (
    <section
      className="lp-stats-section"
      style={{
        position: "relative",
        padding: "60px 24px",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(var(--lp-grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--lp-grid-color) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        opacity: 0.3,
        pointerEvents: "none",
      }} />

      {/* Decorative shapes */}
      <div
        className="lp-stats-deco"
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 120,
          height: 120,
          border: "1px solid transparent",
          borderRadius: 20,
          transform: "rotate(45deg)",
          opacity: 0.5,
          animation: "lp-particle-float 18s ease-in-out infinite",
        }}
      />
      <div
        className="lp-stats-deco"
        style={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          width: 80,
          height: 80,
          border: "1px solid transparent",
          borderRadius: "50%",
          opacity: 0.4,
          animation: "lp-particle-float 22s ease-in-out 3s infinite",
        }}
      />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            className="lp-stats-kicker"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}
          >
            OUR IMPACT
          </span>
          <h2
            className="lp-stats-heading"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            Trusted by <LpGradientText>Thousands</LpGradientText>
          </h2>
          <p className="lp-stats-sub" style={{ fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Thousands of candidates have improved their interview skills with our platform.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div
                className="lp-glass-card"
                style={{
                  borderRadius: 20,
                  padding: "32px 28px",
                  textAlign: "center",
                  borderTop: `2px solid ${stat.borderColor}`,
                  transition: "transform 0.3s, box-shadow 0.4s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: stat.gradient,
                  border: `1px solid ${stat.borderColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  {stat.icon}
                </div>

                {/* Number */}
                <div style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {stat.isDecimal ? (
                    <CountUp target={18} suffix="" prefix="" duration={2000} />
                  ) : (
                    <CountUp target={stat.value} suffix="" duration={2000} />
                  )}
                  <span style={{ fontSize: 36 }}>
                    {stat.isDecimal ? (
                      <>
                        <span style={{ fontSize: 14, opacity: 0.6 }}>.</span>
                        <span>M</span>
                      </>
                    ) : stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <p className="lp-stats-label" style={{ fontSize: 14, fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
