"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI-powered interviews at no cost.",
    accent: "#22D3EE",
    glow: "rgba(34,211,238,0.1)",
    border: "rgba(34,211,238,0.2)",
    features: [
      "3 interviews per month",
      "Basic resume parsing",
      "AI-generated questions",
      "Score & feedback report",
      "Dashboard history",
    ],
    cta: "Start Free",
    ctaHref: "/start",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious candidates preparing for competitive roles.",
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.35)",
    features: [
      "Unlimited interviews",
      "Advanced gap analysis",
      "Voice & tone analysis",
      "Adaptive difficulty tuning",
      "Detailed voice metrics",
      "Priority report generation",
      "Export reports as PDF",
    ],
    cta: "Get Pro",
    ctaHref: "/start",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Tailored solutions for recruiting teams and bootcamps.",
    accent: "#10B981",
    glow: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    features: [
      "Everything in Pro",
      "Bulk candidate evaluation",
      "Custom question banks",
      "Team dashboard & analytics",
      "API access",
      "Dedicated support",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@hirely.ai",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[#080810] text-white overflow-x-hidden">
      <MeshGradient />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 md:px-10 pt-28 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#22D3EE", boxShadow: "0 0 8px #22D3EE" }}
                />
                <span className="label-caps">Pricing</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Start free, upgrade when you&apos;re ready. No hidden fees, no contracts.
              </p>
            </motion.div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {tiers.map(({ name, price, period, description, accent, glow, border, features, cta, ctaHref, highlight }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className={`relative rounded-2xl p-7 ${highlight ? "glass-card-raised" : "glass-card"}`}
                  style={{
                    border: highlight ? `1px solid ${border}` : undefined,
                    boxShadow: highlight ? `0 0 32px ${glow}` : undefined,
                  }}
                >
                  {/* Popular badge */}
                  {highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                        boxShadow: "0 0 16px rgba(124,58,237,0.4)",
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  {/* Tier header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: glow, border: `1px solid ${border}` }}
                      >
                        <Zap size={12} style={{ color: accent }} />
                      </div>
                      <span className="text-sm font-semibold text-white/80">{name}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-3xl font-bold text-white/90">{price}</span>
                      <span className="text-xs text-white/35">{period}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{description}</p>
                  </div>

                  <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
                        <span className="text-xs text-white/55">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={ctaHref}
                    className={`block text-center w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                      highlight
                        ? "btn-violet"
                        : "glass-card text-white/70 hover:text-white/90 hover:border-white/20"
                    }`}
                  >
                    {cta}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center text-xs text-white/25 mt-10"
            >
              All plans include access to the Hirely AI platform. Pricing is in USD.
            </motion.p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
