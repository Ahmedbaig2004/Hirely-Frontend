"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const testimonials = [
  {
    text: "The real-time feedback during mock sessions was chillingly accurate. It identified my 'ums' and posture issues I never noticed.",
    name: "Marcus Thorne",
    role: "Software Engineer at Google",
    initials: "MT",
    color: "#3b82f6",
    rating: 5,
  },
  {
    text: "HIRELY's AI gave me questions I genuinely felt confident to handle the unexpected. I nailed my dream role at Google after 2 weeks.",
    name: "Janet Lemoine",
    role: "Product Manager",
    initials: "JL",
    color: "#a78bfa",
    rating: 5,
  },
  {
    text: "I was skeptical about AI coaching, but the analytics dashboard showed exactly where I needed to improve. Total game changer.",
    name: "Priya Patel",
    role: "Data Scientist at Meta",
    initials: "PP",
    color: "#22d3ee",
    rating: 5,
  },
  {
    text: "Used HIRELY for a week before my final round. The behavioral question practice was incredibly helpful for landing the offer.",
    name: "Michael Chen",
    role: "AI Researcher",
    initials: "MC",
    color: "#34d399",
    rating: 5,
  },
  {
    text: "The confidence scoring alone was worth it. I could see my improvement session over session. Best interview prep tool out there.",
    name: "Sara Williams",
    role: "Frontend Developer at Stripe",
    initials: "SW",
    color: "#f97316",
    rating: 5,
  },
  {
    text: "I practiced with HIRELY daily for two weeks. The adaptive questions kept pushing me. Got offers from 3 out of 4 companies.",
    name: "David Kim",
    role: "Senior Engineer at Amazon",
    initials: "DK",
    color: "#f472b6",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="#fbbf24">
          <path d="M10 1l2.2 6.8H19l-5.5 4 2.1 6.8L10 14.5 4.4 18.6l2.1-6.8L1 7.8h6.8L10 1z" />
        </svg>
      ))}
    </div>
  );
}

/** Spinning orbital rings + bubbles — inside the circle reveal.
 *  Wrapper keeps translate(-50%,-50%); inner node runs rotate animation so keyframes don't wipe centering. */
function TestimonialOrbitalDecor() {
  const hub = {
    position: "absolute" as const,
    top: "38%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none" as const,
  };

  return (
    <>
      <div style={hub}>
        <div
          style={{
            position: "relative",
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1px solid rgba(34, 211, 238, 0.08)",
            animation: "lp-spin-ring 50s linear infinite",
          }}
        >
          {[0, 90, 180, 270].map((deg, i) => (
            <div
              key={`outer-${i}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ["#22d3ee", "#a78bfa", "#3b82f6", "#34d399"][i],
                transform: `rotate(${deg}deg) translate(260px) rotate(-${deg}deg)`,
                opacity: 0.35,
                boxShadow: `0 0 10px ${["#22d3ee", "#a78bfa", "#3b82f6", "#34d399"][i]}50`,
              }}
            />
          ))}
        </div>
      </div>

      <div style={hub}>
        <div
          style={{
            position: "relative",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1.5px dashed rgba(34, 211, 238, 0.18)",
            animation: "lp-spin-ring 30s linear infinite",
            boxShadow: "0 0 40px rgba(34, 211, 238, 0.04), inset 0 0 40px rgba(59, 130, 246, 0.03)",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const colors = ["#3b82f6", "#22d3ee", "#a78bfa", "#34d399", "#22d3ee", "#a78bfa"];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: colors[i],
                  transform: `rotate(${deg}deg) translate(200px) rotate(-${deg}deg)`,
                  opacity: 0.7,
                  boxShadow: `0 0 14px ${colors[i]}80, 0 0 30px ${colors[i]}30`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={hub}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22d3ee",
            opacity: 0.5,
            boxShadow: "0 0 20px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.15)",
          }}
        />
      </div>
    </>
  );
}

function TestimonialCard({
  testimonial,
  index,
  revealed,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
  revealed: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay: 0.45 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="lp-glass-card"
        style={{
          borderRadius: 16,
          padding: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 32, color: "rgba(59,130,246,0.3)", lineHeight: 1, marginBottom: 8 }}>
          &#x201C;&#x201C;
        </div>

        <Stars count={testimonial.rating} />

        <p
          style={{
            fontSize: 14,
            color: "var(--lp-muted-foreground)",
            lineHeight: 1.7,
            marginTop: 12,
            flex: 1,
          }}
        >
          &ldquo;{testimonial.text}&rdquo;
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: testimonial.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {testimonial.initials}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--lp-foreground)" }}>{testimonial.name}</div>
            <div style={{ fontSize: 11, color: "var(--lp-muted-foreground)" }}>{testimonial.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const [circleOpen, setCircleOpen] = useState(false);
  const [clipDone, setClipDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      setCircleOpen(true);
      setClipDone(true);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const applyEntry = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setCircleOpen(true);
      } else {
        setCircleOpen(false);
        setClipDone(false);
      }
    };

    const io = new IntersectionObserver(([entry]) => applyEntry(entry), {
      threshold: [0, 0.05, 0.1, 0.15],
      rootMargin: "0px 0px 12% 0px",
    });
    io.observe(el);

    const syncIfVisible = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const intersects = r.top < vh && r.bottom > 0;
      if (intersects) {
        setCircleOpen(true);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(syncIfVisible));

    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <div style={{ position: "relative", zIndex: 50 }}>
      <section
        id="testimonials"
        ref={sectionRef}
        className="scroll-mt-24"
        style={{
          background: "linear-gradient(180deg, #111827 0%, #152030 100%)",
          padding: "48px 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className={
            reduceMotion
              ? "relative overflow-hidden"
              : `circle-reveal relative overflow-hidden ${circleOpen ? "active" : ""}`
          }
          style={{
            background: "linear-gradient(180deg, #162035 0%, #142030 50%, #111827 100%)",
            padding: "72px 24px 96px",
            minHeight: !reduceMotion && circleOpen && !clipDone ? "min(85vh, 820px)" : undefined,
          }}
          onTransitionEnd={(e) => {
            if (!reduceMotion && e.propertyName === "clip-path" && circleOpen) setClipDone(true);
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 70% 45% at 50% 32%, rgba(59, 130, 246, 0.07), transparent 55%)",
              pointerEvents: "none",
            }}
          />

          <TestimonialOrbitalDecor />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <motion.div
              initial={false}
              animate={circleOpen ? { opacity: 1, y: 0 } : { opacity: 0.08, y: 12 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 }}
              style={{ textAlign: "center", marginBottom: 48 }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#a78bfa",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Community
              </span>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  color: "#e2e8f0",
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Voice of the <span className="lp-gradient-text">Community</span>
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#94a3b8",
                  maxWidth: 520,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Real feedback from real candidates who landed their dream roles.
              </p>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.name} testimonial={t} index={i} revealed={circleOpen} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
