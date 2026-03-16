"use client";

import Link from "next/link";
import { Brain, Zap, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { EncryptedText } from "@/components/ui/encrypted-text";

const flipWords = ["Reimagined.", "Elevated.", "Mastered.", "Perfected."];

const features = [
  { icon: Brain,    label: "AI-Powered Analysis",  accent: "#7C3AED" },
  { icon: Zap,      label: "Real-time Feedback",   accent: "#22D3EE" },
  { icon: Sparkles, label: "Adaptive Questions",   accent: "#10B981" },
];

export function HeroSection() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2 mb-7"
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#22D3EE", boxShadow: "0 0 8px #22D3EE" }}
        />
        <span className="label-caps">AI Interview Platform</span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6"
      >
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white">
          Your Interview,
        </h1>
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
          <FlipWords
            words={flipWords}
            duration={3500}
            className="text-violet-400"
          />
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="text-sm mb-9 max-w-sm"
      >
        <EncryptedText
          text="Upload your resume. Describe the role. Face a real AI interviewer."
          className="font-mono"
          encryptedClassName="text-white/10"
          revealedClassName="text-white/40 font-light tracking-wide"
          revealDelayMs={40}
        />
      </motion.p>

      {/* Feature chips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {features.map(({ icon: Icon, label, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card"
          >
            <Icon size={13} style={{ color: accent }} />
            <span className="text-xs text-white/45 font-medium">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link
          href="/start"
          className="btn-violet rounded-full px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2"
        >
          Start Your Interview
          <ArrowRight size={16} />
        </Link>
        <button
          onClick={scrollToHowItWorks}
          className="glass-card rounded-full px-6 py-3.5 text-sm text-white/60 hover:text-white/90 transition-all duration-200 inline-flex items-center gap-2"
        >
          See How It Works
          <ChevronDown size={16} />
        </button>
      </motion.div>

      {/* Bottom fade — prevents "peeking" of next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #080810)",
        }}
      />

      {/* Scroll indicator — pinned to bottom of hero */}
      <motion.button
        onClick={scrollToHowItWorks}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer"
        aria-label="Scroll down"
      >
        <span className="text-[10px] tracking-widest uppercase text-white/25 group-hover:text-white/50 transition-colors duration-200">
          Discover More
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-white/25 group-hover:text-violet-400 transition-colors duration-200" />
        </motion.div>
      </motion.button>
    </section>
  );
}
