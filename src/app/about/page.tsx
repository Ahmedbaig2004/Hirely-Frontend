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
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.2)",
  },
  {
    icon: Mic,
    title: "Voice-Aware Evaluation",
    description:
      "Beyond words, we analyze speaking quality, confidence level, fluency, and pacing using ML models trained on real interview audio — giving you a complete candidate profile.",
    accent: "#22D3EE",
    glow: "rgba(34,211,238,0.1)",
    border: "rgba(34,211,238,0.2)",
  },
  {
    icon: Sparkles,
    title: "Truly Adaptive",
    description:
      "Questions aren't scripted. Hirely generates each question in real-time based on your previous answer, adjusting topic, difficulty, and angle to probe your actual knowledge depth.",
    accent: "#10B981",
    glow: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: BarChart3,
    title: "Actionable Reports",
    description:
      "Every interview ends with a hiring-grade report — gap analysis, per-question scoring, voice metrics, strengths, weaknesses, and concrete recommendations to improve.",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: Zap,
    title: "Under 60 Seconds to Start",
    description:
      "Upload a resume. Paste a job description. That's it. No scheduling, no setup, no recruiter emails. Your AI interviewer is ready instantly.",
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.2)",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume and interview data are yours. Sessions are encrypted, audio is processed ephemerally, and you control what gets stored in your dashboard.",
    accent: "#22D3EE",
    glow: "rgba(34,211,238,0.1)",
    border: "rgba(34,211,238,0.2)",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#080810] text-white overflow-x-hidden">
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
                  style={{ backgroundColor: "#22D3EE", boxShadow: "0 0 8px #22D3EE" }}
                />
                <span className="label-caps">About Hirely</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight mb-6">
                The Interview Platform<br />
                <span className="text-violet-400">Built for Real Signal</span>
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl mx-auto">
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
              className="glass-card-raised rounded-2xl p-8 mb-16 border-l-4 border-violet-500"
            >
              <span className="label-caps block mb-3">Our Mission</span>
              <p className="text-white/70 text-sm leading-relaxed">
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
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
                How We&apos;re Different
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {differentiators.map(({ icon: Icon, title, description, accent, glow, border }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card rounded-2xl p-6 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: glow, border: `1px solid ${border}` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">{description}</p>
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
              <p className="text-xs text-white/25">
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
