"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AboutHudLayer } from "@/components/about/AboutHudLayer";
import { fadeInUp, staggerSpring, cardPop } from "@/lib/motion";
import {
  ArrowRight,
  Brain,
  Cpu,
  LineChart,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const timeline = [
  {
    step: "01",
    title: "Upload & Parse",
    desc: "Upload your resume and job description. Our AI extracts skills, experience, and role fit in seconds.",
  },
  {
    step: "02",
    title: "AI Interview",
    desc: "Adaptive questions tailored to your profile — not generic templates — in a realistic voice experience.",
  },
  {
    step: "03",
    title: "Speech Analysis",
    desc: "Real-time vocal cues: pace, fillers, and confidence signals you can improve session by session.",
  },
  {
    step: "04",
    title: "Detailed Report",
    desc: "Scores, strengths, gaps, and next steps — prioritized so you always know what to practice next.",
  },
];

const pillars = [
  {
    title: "AI-First Approach",
    desc: "Models trained on real interview patterns — structure, depth, and follow-ups that feel human.",
    icon: Brain,
    accent: "from-sky-500 to-cyan-400",
    border: "border-cyan-500/40 dark:border-cyan-500/20",
  },
  {
    title: "Personalized Practice",
    desc: "Every question references your resume and target role — relevance over random drills.",
    icon: Users,
    accent: "from-violet-500 to-fuchsia-400",
    border: "border-violet-500/40 dark:border-violet-500/20",
  },
  {
    title: "Holistic Evaluation",
    desc: "Technical depth, communication, and presence — scored together, not in isolation.",
    icon: LineChart,
    accent: "from-emerald-500 to-teal-400",
    border: "border-emerald-500/40 dark:border-emerald-500/20",
  },
  {
    title: "Actionable Insights",
    desc: "Concrete next steps after every session — not vague “try harder” feedback.",
    icon: Zap,
    accent: "from-amber-500 to-orange-400",
    border: "border-amber-500/40 dark:border-amber-500/20",
  },
];

const modules = [
  { name: "AI Engine", initials: "AE", role: "Adaptive question generation", color: "from-blue-500 to-cyan-400" },
  { name: "NLP Core", initials: "NL", role: "Resume parsing & role fit", color: "from-indigo-500 to-blue-400" },
  { name: "Speech AI", initials: "SA", role: "Voice & delivery signals", color: "from-violet-500 to-indigo-400" },
  { name: "Report Gen", initials: "RG", role: "Scoring & narrative feedback", color: "from-cyan-500 to-teal-400" },
];

const stats = [
  { value: "10K+", label: "Interviews conducted" },
  { value: "95%", label: "User satisfaction" },
  { value: "4.8", label: "Average rating" },
  { value: "50+", label: "Countries served" },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const },
  },
};

