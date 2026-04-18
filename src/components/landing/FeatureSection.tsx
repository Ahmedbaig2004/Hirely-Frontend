"use client";

import { useId, useRef, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ─── Feature cards data ─── */
const features = [
  {
    title: "Smart Resume Parsing",
    description:
      "AI extracts skills, experience, and qualifications to personalize every interview session automatically.",
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
  },
  {
    title: "Adaptive AI Interviewer",
    description:
      "Dynamic questions that respond to your answers — strong responses unlock harder follow-ups, just like a real interview.",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
        <path d="M8 12a4 4 0 018 0" />
      </svg>
    ),
    accentColor: "#a78bfa",
  },
  {
    title: "Technical Evaluation",
    description:
      "Evaluate coding knowledge, system design reasoning, and problem-solving depth with AI-graded accuracy.",
    gradient: "linear-gradient(135deg, #0891b2, #22d3ee)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    accentColor: "#22d3ee",
  },
  {
    title: "Voice & Confidence",
    description:
      "Real-time speech analysis — filler words, pauses, pitch variation — to help you sound polished and confident.",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M19 10a7 7 0 01-14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    accentColor: "#f97316",
  },
  {
    title: "Detailed Reports",
    description:
      "Comprehensive scorecards with visual breakdowns, strengths, weaknesses, and prioritized improvement tips.",
    gradient: "linear-gradient(135deg, #db2777, #f472b6)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    accentColor: "#f472b6",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your improvement session over session. See trends, compare scores, and focus on areas that matter most.",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
    accentColor: "#34d399",
  },
];

/** Each card gets a distinct slanted / cut silhouette (2D, not a uniform rounded rect). */
const CARD_CLIPS = [
  "polygon(0% 6%, 100% 0%, 100% 100%, 5% 100%)",
  "polygon(3% 0%, 100% 4%, 97% 100%, 0% 96%)",
  "polygon(0% 0%, 94% 5%, 100% 94%, 6% 100%)",
  "polygon(5% 0%, 100% 0%, 96% 100%, 0% 92%)",
  "polygon(0% 4%, 100% 0%, 100% 100%, 4% 96%)",
  "polygon(2% 2%, 98% 0%, 100% 98%, 0% 100%)",
];

/** Bento: 12-col grid, staggered rows — breaks the “same square grid” rhythm. */
const BENTO_PLACES: { col: string; row: number; y: number; z: number; rot: number }[] = [
  { col: "1 / 7", row: 1, y: 0, z: 2, rot: -0.6 },
  { col: "7 / 13", row: 1, y: 52, z: 1, rot: 0.7 },
  { col: "1 / 7", row: 2, y: -12, z: 1, rot: 0.5 },
  { col: "7 / 13", row: 2, y: 48, z: 2, rot: -0.55 },
  { col: "1 / 7", row: 3, y: 4, z: 2, rot: -0.45 },
  { col: "7 / 13", row: 3, y: 44, z: 1, rot: 0.65 },
];

/** Extra offset before `whileInView` — cards slide in from their side’s corner (left / right × top / bottom). */
const SLIDE_FROM_CORNER: { x: number; y: number }[] = [
  { x: -120, y: -56 }, // 0 left column — top-left
  { x: 120, y: -56 }, // 1 right — top-right
  { x: -120, y: 64 }, // 2 left — bottom-left
  { x: 120, y: 64 }, // 3 right — bottom-right
  { x: -120, y: -48 }, // 4 left — top-left
  { x: 120, y: 56 }, // 5 right — bottom-right
];

function FeaturePlane2D({ uid }: { uid: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute left-1/2 top-0 h-[120%] w-[140%] -translate-x-1/2 opacity-[0.45]" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id={`${uid}-b`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M-80 120 C200 40 400 200 600 100 S1000 20 1280 180"
          fill="none"
          stroke={`url(#${uid}-a)`}
          strokeWidth="1.25"
          className="lp-features-ribbon"
        />
        <path
          d="M-40 420 Q300 360 600 440 T1220 400"
          fill="none"
          stroke={`url(#${uid}-b)`}
          strokeWidth="1"
          className="lp-features-ribbon"
          style={{ animationDelay: "-8s" }}
        />
        <path
          d="M100 640 Q500 560 900 620"
          fill="none"
          stroke="rgba(167,139,250,0.15)"
          strokeWidth="0.75"
          strokeDasharray="6 12"
          className="lp-features-ribbon"
          style={{ animationDuration: "32s" }}
        />
      </svg>

      <svg className="lp-features-hex-a absolute -right-[8%] top-[12%] h-48 w-48 opacity-25" viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="none" stroke="rgba(34,211,238,0.35)" strokeWidth="0.6" />
      </svg>
      <svg className="lp-features-hex-b absolute -left-[4%] bottom-[18%] h-40 w-40 opacity-20" viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="0.5" />
      </svg>

      <svg className="lp-features-tri absolute left-[12%] top-[22%] h-24 w-24 opacity-30" viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,12 88,82 12,82" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />
      </svg>
      <svg className="lp-features-tri absolute bottom-[28%] right-[18%] h-20 w-20 opacity-25" viewBox="0 0 100 100" style={{ animationDelay: "1.2s" }} aria-hidden>
        <polygon points="50,12 88,82 12,82" fill="none" stroke="rgba(244,114,182,0.22)" strokeWidth="1" />
      </svg>

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 4 L56 18 L56 46 L30 60 L4 46 L4 18 Z' fill='none' stroke='%2367e8f9' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 52px",
        }}
      />
    </div>
  );
}

