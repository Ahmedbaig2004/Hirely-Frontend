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
    accent: "var(--md-sys-color-primary)",
    glowColor: "var(--md-sys-color-primary)",
    borderColor: "var(--md-sys-color-primary)",
  },
  {
    step: "02",
    icon: Headphones,
    title: "Face the AI Interviewer",
    description:
      "Answer adaptive questions out loud. The AI adjusts difficulty in real-time based on your responses and expertise level.",
    accent: "var(--md-sys-color-tertiary)",
    glowColor: "var(--md-sys-color-tertiary)",
    borderColor: "var(--md-sys-color-tertiary)",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Get Your Report",
    description:
      "Receive a detailed hiring report with scores, strengths, weaknesses, voice analysis, and actionable recommendations.",
    accent: "#10B981",
    glowColor: "#10B981",
    borderColor: "#10B981",
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
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight opacity-90">
            How It Works
          </h2>
          <p className="text-on-surface-variant text-sm mt-4 max-w-md mx-auto opacity-60">
            From upload to offer-ready in minutes. No scheduling, no waiting.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ step, icon: Icon, title, description, accent, glowColor, borderColor }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              className="glass-card rounded-2xl p-8 text-center group transition-all duration-300"
              style={{
                ["--hover-border" as string]: `color-mix(in srgb, ${borderColor} 40%, transparent)`,
              }}
            >
              {/* Step badge */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `color-mix(in srgb, ${glowColor} 15%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${borderColor} 20%, transparent)`,
                  }}
                >
                  <Icon size={22} style={{ color: accent }} />
                </div>
              </div>

              {/* Step number */}
              <span
                className="text-xs font-bold tracking-widest mb-3 block opacity-60"
                style={{ color: accent }}
              >
                STEP {step}
              </span>

              <h3 className="text-base font-semibold text-on-surface mb-3 tracking-tight opacity-90">
                {title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-60">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
