"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import FloatingShapes from "@/components/ui/FloatingShapes";
import { fadeInUp, pageStagger, cardPop, staggerSpring } from "@/lib/motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { LpGradientText } from "@/components/landing/LpGradientText";
const plans = [
  {
    name: "Basic",
    monthly: 0,
    yearly: 0,
    desc: "Perfect for trying out HIRELY.",
    features: ["3 mock interviews / month", "Basic AI questions", "Summary report", "Email support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 15,
    desc: "For serious job seekers who want an edge.",
    features: [
      "Unlimited interviews",
      "Advanced adaptive questions",
      "Full detailed reports",
      "Speech & confidence analysis",
      "Technical + soft skill scoring",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Premium",
    monthly: 39,
    yearly: 29,
    desc: "For teams and career coaches.",
    features: [
      "Everything in Pro",
      "Team dashboard (up to 10)",
      "Custom question sets",
      "API access",
      "White-label reports",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const comparison = [
  { feature: "Mock interviews", basic: "3 / mo", pro: "Unlimited", premium: "Unlimited" },
  { feature: "AI question generation", basic: "Basic", pro: "Advanced", premium: "Custom" },
  { feature: "Performance reports", basic: "Summary", pro: "Full", premium: "White-label" },
  { feature: "Speech analysis", basic: "—", pro: "Yes", premium: "Yes" },
  { feature: "Confidence scoring", basic: "—", pro: "Yes", premium: "Yes" },
  { feature: "Team dashboard", basic: "—", pro: "—", premium: "Up to 10" },
  { feature: "API access", basic: "—", pro: "—", premium: "Yes" },
  { feature: "Support", basic: "Email", pro: "Priority", premium: "Dedicated" },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;

  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <main className="relative z-10 flex flex-col pt-24">
        <section className="relative py-20 sm:py-28">
          <FloatingShapes />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={pageStagger}
            className="mx-auto flex max-w-3xl flex-col gap-6 px-4 text-center"
          >
            <motion.div variants={fadeInUp} className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-800 dark:text-primary">
                Pricing
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Plans That <LpGradientText>Scale with You</LpGradientText>
              </h1>
              <p className="mx-auto max-w-lg text-lg text-slate-600 dark:text-muted-foreground">
                Start free, upgrade when you&apos;re ready. Cancel anytime.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3">
              <span
                className={`text-sm font-medium transition ${
                  !yearly ? "text-slate-900 dark:text-foreground" : "text-slate-500 dark:text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setYearly(!yearly)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  yearly ? "bg-primary" : "bg-slate-300/95 dark:bg-muted"
                }`}
                aria-label={yearly ? "Switch to monthly billing" : "Switch to yearly billing"}
              >
                <motion.div
                  className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow"
                  animate={{ x: yearly ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </button>
              <span
                className={`text-sm font-medium transition ${
                  yearly ? "text-slate-900 dark:text-foreground" : "text-slate-500 dark:text-muted-foreground"
                }`}
              >
                Yearly <span className="text-xs font-semibold text-primary">Save 20%</span>
              </span>
            </motion.div>
          </motion.div>
        </section>

        <SectionWrapper className="-mt-8 pb-20">
          <motion.div
            variants={staggerSpring}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                custom={i}
                variants={cardPop}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`relative rounded-2xl p-7 transition-shadow glass-card hover:shadow-[0_8px_32px_rgba(59,130,246,0.08)] ${
                  p.highlight ? "shadow-xl ring-2 ring-primary shadow-[0_12px_40px_rgba(59,130,246,0.12)]" : ""
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary-light px-4 py-1 text-[10px] font-bold text-white shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-xs font-semibold text-slate-600 dark:text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${yearly ? p.yearly : p.monthly}
                  </span>
                  {p.monthly > 0 && (
                    <span className="text-sm text-slate-600 dark:text-muted-foreground">/ mo</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-800 dark:text-inherit"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="mt-0.5 shrink-0 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    isLoggedIn
                      ? `/checkout?plan=${encodeURIComponent(p.name.toLowerCase())}`
                      : "/auth"
                  }
                  className={`mt-7 flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    p.highlight
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-[0_8px_24px_rgba(59,130,246,0.25)]"
                      : "border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] backdrop-blur-md hover:bg-[var(--lp-inner-well)] dark:border-border dark:bg-muted/40 dark:backdrop-blur-sm dark:hover:bg-muted"
                  }`}
                >
                  {isLoggedIn ? (p.monthly === 0 ? "Current Plan" : `Upgrade to ${p.name}`) : p.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        <SectionWrapper className="pb-24 sm:pb-32">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-slate-50"
          >
            Feature Comparison
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 overflow-x-auto rounded-2xl glass-card"
          >
            <table className="w-full min-w-[580px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-medium text-slate-600 dark:text-muted-foreground">
                    Feature
                  </th>
                  <th className="px-5 py-3 text-center font-medium">Basic</th>
                  <th className="px-5 py-3 text-center font-medium text-primary">Pro</th>
                  <th className="px-5 py-3 text-center font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.feature} className="border-b border-border/50">
                    <td className="px-5 py-3 text-slate-600 dark:text-muted-foreground">{r.feature}</td>
                    <td className="px-5 py-3 text-center text-slate-800 dark:text-inherit">{r.basic}</td>
                    <td className="px-5 py-3 text-center font-medium text-slate-900 dark:text-inherit">{r.pro}</td>
                    <td className="px-5 py-3 text-center text-slate-800 dark:text-inherit">{r.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </SectionWrapper>
      </main>
    </div>
  );
}
