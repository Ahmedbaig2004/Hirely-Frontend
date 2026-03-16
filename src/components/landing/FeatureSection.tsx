"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

/* ── Mock visual: AI Analysis ───────────────────────── */
function AnalysisMockup() {
  const skills = [
    { label: "React", match: true },
    { label: "TypeScript", match: true },
    { label: "GraphQL", match: false },
    { label: "System Design", match: false },
    { label: "Node.js", match: true },
    { label: "AWS", match: false },
  ];

  return (
    <div className="glass-card-raised rounded-2xl p-6 space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60">Gap Analysis</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#F59E0B",
          }}
        >
          68% Match
        </span>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map(({ label, match }) => (
          <span
            key={label}
            className="text-xs px-2.5 py-1 rounded-lg font-medium"
            style={
              match
                ? {
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    color: "#10B981",
                  }
                : {
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#EF4444",
                  }
            }
          >
            {label}
          </span>
        ))}
      </div>

      {/* Score bars */}
      <div className="space-y-3">
        {[
          { label: "Technical Fit", value: 72, color: "#10B981" },
          { label: "Experience Level", value: 55, color: "#F59E0B" },
          { label: "Soft Skills", value: 80, color: "#10B981" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-white/40">{label}</span>
              <span className="text-xs font-semibold" style={{ color }}>
                {value}%
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mock visual: Adaptive Questioning ───────────────── */
function AdaptiveMockup() {
  const messages = [
    {
      type: "ai",
      text: "Tell me about a complex React performance problem you solved.",
      difficulty: "Medium",
    },
    {
      type: "user",
      text: "I used React.memo and useMemo to optimize a heavy render cycle...",
    },
    {
      type: "ai",
      text: "Excellent. Let's go deeper — explain the reconciliation algorithm.",
      difficulty: "Hard",
    },
  ];

  return (
    <div className="glass-card-raised rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white/60">Live Interview</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.25)",
            color: "#a78bfa",
          }}
        >
          Q 2 / 5
        </span>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.type === "ai" ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.type === "ai"
                  ? "text-white/70"
                  : "text-white/50 italic"
              }`}
              style={
                msg.type === "ai"
                  ? {
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.2)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }
              }
            >
              {msg.text}
              {msg.difficulty && (
                <span
                  className="block mt-1 text-[10px] font-bold"
                  style={{ color: msg.difficulty === "Hard" ? "#EF4444" : "#F59E0B" }}
                >
                  ↑ Difficulty: {msg.difficulty}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature rows ────────────────────────────────────── */
const rows = [
  {
    eyebrow: "Intelligent Evaluation",
    title: "AI-Powered Analysis",
    description:
      "Our AI doesn't just listen — it deeply understands. Resumes are parsed semantically, skill gaps are mapped against the job description, and every answer is scored using embedding similarity and LLM grading.",
    bullets: [
      { text: "Semantic resume parsing with gap detection", accent: "#7C3AED" },
      { text: "Cosine similarity over pgvector embeddings", accent: "#22D3EE" },
      { text: "LLM grading with structured feedback", accent: "#10B981" },
    ],
    visual: <AnalysisMockup />,
    reverse: false,
  },
  {
    eyebrow: "Dynamic Difficulty",
    title: "Adaptive Questioning",
    description:
      "No two interviews are the same. Questions evolve in real-time based on your answers — strong responses unlock harder follow-ups, while gaps trigger targeted exploration to assess your true depth.",
    bullets: [
      { text: "Real-time difficulty adjustment per answer", accent: "#7C3AED" },
      { text: "Topic-aware follow-up generation", accent: "#22D3EE" },
      { text: "Powered by Gemini 2.5 Flash", accent: "#10B981" },
    ],
    visual: <AdaptiveMockup />,
    reverse: true,
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="label-caps block mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 tracking-tight">
            Built for Real Hiring Decisions
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            Every layer of Hirely is designed to give you signal, not noise.
          </p>
        </motion.div>

        {/* Z-pattern rows */}
        <div className="space-y-16">
          {rows.map(({ eyebrow, title, description, bullets, visual, reverse }, i) => (
            <div
              key={title}
              className={`flex flex-col ${
                reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12 lg:gap-16`}
            >
              {/* Text side */}
              <motion.div
                initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex-1 max-w-lg"
              >
                <span className="label-caps block mb-4">{eyebrow}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight mb-4">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">{description}</p>
                <ul className="space-y-3">
                  {bullets.map(({ text, accent }) => (
                    <li key={text} className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: accent }}
                      />
                      <span className="text-sm text-white/60">{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual side */}
              <motion.div
                initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex-1 w-full max-w-md"
              >
                {visual}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
