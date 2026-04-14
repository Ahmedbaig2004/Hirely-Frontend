"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { fadeInUp, pageStagger, cardPop, staggerSpring } from "@/lib/motion";
import { useAuthStore } from "@/stores/useAuthStore";
import FloatingShapes from "@/components/ui/FloatingShapes";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ContactPage() {
  const user = useAuthStore((s) => s.user);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata as { full_name?: string } | undefined;
      setName(meta?.full_name ?? "");
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
    "mt-1.5 block w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm shadow-sm backdrop-blur transition placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/35";

  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden"
      style={{
        background: "var(--lp-background)",
        color: "var(--lp-foreground)",
      }}
    >
      <Navbar />

      <div className="relative mx-auto max-w-2xl px-4 pb-24 pt-28 sm:py-28">
        <FloatingShapes />
        <motion.div initial="hidden" animate="visible" variants={pageStagger} className="relative z-0">
          <motion.div variants={fadeInUp} className="space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Contact Us</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <motion.form variants={fadeInUp} onSubmit={submit} className="glass-card mt-12 space-y-5 rounded-2xl p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
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
              <label className="text-sm font-medium">Message</label>
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
              className="h-12 w-full rounded-full bg-gradient-to-r from-primary to-primary-light text-sm font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.22)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {sending ? (
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Send Message"
              )}
            </button>
          </motion.form>

          <motion.div
            variants={staggerSpring}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {[
              {
                label: "Email",
                value: "hello@hirely.ai",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                label: "Location",
                value: "Karachi, Pakistan",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
              {
                label: "Response time",
                value: "Within 24 hours",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                custom={i}
                variants={cardPop}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="glass-card rounded-xl p-5 text-center"
              >
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">{c.icon}</div>
                <div className="mt-3 text-xs text-muted-foreground">{c.label}</div>
                <div className="mt-0.5 text-sm font-semibold">{c.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
