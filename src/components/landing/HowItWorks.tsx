"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LpGradientText } from "./LpGradientText";

/* ─── Shared helpers ─── */
function Waveform({ color = "#3b82f6", bars = 22, height = 36, speed = 1 }: {
  color?: string; bars?: number; height?: number; speed?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2.5, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const dur = (0.5 + Math.random() * 0.7) / speed;
        const delay = Math.random() * 0.6;
        const maxH = 16 + Math.random() * (height - 16);
        return (
          <div key={i} style={{
            width: 3, height: maxH, borderRadius: 2, background: color,
            transformOrigin: "center",
            animation: `lp-wave-bar ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
            opacity: 0.6 + Math.random() * 0.4,
          }} />
        );
      })}
    </div>
  );
}

function CardLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", top: 20, right: 20,
      fontSize: 11, fontWeight: 700, color,
      background: color + "14", borderRadius: 999,
      padding: "2px 9px", letterSpacing: "0.05em",
    }}>{children}</div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color,
    }}>{initials}</div>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: 20, fontWeight: 700, color: "var(--lp-foreground)", marginBottom: 6, marginTop: 0,
};
const descStyle: React.CSSProperties = {
  fontSize: 14, color: "var(--lp-muted-foreground)", lineHeight: 1.6, margin: 0,
};

/* ═══════════════════════════
   CARD 1 — Resume Upload
═══════════════════════════ */
function ResumeUploadCard() {
  const speakers = [
    { initials: "RS", color: "#3b82f6", text: "Skills: React, TypeScript, Node.js, System Design…" },
    { initials: "JD", color: "#a78bfa", text: "Required: AWS, GraphQL, CI/CD, Microservices…" },
  ];
  return (
    <div className="lp-glass-card" style={{ borderRadius: 20, padding: 28, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CardLabel color="#3b82f6">01</CardLabel>
      <h3 style={titleStyle}>Resume Parsing</h3>
      <p style={descStyle}>AI extracts skills, experience, and qualifications from your resume automatically.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {speakers.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--lp-inner-well)", borderRadius: 12,
            padding: "10px 14px", border: "1px solid var(--lp-inner-well-border)",
          }}>
            <Avatar initials={s.initials} color={s.color} />
            {i === 0 ? (
              <Waveform color={s.color} bars={26} height={28} speed={1.1} />
            ) : (
              <span style={{ fontSize: 12, color: "var(--lp-muted-foreground)" }}>{s.text}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: "#34d399",
          animation: "lp-pulse-dot 1.8s ease-in-out infinite",
        }} />
        <span style={{ fontSize: 12, color: "var(--lp-muted-foreground)" }}>Parsing resume…</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CARD 2 — Voice Recording
═══════════════════════════ */
function VoiceRecordingCard() {
  return (
    <div className="lp-glass-card" style={{ borderRadius: 20, padding: 28, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CardLabel color="#22d3ee">02</CardLabel>
      <h3 style={titleStyle}>Voice Recording</h3>
      <p style={descStyle}>Record your answers with real-time voice analysis and confidence scoring.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, justifyContent: "center" }}>
        <Waveform color="#3b82f6" bars={14} height={40} speed={0.9} />
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "var(--lp-inner-well-2)", border: "1px solid rgba(59,130,246,0.14)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 8px rgba(59,130,246,0.06), 0 0 0 16px rgba(59,130,246,0.03)",
          animation: "lp-float 3s ease-in-out infinite",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M19 10a7 7 0 01-14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        </div>
        <Waveform color="#22d3ee" bars={14} height={40} speed={1.2} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(239,68,68,0.08)", borderRadius: 999,
          padding: "4px 12px", border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "lp-pulse-dot 1.2s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#f87171" }}>REC 00:02:14</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CARD 3 — Adaptive Questions
═══════════════════════════ */
const questionPills = [
  { flag: "🧠", text: "System Design…" },
  { flag: "⚡", text: "React Hooks…" },
  { flag: "🔧", text: "REST API design…" },
  { flag: "📊", text: "Data Structures…" },
  { flag: "🎯", text: "Behavioral…" },
  { flag: "💡", text: "Problem solving…" },
  { flag: "🔒", text: "Auth patterns…" },
  { flag: "☁️", text: "Cloud services…" },
];

function AdaptiveQuestionsCard() {
  return (
    <div className="lp-glass-card" style={{ borderRadius: 20, padding: 28, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CardLabel color="#a78bfa">03</CardLabel>
      <h3 style={titleStyle}>Adaptive Questions</h3>
      <p style={descStyle}>Dynamic questions that respond to your answers — stronger responses unlock harder follow-ups.</p>
      <div style={{ marginTop: 16, marginBottom: 14 }}>
        <Waveform color="#a78bfa" bars={30} height={24} speed={0.8} />
      </div>
      <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
        {[questionPills.slice(0, 4), questionPills.slice(4)].map((row, ri) => (
          <div key={ri} style={{ overflow: "hidden" }}>
            <div style={{
              display: "flex", gap: 8,
              animation: `lp-marquee-left ${ri === 0 ? 14 : 18}s linear infinite`,
              width: "max-content",
            }}>
              {[...row, ...row].map((l, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--lp-inner-well)", border: "1px solid var(--lp-inner-well-border)",
                  borderRadius: 10, padding: "6px 12px", whiteSpace: "nowrap",
                }}>
                  <span style={{ fontSize: 14 }}>{l.flag}</span>
                  <span style={{ fontSize: 12, color: "var(--lp-muted-foreground)" }}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CARD 4 — AI Analysis
═══════════════════════════ */
function AIAnalysisCard() {
  const dataPoints = [
    { label: "Technical", val: 87, color: "#38bdf8" },
    { label: "Clarity", val: 92, color: "#3b82f6" },
    { label: "Confidence", val: 78, color: "#818cf8" },
    { label: "Depth", val: 85, color: "#22d3ee" },
  ];

  return (
    <div className="lp-glass-card" style={{ borderRadius: 20, padding: 28, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CardLabel color="#34d399">04</CardLabel>
      <h3 style={titleStyle}>AI Analysis</h3>
      <p style={descStyle}>Deep analysis of technical accuracy, clarity, and confidence across your interview.</p>
      <div style={{
        position: "relative", height: 6, borderRadius: 3,
        background: "var(--lp-inner-track)", overflow: "hidden", marginTop: 18, marginBottom: 20,
      }}>
        <div style={{
          position: "absolute", top: 0, height: "100%", width: "30%",
          background: "linear-gradient(90deg, transparent, #3b82f6, #22d3ee, transparent)",
          animation: "lp-scan-beam 2.2s ease-in-out infinite", borderRadius: 3,
        }} />
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 18 }}>
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px dashed rgba(59,130,246,0.2)",
            animation: "lp-spin-ring 6s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: 10, borderRadius: "50%",
            border: "2px solid rgba(34,211,238,0.35)",
            animation: "lp-spin-ring-rev 4s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: 22, borderRadius: "50%",
            background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 14 }}>🧠</span>
          </div>
          <div style={{ position: "absolute", top: 4, right: 4, width: 10, height: 10, borderRadius: "50%" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "#38bdf8", animation: "lp-ping 1.4s ease-out infinite",
            }} />
            <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: "#38bdf8" }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {dataPoints.map((d, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: "var(--lp-muted-foreground)" }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.val}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "var(--lp-inner-track)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, background: d.color,
                  "--target-w": `${d.val}%`,
                  animation: `lp-fill-bar 1.4s ${i * 0.2}s cubic-bezier(0.4,0,0.2,1) both`,
                } as React.CSSProperties} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--lp-muted-foreground)", display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", animation: "lp-pulse-dot 1.6s infinite" }} />
        Processing complete · 47 insights extracted
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CARD 5 — Summary Report
═══════════════════════════ */
const strengths = [
  { label: "Technical depth", score: 92, color: "#38bdf8" },
  { label: "Problem solving", score: 87, color: "#60a5fa" },
  { label: "Communication", score: 76, color: "#22d3ee" },
];
const weaknesses = [
  { label: "System design", score: 38, color: "#818cf8" },
  { label: "Behavioral answers", score: 44, color: "#a5b4fc" },
];

function AnimatedNumber({ target, visible, style }: { target: number; visible: boolean; style: React.CSSProperties }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return <span style={style}>{val}</span>;
}

function ScoreRow({ label, score, color, visible, delay }: {
  label: string; score: number; color: string; visible: boolean; delay: number;
}) {
  return (
    <div style={{
      marginBottom: 10,
      animation: visible ? `lp-fade-up 0.5s ${delay}ms both` : "none",
      opacity: visible ? undefined : 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "var(--lp-muted-foreground)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{score}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "var(--lp-inner-track)" }}>
        <div style={{
          height: "100%", borderRadius: 3, background: color,
          width: visible ? `${score}%` : "0%",
          transition: `width 1.1s ${delay + 100}ms cubic-bezier(0.4,0,0.2,1)`,
        }} />
      </div>
    </div>
  );
}

function SummaryReportCard() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-glass-card" ref={ref} style={{ borderRadius: 20, padding: 28, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CardLabel color="#fbbf24">05</CardLabel>
      <h3 style={titleStyle}>Performance Report</h3>
      <p style={descStyle}>Strengths and improvement areas distilled from your interview automatically.</p>
      <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#38bdf8" }}>Strengths</span>
          </div>
          {strengths.map((s, i) => (
            <ScoreRow key={i} label={s.label} score={s.score} color={s.color} visible={visible} delay={i * 180} />
          ))}
        </div>
        <div style={{ width: 1, background: "var(--lp-inner-track)", borderRadius: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#818cf8" }}>Needs Work</span>
          </div>
          {weaknesses.map((w, i) => (
            <ScoreRow key={i} label={w.label} score={w.score} color={w.color} visible={visible} delay={300 + i * 180} />
          ))}
          <div style={{
            marginTop: 14, padding: "8px 12px", borderRadius: 10,
            background: "linear-gradient(135deg,rgba(59,130,246,0.07),rgba(34,211,238,0.07))",
            border: "1px solid rgba(59,130,246,0.1)",
            animation: visible ? "lp-fade-up 0.7s 0.8s both" : "none",
            opacity: visible ? undefined : 0,
          }}>
            <div style={{ fontSize: 10, color: "var(--lp-muted-foreground)", marginBottom: 2 }}>Overall Score</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <AnimatedNumber target={78} visible={visible} style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6" }} />
              <span style={{ fontSize: 13, color: "var(--lp-muted-foreground)" }}>/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   HOW IT WORKS SECTION
═══════════════════════════ */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "var(--lp-background)",
        padding: "60px 24px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{
            display: "inline-block", padding: "5px 16px", borderRadius: 999,
            background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.12)",
            fontSize: 12, fontWeight: 600, color: "#3b82f6", marginBottom: 16,
            letterSpacing: "0.06em",
          }}>
            HOW IT WORKS
          </div>
          <h2 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800,
            color: "var(--lp-foreground)", lineHeight: 1.2, marginBottom: 16,
          }}>
            Five steps from{" "}
            <LpGradientText>practice to perfection</LpGradientText>
          </h2>
          <p style={{ fontSize: 16, color: "var(--lp-muted-foreground)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Our AI pipeline parses, questions, records, analyzes, and reports on every interview — automatically.
          </p>
        </motion.div>

        {/* Top row — 3 equal-height cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20, marginBottom: 20,
        }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }} style={{ display: "flex", minWidth: 0 }}>
            <ResumeUploadCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} style={{ display: "flex", minWidth: 0 }}>
            <VoiceRecordingCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ display: "flex", minWidth: 0 }}>
            <AdaptiveQuestionsCard />
          </motion.div>
        </div>
        {/* Bottom row — 2 equal-height cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: "flex" }}>
            <AIAnalysisCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} style={{ display: "flex" }}>
            <SummaryReportCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