function FeatureCard({
  feature,
  index,
  clip,
  place,
}: {
  feature: (typeof features)[0];
  index: number;
  clip: string;
  place: (typeof BENTO_PLACES)[0];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (reduceMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translate(${x * 10}px, ${y * 8}px) rotate(${place.rot + x * 3}deg) scale(1.015)`;
  }, [place.rot, reduceMotion]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "";
    }
    setHovered(false);
  }, []);

  const corner = SLIDE_FROM_CORNER[index] ?? { x: 0, y: 0 };
  const rest = { x: 0, y: place.y, rotate: place.rot, opacity: 1 };
  const from = reduceMotion
    ? rest
    : {
        x: corner.x,
        y: place.y + corner.y,
        rotate: place.rot * 2.8,
        opacity: 0,
      };

  return (
    <motion.div
      className="lp-features-card-slot"
      initial={from}
      whileInView={rest}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.72,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.45, delay: index * 0.06 },
      }}
      style={{
        gridColumn: place.col,
        gridRow: place.row,
        zIndex: place.z,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          clipPath: clip,
          padding: 28,
          minHeight: "100%",
          cursor: "default",
          position: "relative",
          background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px ${feature.accentColor}35, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 16px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
          backdropFilter: "blur(18px) saturate(1.35)",
          WebkitBackdropFilter: "blur(18px) saturate(1.35)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            clipPath: clip,
            background: `linear-gradient(135deg, ${feature.accentColor}12 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            clipPath: index % 3 === 0 ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" : "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
            background: feature.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            transition: "transform 0.35s ease, box-shadow 0.35s ease",
            transform: hovered ? "scale(1.06) rotate(-4deg)" : "scale(1)",
            boxShadow: hovered ? `0 8px 28px ${feature.accentColor}45` : `0 4px 16px ${feature.accentColor}22`,
          }}
        >
          {feature.icon}
        </div>

        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#94a3b8",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureSection() {
  const uid = useId().replace(/:/g, "");

  return (
    <section
      id="features"
      className="lp-features-section scroll-mt-24"
      style={{
        position: "relative",
        background: "linear-gradient(165deg, #070b14 0%, #0f172a 38%, #0c1220 100%)",
        padding: "clamp(72px, 12vw, 120px) clamp(20px, 4vw, 48px) clamp(88px, 14vw, 140px)",
        overflow: "hidden",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 15% 20%, rgba(34,211,238,0.07), transparent 50%), radial-gradient(ellipse 70% 45% at 85% 75%, rgba(167,139,250,0.06), transparent 55%)",
        }}
      />
      <FeaturePlane2D uid={uid} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(48px, 8vw, 72px)", textAlign: "left" }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: 14,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#67e8f9",
              border: "1px solid rgba(103,232,249,0.25)",
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              background: "rgba(103,232,249,0.06)",
            }}
          >
            Product surface
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 5vw, 50px)",
              fontWeight: 800,
              color: "#f8fafc",
              lineHeight: 1.08,
              marginBottom: 16,
              maxWidth: 720,
            }}
          >
            Built for real{" "}
            <span className="lp-gradient-text" style={{ fontStyle: "italic" }}>
              hiring decisions
            </span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#94a3b8",
              maxWidth: 520,
              lineHeight: 1.75,
            }}
          >
            Every feature is designed to replicate and improve upon the real interview experience — laid out as a flowing surface, not another uniform grid.
          </p>
        </motion.div>

        <div className="lp-features-bento">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} clip={CARD_CLIPS[i]!} place={BENTO_PLACES[i]!} />
          ))}
        </div>
      </div>
    </section>
  );
}
