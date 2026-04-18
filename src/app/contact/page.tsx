"use client";

import { useState, useEffect, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { ContactFaqsPanel } from "@/components/contact/ContactFaqsPanel";
import { ContactPromoVideo } from "@/components/contact/ContactPromoVideo";

/** Slow, readable entrance (reference: ~1.2s ease-out) */
const LOAD_DURATION = 1.2;
const LOAD_EASE = [0.16, 1, 0.3, 1] as const;

const INFO_CARDS = [
  {
    title: "Head office",
    value: "Karachi, Pakistan",
    icon: Building2,
  },
  {
    title: "Call us",
    value: "+92 300 0000000",
    icon: Phone,
  },
  {
    title: "Email",
    value: "hello@hirely.ai",
    icon: Mail,
  },
  {
    title: "Working hours",
    value: "Mon – Fri · 9:00 – 18:00",
    icon: Clock,
  },
] as const;

export default function ContactPage() {
  const user = useAuthStore((s) => s.user);
  const [sending, setSending] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const reduceMotion = useReducedMotion();
  const heroStrokeId = `contact-hero-stroke-${useId().replace(/:/g, "")}`;

  const loadTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: LOAD_DURATION, ease: LOAD_EASE };

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata as { full_name?: string } | undefined;
      const full = meta?.full_name ?? "";
      const parts = full.trim().split(/\s+/);
      if (parts.length > 1) {
        setLastName(parts.pop() ?? "");
        setFirstName(parts.join(" "));
      } else {
        setFirstName(full);
      }
      setEmail(user.email ?? "");
    }
  }, [user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    }, 1500);
  };

  const inputCls =
    "mt-1.5 block w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 shadow-sm backdrop-blur-sm transition placeholder:text-slate-500 focus:border-cyan-400/35 focus:outline-none focus:ring-2 focus:ring-cyan-500/15";

  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <div className="relative z-[2] mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28 sm:pb-28">
        <div className="relative flex flex-col items-stretch">
          {/* Background atmosphere */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[min(520px,70vh)] w-[min(1100px,100vw)] -translate-x-1/2 overflow-visible"
            aria-hidden
          >
            <div
              className="absolute left-[8%] top-[12%] h-[280px] w-[280px] rounded-full opacity-[0.35] blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.35), transparent 62%)",
              }}
            />
            <div
              className="absolute right-[6%] top-[22%] h-[320px] w-[320px] rounded-full opacity-[0.3] blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle at 70% 40%, rgba(139, 92, 246, 0.38), transparent 58%)",
              }}
            />
            <svg
              className="absolute left-1/2 top-[10%] w-[min(720px,92vw)] -translate-x-1/2 opacity-[0.28]"
              viewBox="0 0 720 120"
              fill="none"
              aria-hidden
            >
              <path
                d="M0 96 C 120 24, 200 104, 360 56 S 560 8, 720 88"
                stroke={`url(#${heroStrokeId})`}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeDasharray="6 10"
              />
              <defs>
                <linearGradient id={heroStrokeId} x1="0" y1="0" x2="720" y2="0">
                  <stop stopColor="rgba(34,211,238,0.45)" />
                  <stop offset="0.5" stopColor="rgba(139,92,246,0.4)" />
                  <stop offset="1" stopColor="rgba(59,130,246,0.35)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Two-column contact block (reference: left info + right form) */}
          <div className="relative z-[2] grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-16">
            {/* Left: slides in from the right (starts off-screen right → settles left) */}
            <motion.div
              className="order-1 flex flex-col lg:order-1"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={loadTransition}
            >
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                <Phone className="h-3.5 w-3.5 opacity-90" aria-hidden />
                Contact us
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Get in touch
                </span>{" "}
                <span className="text-slate-100">with our team</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-400">
                Fill out the form and we&apos;ll get back to you within 1–2 business days.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {INFO_CARDS.map(({ title, value, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-cyan-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
                        <div className="mt-0.5 text-sm font-medium text-slate-200">{value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: form slides up from below */}
            <motion.div
              className="order-2 lg:order-2"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 140 }}
              animate={{ opacity: 1, y: 0 }}
              transition={loadTransition}
            >
              <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-slate-950/50 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                <div
                  className="h-2 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400"
                  aria-hidden
                />
                <div className="bg-gradient-to-b from-slate-900/40 to-slate-950/80 p-6 sm:p-8">
                  <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Send a message
                  </p>
                  <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          First name
                        </label>
                        <input
                          required
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                          className={inputCls}
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Last name
                        </label>
                        <input
                          required
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter last name"
                          className={inputCls}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Work email
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className={inputCls}
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Phone <span className="font-normal text-slate-500">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 · · · · · · · · · ·"
                          className={inputCls}
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</label>
                      <input
                        required
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="How can we help?"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us more..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="h-12 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-[0_10px_36px_-10px_rgba(59,130,246,0.55)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                    >
                      {sending ? (
                        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Promo loop + FAQ — side by side on large screens */}
          <motion.div
            id="faq"
            className="relative z-[2] mt-16 w-full scroll-mt-28 lg:mt-24"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px", amount: 0.1 }}
            transition={reduceMotion ? { duration: 0.2 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
              <div className="order-2 flex min-h-0 flex-col lg:order-1">
                <ContactPromoVideo />
              </div>
              <div className="order-1 min-h-0 lg:order-2">
                <ContactFaqsPanel />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
