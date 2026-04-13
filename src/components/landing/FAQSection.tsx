"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How can AI help me with interviews?",
    answer: "Our AI has been trained on thousands of real interviews and provides feedback that closely mirrors what actual hiring managers look for. It evaluates technical accuracy, communication clarity, confidence, and structure.",
  },
  {
    question: "Can I use this for technical coding interviews?",
    answer: "Yes. HIRELY generates role-specific technical questions based on your resume and the job description. It covers system design, algorithms, and framework-specific topics with real-time evaluation.",
  },
  {
    question: "Is my interview data kept private?",
    answer: "Absolutely. Your interview recordings, transcripts, and reports are encrypted end-to-end. We never share your data with employers or third parties. You own your data completely.",
  },
  {
    question: "How does the feedback engine work?",
    answer: "Our AI analyzes your responses in real-time across multiple dimensions: technical accuracy, communication clarity, confidence level, and response structure. It uses advanced NLP models to provide actionable, specific feedback.",
  },
  {
    question: "Can I practice for behavioral interviews too?",
    answer: "Yes. HIRELY covers behavioral questions using the STAR method framework. It evaluates your storytelling ability, relevance of examples, and how well you demonstrate leadership, teamwork, and problem-solving.",
  },
  {
    question: "How many practice sessions can I do?",
    answer: "Free users get 3 full interview sessions per month. Premium users get unlimited sessions with additional features like detailed analytics, progress tracking, and custom question banks.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {/* Number badge */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: isOpen
              ? "linear-gradient(135deg, #2563eb, #3b82f6)"
              : "rgba(59,130,246,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: isOpen ? "#fff" : "#3b82f6",
            flexShrink: 0,
            transition: "background 0.3s",
          }}>
            {index + 1}
          </div>

          {/* Question text */}
          <span style={{
            flex: 1,
            fontSize: 15,
            fontWeight: 600,
            color: isOpen ? "#e2e8f0" : "#94a3b8",
            transition: "color 0.3s",
          }}>
            {faq.question}
          </span>

          {/* Toggle icon */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 0.3s, background 0.3s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p style={{
                fontSize: 14,
                color: "#94a3b8",
                lineHeight: 1.75,
                paddingBottom: 22,
                paddingLeft: 42,
                margin: 0,
              }}>
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════
   FAQ SECTION
═══════════════════════════ */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #111827 0%, #141e30 100%)",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: "absolute", top: "15%", right: "10%",
        width: 120, height: 120,
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "50%",
        transform: "rotate(30deg)",
        animation: "lp-particle-float 20s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "5%",
        width: 80, height: 80,
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: 16,
        transform: "rotate(15deg)",
        animation: "lp-particle-float 24s ease-in-out 4s infinite",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#3b82f6",
            letterSpacing: "0.08em", textTransform: "uppercase",
            display: "block", marginBottom: 12,
          }}>
            FAQ
          </span>
          <h2 style={{
            fontSize: "clamp(30px, 5vw, 48px)",
            fontWeight: 800,
            color: "#e2e8f0",
            lineHeight: 1.2,
          }}>
            Common <span className="lp-gradient-text">Questions</span>
          </h2>
        </motion.div>

        {/* FAQ list */}
        <div
          className="lp-glass-card"
          style={{
            borderRadius: 20,
            padding: "8px 28px",
          }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
