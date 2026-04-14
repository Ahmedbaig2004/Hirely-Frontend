"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import FloatingShapes from "@/components/ui/FloatingShapes";
import { fadeInUp, cardPop, staggerSpring } from "@/lib/motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const timeline = [
  {
    step: "01",
    title: "Upload & Parse",
    desc: "Upload your resume and job description. Our AI instantly extracts skills, experience, and qualifications.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Interview",
    desc: "Engage in a realistic adaptive interview. Questions are generated based on your profile and target role.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Speech Analysis",
    desc: "Real-time vocal analysis — pitch, pauses, filler words — to build confidence and fluency.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Detailed Report",
    desc: "Comprehensive scores, strengths, weaknesses, and actionable suggestions for your next interview.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const pillars = [
  {
    title: "AI-First Approach",
    desc: "Every feature is powered by advanced models trained on thousands of real interview patterns.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Personalized Practice",
    desc: "Questions are generated from your actual resume and target job — not generic templates.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-400",
  },
  {
    title: "Holistic Evaluation",
    desc: "We assess technical skills, communication, confidence, and problem-solving — not just answers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    title: "Actionable Insights",
    desc: "Every report includes specific, prioritized tips — not vague feedback — so you improve each session.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    gradient: "from-orange-500 to-amber-400",
  },
];

const modules = [
  { name: "AI Engine", initials: "AI", role: "Adaptive Question Generation", color: "from-blue-500 to-cyan-400" },
  { name: "NLP Core", initials: "NL", role: "Resume Parsing & Analysis", color: "from-indigo-500 to-blue-400" },
  { name: "Speech AI", initials: "SA", role: "Voice & Confidence Analysis", color: "from-violet-500 to-indigo-400" },
  { name: "Report Gen", initials: "RG", role: "Score Calculation & Feedback", color: "from-cyan-500 to-teal-400" },
];

const stats = [
  { value: "10K+", label: "Interviews Conducted" },
  { value: "95%", label: "User Satisfaction" },
  { value: "4.8", label: "Average Rating" },
  { value: "50+", label: "Countries Served" },
];

export default function AboutPage() {
  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden"
      style={{
        background: "var(--lp-background)",
        color: "var(--lp-foreground)",
      }}
    >
      <Navbar />

      <main className="relative z-10 flex flex-col pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <FloatingShapes />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">About Hirely</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Interview Prep, <span className="gradient-text">Reimagined with AI</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                HIRELY is an AI-powered mock interview platform that generates personalised questions from your resume,
                evaluates your answers in real time, and delivers comprehensive performance reports.
              </p>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerSpring}
            className="relative mx-auto mt-14 max-w-3xl px-4"
          >
            <div className="glass-card grid grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} custom={i} variants={cardPop} className="text-center">
                  <div className="gradient-text text-2xl font-extrabold">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Visual feature showcase */}
        <SectionWrapper className="py-16">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Our Core Pillars
          </motion.h2>
          <motion.div
            variants={staggerSpring}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-5 sm:grid-cols-2"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i}
                variants={cardPop}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="glass-card group rounded-2xl p-6"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  {p.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* Timeline */}
        <SectionWrapper className="relative overflow-hidden py-16">
          <FloatingShapes />
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            How the Platform Works
          </motion.h2>
          <div className="relative mt-12 space-y-6 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-primary before:to-primary-light">
            {timeline.map((t, i) => (
              <motion.div
                key={t.step}
                custom={i}
                variants={cardPop}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-8 top-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-light shadow-[0_0_24px_rgba(59,130,246,0.28)]">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">{t.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step {t.step}</span>
                      <h3 className="text-base font-semibold">{t.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Tech modules */}
        <SectionWrapper className="py-16 sm:py-20">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Powered by Advanced AI
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-lg text-center text-muted-foreground"
          >
            Four specialised AI modules working together for a comprehensive experience.
          </motion.p>
          <motion.div
            variants={staggerSpring}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {modules.map((m, i) => (
              <motion.div
                key={m.name}
                custom={i}
                variants={cardPop}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${m.color} text-sm font-bold text-white shadow-lg`}
                >
                  {m.initials}
                </div>
                <h3 className="mt-4 text-sm font-semibold">{m.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* Mission visual */}
        <SectionWrapper className="overflow-hidden py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our Mission</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Making Interview Prep <span className="gradient-text">Accessible to Everyone</span>
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                We believe everyone deserves the chance to practice and improve before the big day. HIRELY democratizes
                interview coaching by making AI-powered practice affordable and available 24/7.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {["AR", "SL", "MK", "TP", "JD"].map((init, i) => (
                    <div
                      key={i}
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary-light text-[10px] font-bold text-white"
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Trusted by <span className="font-semibold text-foreground">10,000+</span> candidates
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
              <div className="glass-card space-y-4 rounded-2xl p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Live Platform Preview</div>
                {[
                  { label: "Resume parsed", status: "done" as const },
                  { label: "Questions generated (5/5)", status: "done" as const },
                  { label: "Interview session active", status: "active" as const },
                  { label: "Report generating...", status: "pending" as const },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    {item.status === "done" ? (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-success/10 text-success">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : item.status === "active" ? (
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="absolute h-4 w-4 animate-ping rounded-full bg-primary/20" />
                        <span className="h-3 w-3 rounded-full bg-primary" />
                      </span>
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </span>
                    )}
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
