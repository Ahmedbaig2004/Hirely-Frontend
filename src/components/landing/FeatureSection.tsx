"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

/* ─── Feature cards data ─── */
const features = [
  {
    title: "Smart Resume Parsing",
    description: "AI extracts skills, experience, and qualifications to personalize every interview session automatically.",
    gradient: "linear-gradient(135deg, #2563eb, #3b82f6)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
    accentColor: "#3b82f6",
    topBorder: "#3b82f6",
  },
  {
    title: "Adaptive AI Interviewer",
    description: "Dynamic questions that respond to your answers — strong responses unlock harder follow-ups, just like a real interview.",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
        <path d="M8 12a4 4 0 018 0" />
      </svg>
    ),
    accentColor: "#a78bfa",
    topBorder: "#a78bfa",
  },
  {
    title: "Technical Evaluation",
    description: "Evaluate coding knowledge, system design reasoning, and problem-solving depth with AI-graded accuracy.",
    gradient: "linear-gradient(135deg, #0891b2, #22d3ee)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    accentColor: "#22d3ee",
    topBorder: "#22d3ee",
  },
  {
    title: "Voice & Confidence",
    description: "Real-time speech analysis — filler words, pauses, pitch variation — to help you sound polished and confident.",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M19 10a7 7 0 01-14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    accentColor: "#f97316",
    topBorder: "#f97316",
  },
  {
    title: "Detailed Reports",
    description: "Comprehensive scorecards with visual breakdowns, strengths, weaknesses, and prioritized improvement tips.",
    gradient: "linear-gradient(135deg, #db2777, #f472b6)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    accentColor: "#f472b6",
    topBorder: "#f472b6",
  },
  {
    title: "Progress Tracking",
    description: "Track your improvement session over session. See trends, compare scores, and focus on areas that matter most.",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
    accentColor: "#34d399",
    topBorder: "#34d399",
  },
];

/* ─── Single Feature Card ─── */
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-8px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = "";
    setHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="lp-glass-card"
        style={{
          borderRadius: 16,
          padding: 28,
          transition: "transform 0.2s ease-out, box-shadow 0.4s ease, border-color 0.4s ease",
          borderTop: `2px solid ${feature.topBorder}30`,
          cursor: "default",
          height: "100%",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: feature.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          transition: "transform 0.3s, box-shadow 0.3s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          boxShadow: hovered ? `0 4px 20px ${feature.accentColor}40` : "none",
        }}>
          {feature.icon}
        </div>

        {/* Title — always light: section bg is permanently dark (#111827) */}
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#e2e8f0",
          marginBottom: 8,
        }}>
          {feature.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: "#94a3b8",
          lineHeight: 1.65,
          margin: 0,
          textAlign: "justify",
        }}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Background Shapes ─── */
function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--lp-grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--lp-grid-color) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        animation: "lp-grid-drift 12s linear infinite",
        opacity: 0.4,
      }} />
      {/* Glow patches */}
      <div style={{
        position: "absolute", top: "10%", left: "20%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "lp-pulse-slow 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "15%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "lp-pulse-slow 8s ease-in-out 2s infinite",
      }} />
      {/* Floating shapes */}
      {[
        { top: "15%", left: "8%", size: 80, opacity: 0.04, dur: 16 },
        { top: "60%", right: "6%", size: 60, opacity: 0.03, dur: 20 },
        { top: "35%", left: "75%", size: 100, opacity: 0.03, dur: 22 },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: (s as { left?: string }).left,
            right: (s as { right?: string }).right,
            width: s.size,
            height: s.size,
            borderRadius: i % 2 === 0 ? 16 : "50%",
            border: "1px solid rgba(255,255,255,0.04)",
            opacity: s.opacity,
            animation: `lp-particle-float ${s.dur}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════
   FEATURE SECTION
═══════════════════════════ */
export function FeatureSection() {
  return (
    <section
      id="features"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #111827 0%, #162236 100%)",
        padding: "60px 24px",
        overflow: "hidden",
      }}
    >
      <BackgroundElements />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <h2 style={{
            fontSize: "clamp(30px, 5vw, 48px)",
            fontWeight: 800,
            color: "#e2e8f0",
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Built for Real{" "}
            <span className="lp-gradient-text">Hiring Decisions</span>
          </h2>
          <p style={{
            fontSize: 16,
            color: "#94a3b8",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Every feature is designed to replicate and improve upon the real interview experience.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
