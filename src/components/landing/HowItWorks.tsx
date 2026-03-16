"use client";

import { Upload, Headphones, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Resume & JD",
    description:
      "Drop your resume PDF and paste the job description. Our AI analyzes your profile and identifies skill gaps instantly.",
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.15)",
    border: "rgba(124,58,237,0.2)",
  },
  {
    step: "02",
    icon: Headphones,
    title: "Face the AI Interviewer",
    description:
      "Answer adaptive questions out loud. The AI adjusts difficulty in real-time based on your responses and expertise level.",
    accent: "#22D3EE",
    glow: "rgba(34,211,238,0.15)",
    border: "rgba(34,211,238,0.2)",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Get Your Report",
    description:
      "Receive a detailed hiring report with scores, strengths, weaknesses, voice analysis, and actionable recommendations.",
    accent: "#10B981",
    glow: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.2)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="min-h-screen flex items-center py-16 px-6 md:px-10 scroll-mt-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="label-caps block mb-4">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 tracking-tight">
            How It Works
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            From upload to offer-ready in minutes. No scheduling, no waiting.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ step, icon: Icon, title, description, accent, glow, border }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              className="glass-card rounded-2xl p-8 text-center group hover:border-violet-500/40 hover:shadow-[0_0_24px_rgba(124,58,237,0.12)] transition-all duration-300"
            >
              {/* Step badge */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${glow}`,
                    border: `1px solid ${border}`,
                  }}
                >
                  <Icon size={22} style={{ color: accent }} />
                </div>
              </div>

              {/* Step number */}
              <span
                className="text-xs font-bold tracking-widest mb-3 block"
                style={{ color: accent, opacity: 0.6 }}
              >
                STEP {step}
              </span>

              <h3 className="text-base font-semibold text-white/90 mb-3 tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
