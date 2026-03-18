"use client";

import { Brain, Zap, BarChart3, Mic, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const differentiators = [
  {
    icon: Brain,
    title: "Semantically Intelligent",
    description:
      "We don't just match keywords. Hirely uses vector embeddings and LLM grading to evaluate the depth and relevance of every answer — the same way a senior engineer would.",
    accent: "var(--md-sys-color-primary)",
    glowColor: "var(--md-sys-color-primary)",
    borderColor: "var(--md-sys-color-primary)",
  },
  {
    icon: Mic,
    title: "Voice-Aware Evaluation",
    description:
      "Beyond words, we analyze speaking quality, confidence level, fluency, and pacing using ML models trained on real interview audio — giving you a complete candidate profile.",
    accent: "var(--md-sys-color-tertiary)",
    glowColor: "var(--md-sys-color-tertiary)",
    borderColor: "var(--md-sys-color-tertiary)",
  },
  {
    icon: Sparkles,
    title: "Truly Adaptive",
    description:
      "Questions aren't scripted. Hirely generates each question in real-time based on your previous answer, adjusting topic, difficulty, and angle to probe your actual knowledge depth.",
    accent: "#10B981",
    glowColor: "#10B981",
    borderColor: "#10B981",
  },
  {
    icon: BarChart3,
    title: "Actionable Reports",
    description:
      "Every interview ends with a hiring-grade report — gap analysis, per-question scoring, voice metrics, strengths, weaknesses, and concrete recommendations to improve.",
    accent: "#F59E0B",
    glowColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Under 60 Seconds to Start",
    description:
      "Upload a resume. Paste a job description. That's it. No scheduling, no setup, no recruiter emails. Your AI interviewer is ready instantly.",
    accent: "var(--md-sys-color-primary)",
    glowColor: "var(--md-sys-color-primary)",
    borderColor: "var(--md-sys-color-primary)",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume and interview data are yours. Sessions are encrypted, audio is processed ephemerally, and you control what gets stored in your dashboard.",
    accent: "var(--md-sys-color-tertiary)",
    glowColor: "var(--md-sys-color-tertiary)",
    borderColor: "var(--md-sys-color-tertiary)",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-on-surface overflow-x-hidden">
      <MeshGradient />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 md:px-10 pt-28 pb-16">
          <div className="max-w-5xl mx-auto">

            {/* Hero section */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--md-sys-color-tertiary)",
                    boxShadow: "0 0 8px var(--md-sys-color-tertiary)",
                  }}
                />
                <span className="label-caps">About Hirely</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-6 opacity-90">
                The Interview Platform<br />
                <span className="text-primary">Built for Real Signal</span>
              </h1>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl mx-auto opacity-60">
                Hirely is an AI-powered automated technical interview platform. It parses resumes,
                performs gap analysis against job descriptions, generates adaptive questions, transcribes
                and evaluates your spoken answers, and produces a comprehensive hiring-grade report —
                all without a human recruiter in the loop.
              </p>
            </motion.div>

            {/* Mission card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="glass-card-raised rounded-2xl p-8 mb-16 border-l-4 border-primary"
            >
              <span className="label-caps block mb-3">Our Mission</span>
              <p className="text-on-surface-variant text-sm leading-relaxed opacity-80">
                Hiring is broken. Too much time is wasted on screening calls that don&apos;t assess
                real skill. Candidates are judged on presentation before substance. Hirely exists to
                flip that — to give every candidate a fair, deep, structured evaluation that surfaces
                genuine competence. We believe the best signal comes from a system that listens
                carefully, questions intelligently, and reports honestly.
              </p>
            </motion.div>

            {/* Differentiators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="label-caps block mb-3">Why Hirely</span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight opacity-90">
                How We&apos;re Different
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {differentiators.map(({ icon: Icon, title, description, accent, glowColor, borderColor }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card rounded-2xl p-6 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `color-mix(in srgb, ${glowColor} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${borderColor} 20%, transparent)`,
                    }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface mb-2 tracking-tight opacity-90">
                    {title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed opacity-55">{description}</p>
                </motion.div>
              ))}
            </div>

            {/* Tech stack note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mt-14 text-center"
            >
              <p className="text-xs text-on-surface-variant opacity-30">
                Powered by Gemini 2.5 Flash · Deepgram · pgvector · Next.js 15 · Node.js
              </p>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