export default function AboutPage() {
  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <main className="relative z-10 flex flex-col">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
          <AboutHudLayer />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              <motion.p
                variants={fade}
                className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-400/95"
              >
                About Hirely
              </motion.p>
              <motion.h1
                variants={fade}
                className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-[3.15rem] dark:text-slate-50"
              >
                Interview prep,{" "}
                <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-800 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500">
                  reimagined with AI
                </span>
              </motion.h1>
              <motion.p
                variants={fade}
                className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400"
              >
                HIRELY is your AI mock interviewer — it reads your resume and job description, runs adaptive sessions,
                and returns reports that tell you exactly what to improve before the real conversation.
              </motion.p>
              <motion.div variants={fade} className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                >
                  Start practicing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-full border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:border-cyan-600/40 hover:bg-[var(--lp-inner-well)] dark:border-white/15 dark:bg-white/5 dark:font-medium dark:text-slate-200 dark:shadow-none dark:hover:border-cyan-500/40 dark:hover:bg-white/[0.07]"
                >
                  View pricing
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-500/20 md:h-40 md:w-40" aria-hidden />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] shadow-[0_24px_80px_-32px_rgba(15,23,42,0.15)] ring-1 ring-cyan-500/20 backdrop-blur-xl dark:border-white/[0.08] dark:bg-slate-950 dark:shadow-[0_24px_80px_-24px_rgba(34,211,238,0.45)] dark:ring-cyan-500/15 dark:backdrop-blur-none">
                <Image
                  src="/about/collab-desk.png"
                  alt="Human professional and AI collaborator in a modern workspace"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent dark:from-[#0b0f19] dark:via-[#0b0f19]/20" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100 dark:text-cyan-200/90">
                    Partnership, not replacement
                  </p>
                  <p className="mt-1 text-xs leading-snug text-slate-200 dark:text-slate-400">
                    Practice with AI that adapts to you — so you walk into every interview prepared.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerSpring}
            className="relative mx-auto mt-16 max-w-5xl px-4"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] shadow-2xl shadow-slate-400/15 backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-2xl sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={cardPop}
                  className="relative px-4 py-6 text-center sm:px-6"
                >
                  <div className="bg-gradient-to-br from-cyan-300 to-blue-500 bg-clip-text text-2xl font-black tabular-nums text-transparent sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Core pillars ── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-[2.35rem] dark:text-slate-50">
                Our core pillars
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Four principles that shape every feature we ship — from models to microphone to report.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerSpring}
              className="mt-14 grid gap-5 sm:grid-cols-2"
            >
              {pillars.map((p, i) => (
                <motion.article
                  key={p.title}
                  custom={i}
                  variants={cardPop}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={`group relative overflow-hidden rounded-2xl border ${p.border} bg-gradient-to-br from-white/95 to-slate-50/80 p-6 shadow-lg shadow-slate-400/12 dark:from-white/[0.04] dark:to-transparent dark:shadow-lg`}
                >
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-lg`}
                  >
                    <p.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.desc}</p>
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Innovation: human × AI (your image) ── */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-600/30 bg-cyan-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-900 dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Innovation
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl dark:text-slate-50">
                  Where human insight meets machine precision
                </h2>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  We design HIRELY as a bridge: you bring context and ambition — our models bring scale, consistency,
                  and feedback you can act on the same day. No black box — every session explains what moved your score.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-cyan-500/20 shadow-[0_0_60px_-20px_rgba(34,211,238,0.4)]"
              >
                <Image
                  src="/about/innovation-touch.png"
                  alt="Human and AI reaching toward a shared point of light — collaboration"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19]/90 via-transparent to-[#0b0f19]/40" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Timeline (≈1.25× scale vs previous) ── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-[60rem] px-4">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center text-[2.375rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.75rem] md:text-[3rem] dark:text-slate-50"
            >
              How the platform works
            </motion.h2>
            <div className="relative mt-[4.375rem] space-y-[1.875rem] pl-10 before:absolute before:left-4 before:top-[0.9375rem] before:h-[calc(100%-2.5rem)] before:w-px before:bg-gradient-to-b before:from-cyan-400/80 before:via-cyan-500/40 before:to-blue-600/30">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.step}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="relative"
                >
                  <div className="absolute -left-10 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/50 bg-white shadow-[0_0_20px_rgba(34,211,238,0.25)] dark:border-cyan-400/40 dark:bg-[#0b0f19] dark:shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.7)] dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  </div>
                  <div className="rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-6 shadow-md shadow-slate-400/10 backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-none dark:backdrop-blur-none">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                      Step {t.step}
                    </span>
                    <h3 className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-slate-100">{t.title}</h3>
                    <p className="mt-2.5 text-base leading-relaxed text-slate-600 dark:text-slate-400">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI modules ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl dark:text-slate-50">
                Powered by advanced AI
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-400">
                Four specialised modules orchestrate every session — from parsing your CV to narrating your report.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerSpring}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {modules.map((m, i) => (
                <motion.div
                  key={m.name}
                  custom={i}
                  variants={cardPop}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-6 text-center shadow-md shadow-slate-400/10 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] dark:shadow-none dark:backdrop-blur-none"
                >
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-sm font-bold text-white shadow-lg`}
                  >
                    {m.initials}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{m.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">{m.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Mission + live platform review ── */}
        <section className="relative pb-24 pt-8 md:pb-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-0">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="flex max-w-xl flex-col justify-center lg:max-w-none"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-800 dark:text-cyan-400/90">
                  Our mission
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
                  Making interview prep{" "}
                  <span className="bg-gradient-to-r from-cyan-700 to-blue-800 bg-clip-text text-transparent dark:from-cyan-300 dark:to-blue-500">
                    accessible to everyone
                  </span>
                </h2>
                <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
                  Great coaching shouldn&apos;t depend on geography or budget. HIRELY puts structured, AI-led practice in
                  your browser — so you rehearse on your schedule and walk in with confidence.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex -space-x-2">
                    {["AR", "SL", "MK", "TP", "JD"].map((init, i) => (
                      <div
                        key={init}
                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#0b0f19] bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white"
                        style={{ zIndex: 5 - i }}
                      >
                        {init}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Trusted by{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-200">10,000+</span> candidates worldwide
                  </p>
                </div>
              </motion.div>

              <div className="flex w-full justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="w-full max-w-md rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-6 shadow-xl shadow-cyan-900/10 backdrop-blur-xl dark:border-cyan-500/20 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/90 dark:to-slate-950/95 dark:shadow-black/25 dark:backdrop-blur-none lg:max-w-none"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5 dark:border-white/5">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                      Live platform review
                    </span>
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  </div>
                  <ul className="mt-4 space-y-3.5">
                    {(
                      [
                        { label: "Resume parsed", status: "done" as const },
                        { label: "Questions generated (7/7)", status: "done" as const },
                        { label: "Interview session active", status: "active" as const },
                        { label: "Report generating…", status: "pending" as const },
                      ] as const
                    ).map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border border-[var(--lp-inner-well-border)] bg-[var(--lp-inner-well)] px-3.5 py-3 text-[0.9375rem] font-medium leading-snug text-slate-800 shadow-sm backdrop-blur-md dark:border-white/[0.06] dark:bg-white/[0.03] dark:font-normal dark:text-slate-300 dark:shadow-none dark:backdrop-blur-none"
                      >
                        {item.status === "done" ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <Cpu className="h-3.5 w-3.5" />
                          </span>
                        ) : item.status === "active" ? (
                          <span className="relative flex h-6 w-6 items-center justify-center">
                            <span className="absolute h-4 w-4 animate-ping rounded-full bg-cyan-500/35 dark:bg-cyan-400/30" />
                            <span className="relative h-3 w-3 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-500">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </span>
                        )}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
