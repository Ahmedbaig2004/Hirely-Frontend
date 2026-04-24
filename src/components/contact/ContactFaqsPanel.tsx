"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/faqData";
import { LpGradientText } from "@/components/landing/LpGradientText";

function Row({
  index,
  isOpen,
  onToggle,
  question,
  answer,
}: {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
  answer: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="overflow-hidden border-b border-slate-200/90 last:border-b-0 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-3 py-4 text-left sm:gap-4 sm:py-[22px]"
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors sm:h-8 sm:w-8 ${
              isOpen
                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                : "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`flex-1 text-[15px] font-semibold leading-snug transition-colors ${
              isOpen ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {question}
          </span>
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--lp-inner-well)] backdrop-blur-sm transition-transform dark:bg-white/[0.04] dark:backdrop-blur-none sm:h-8 sm:w-8 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-slate-500 dark:text-slate-400"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-4 pl-10 text-[14px] leading-relaxed text-slate-600 sm:pb-[22px] sm:pl-11 dark:text-slate-400">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * FAQ column for /contact — split-layout companion to the form (inspired by modern AI contact splits, e.g. Moniveo-style contact patterns on Dribbble).
 */
export function ContactFaqsPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative h-full w-full overflow-hidden rounded-[2rem] border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-6 shadow-[0_20px_52px_-22px_rgba(80,130,180,0.16)] backdrop-blur-[28px] backdrop-saturate-150 sm:p-8 dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[rgb(17,24,39)] dark:via-[rgb(20,30,48)] dark:to-[rgb(20,30,48)] dark:shadow-none dark:backdrop-blur-none">
      <div
        className="pointer-events-none absolute -right-8 top-10 h-32 w-32 rounded-full border border-slate-200/70 dark:border-white/[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-4 bottom-16 h-20 w-20 rotate-12 rounded-2xl border border-slate-200/70 dark:border-white/[0.04]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-[1] mb-8 text-center sm:mb-10"
      >
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-400">
          FAQ
        </span>
        <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
          Common <LpGradientText>Questions</LpGradientText>
        </h2>
      </motion.div>

      <div className="lp-glass-card relative z-[1] rounded-2xl px-4 py-2 sm:px-7">
        {FAQ_ITEMS.map((faq, i) => (
          <Row
            key={faq.question}
            index={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
