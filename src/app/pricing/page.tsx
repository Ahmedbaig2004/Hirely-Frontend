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
    accent: "var(--md-sys-color-tertiary)",
    glowColor: "var(--md-sys-color-tertiary)",
    borderColor: "var(--md-sys-color-tertiary)",
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
    accent: "var(--md-sys-color-primary)",
    glowColor: "var(--md-sys-color-primary)",
    borderColor: "var(--md-sys-color-primary)",
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
    glowColor: "#10B981",
    borderColor: "#10B981",
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
    <div className="relative min-h-screen bg-background text-on-surface overflow-x-hidden">
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
                  style={{
                    backgroundColor: "var(--md-sys-color-tertiary)",
                    boxShadow: "0 0 8px var(--md-sys-color-tertiary)",
                  }}
                />
                <span className="label-caps">Pricing</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4 opacity-90">
                Simple, Transparent Pricing
              </h1>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto opacity-60">
                Start free, upgrade when you&apos;re ready. No hidden fees, no contracts.
              </p>
            </motion.div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {tiers.map(({ name, price, period, description, accent, glowColor, borderColor, features, cta, ctaHref, highlight }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className={`relative rounded-2xl p-7 ${highlight ? "glass-card-raised" : "glass-card"}`}
                  style={{
                    border: highlight
                      ? `1px solid color-mix(in srgb, ${borderColor} 35%, transparent)`
                      : undefined,
                    boxShadow: highlight
                      ? `0 0 32px color-mix(in srgb, ${glowColor} 10%, transparent)`
                      : undefined,
                  }}
                >
                  {/* Popular badge */}
                  {highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                      style={{
                        background: "linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-primary-container))",
                        color: "var(--md-sys-color-on-primary)",
                        boxShadow: "0 0 16px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
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
                        style={{
                          background: `color-mix(in srgb, ${glowColor} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${borderColor} 20%, transparent)`,
                        }}
                      >
                        <Zap size={12} style={{ color: accent }} />
                      </div>
                      <span className="text-sm font-semibold text-on-surface opacity-80">{name}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-3xl font-bold text-on-surface opacity-90">{price}</span>
                      <span className="text-xs text-on-surface-variant opacity-45">{period}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed opacity-55">{description}</p>
                  </div>

                  <div className="h-px mb-6 bg-outline-variant opacity-40" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
                        <span className="text-xs text-on-surface-variant opacity-65">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={ctaHref}
                    className={`block text-center w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                      highlight
                        ? "btn-violet"
                        : "glass-card text-on-surface-variant hover:text-on-surface opacity-80 hover:opacity-100"
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
              className="text-center text-xs text-on-surface-variant opacity-35 mt-10"
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
