"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faqData";
import { fadeInUp, pageStagger } from "@/lib/motion";
import { cn } from "@/components/lib/utils";

const CATEGORIES = [
  {
    title: "Guides",
    desc: "Step-by-step walkthroughs for your first session and beyond.",
    icon: BookOpen,
    href: "/start",
    accent: "from-blue-500/30 to-cyan-500/20",
    border: "border-cyan-500/20",
  },
  {
    title: "FAQ",
    desc: "Quick answers to the questions we hear most often.",
    icon: HelpCircle,
    href: "#faq-block",
    accent: "from-violet-500/30 to-fuchsia-500/20",
    border: "border-violet-500/20",
  },
  {
    title: "Community",
    desc: "Share wins, get feedback, and learn with other candidates.",
    icon: Users,
    href: "/contact",
    accent: "from-emerald-500/30 to-teal-500/20",
    border: "border-emerald-500/20",
  },
] as const;

const ARTICLES = [
  { title: "Starting your first mock interview", tag: "Basics", excerpt: "Resume, JD, and voice — what to prepare in two minutes." },
  { title: "Understanding your score report", tag: "Analytics", excerpt: "How delivery, content, and voice combine into one view." },
  { title: "Behavioral interviews & the STAR method", tag: "Behavioral", excerpt: "Structure answers so reviewers hear clear outcomes." },
  { title: "Privacy & your data", tag: "Trust", excerpt: "What we store, for how long, and how to export or delete." },
];

export default function HelpCenterPage() {
  const reduceMotion = useReducedMotion();
  const [q, setQ] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaq = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (f) =>
        f.question.toLowerCase().includes(s) ||
        f.answer.toLowerCase().includes(s),
    );
  }, [q]);

  const filteredArticles = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ARTICLES;
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.excerpt.toLowerCase().includes(s) ||
        a.tag.toLowerCase().includes(s),
    );
  }, [q]);

  const transition = reduceMotion ? { duration: 0.15 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden pb-24 pt-24 sm:pb-32 sm:pt-28"
      style={{ color: "var(--lp-foreground)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[min(480px,55vh)] w-[min(1100px,100%)] -translate-x-1/2 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.2), transparent 55%)",
          }}
        />
        <svg
          className="absolute left-0 top-24 w-full max-w-4xl opacity-[0.15]"
          viewBox="0 0 800 200"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 120 Q 200 40 400 100 T 800 80"
            stroke="url(#helpLine)"
            strokeWidth="1"
            strokeDasharray="8 12"
          />
          <defs>
            <linearGradient id="helpLine" x1="0" y1="0" x2="800" y2="0">
              <stop stopColor="rgba(59,130,246,0.5)" />
              <stop offset="0.5" stopColor="rgba(34,211,238,0.4)" />
              <stop offset="1" stopColor="rgba(124,58,237,0.35)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-[2] mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div initial="hidden" animate="visible" variants={pageStagger} className="text-center">
          <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-cyan-500/25 hover:text-slate-200"
            >
              ← Back to home
            </Link>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl md:text-[3.15rem] md:leading-[1.12]"
          >
            How can we{" "}
            <span className="relative inline-block">
              <span className="relative z-[1] bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                help you
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-gradient-to-r from-cyan-500/50 to-blue-500/40"
                aria-hidden
              />
            </span>
            ?
          </motion.h1>

          <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-400">
            Search guides and FAQs, or browse topics below — same glass-dark look as the rest of Hirely.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto mt-10 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search help articles and FAQs…"
                className="w-full rounded-2xl border border-white/[0.1] bg-slate-950/60 py-4 pl-12 pr-4 text-[15px] text-slate-100 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)] outline-none backdrop-blur-xl transition placeholder:text-slate-600 focus:border-cyan-400/35 focus:ring-2 focus:ring-cyan-500/15"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-amber-400/90 to-amber-500/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 opacity-90">
                ⌕
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={transition}
          className="mt-16 grid gap-5 sm:grid-cols-3"
        >
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            const inner = (
              <div
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-slate-950/50 p-6 text-left backdrop-blur-xl transition",
                  c.border,
                  "hover:shadow-[0_28px_70px_-32px_rgba(34,211,238,0.18)]",
                )}
              >
                <div
                  className={cn(
                    "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    c.accent,
                  )}
                >
                  <Icon className="h-6 w-6 text-cyan-200/90" />
                </div>
                <h2 className="text-lg font-semibold text-slate-100">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400/90 opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight size={14} />
                </span>
              </div>
            );
            if (c.href.startsWith("#")) {
              return (
                <a key={c.title} href={c.href} className="block rounded-2xl outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-500/50">
                  {inner}
                </a>
              );
            }
            return (
              <Link key={c.title} href={c.href} className="block rounded-2xl outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-500/50">
                {inner}
              </Link>
            );
          })}
        </motion.div>

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.05 }}
          className="mt-20"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="label-caps lp-dim mb-1">Browse</p>
              <h2 className="text-2xl font-bold text-slate-50">Popular articles</h2>
              <p className="mt-1 text-sm text-slate-500">Curated for new and returning candidates.</p>
            </div>
            <Sparkles className="hidden h-8 w-8 text-amber-400/40 sm:block" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredArticles.map((a, i) => (
              <motion.article
                key={a.title}
                initial={reduceMotion ? false : { opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-cyan-500/20"
              >
                <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300/90">
                  {a.tag}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-100">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.excerpt}</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-cyan-400/90 transition hover:text-cyan-300"
                  onClick={() => {
                    document.getElementById("faq-block")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Read in FAQ →
                </button>
              </motion.article>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No articles match “{q}”. Try another keyword.</p>
          )}
        </motion.section>

        <motion.section
          id="faq-block"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mt-24 scroll-mt-28"
        >
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">
              <MessageCircle size={14} />
              FAQ
            </div>
            <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">Getting started</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Everything you need to know before your first session — searchable above.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-slate-950/50 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-cyan-500 to-sky-400" aria-hidden />
            <div className="divide-y divide-white/[0.06] p-2 sm:p-4">
              {filteredFaq.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.question} className="rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition hover:bg-white/[0.03] sm:py-5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/80 to-cyan-600/60 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-[15px] font-semibold text-slate-200">{faq.question}</span>
                      <ChevronDown
                        className={cn("h-5 w-5 shrink-0 text-slate-500 transition", open && "rotate-180 text-cyan-400/80")}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-white/[0.04] px-4 pb-5 pl-[4.5rem] pr-4 text-[14px] leading-relaxed text-slate-400 sm:pl-16">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {filteredFaq.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-500">No FAQs match “{q}”. Clear the search to see all.</p>
            )}
          </div>
        </motion.section>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-950/80 to-violet-600/10 p-8 text-center sm:p-10"
        >
          <h3 className="text-xl font-semibold text-slate-50">Still stuck?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Reach our team — we usually reply within one business day.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(59,130,246,0.55)] transition hover:brightness-110"
          >
            Contact support
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
