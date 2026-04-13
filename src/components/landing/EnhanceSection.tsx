"use client";

import { motion } from "framer-motion";

/* ─── Waveform Animation ─── */
function Waveform({ color = "#3b82f6", bars = 22, height = 36, speed = 1 }: {
  color?: string; bars?: number; height?: number; speed?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2.5, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const dur = (0.5 + Math.random() * 0.7) / speed;
        const delay = Math.random() * 0.6;
        const maxH = 20 + Math.random() * (height - 20);
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: maxH,
              borderRadius: 2,
              background: color,
              transformOrigin: "center",
              animation: `lp-wave-bar ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Transcription Card (compact for inside-monitor view) ─── */
function TranscriptionCard() {
  const speakers = [
    { initials: "AI", color: "#3b82f6", isWaveform: true, text: "" },
    { initials: "YU", color: "#a78bfa", isWaveform: false, text: "I used React.memo and useMemo to optimize the heavy render cycle that was causing lag.." },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: "rgba(59,130,246,0.1)",
        border: "1px solid rgba(59,130,246,0.15)",
        fontSize: 10,
        fontWeight: 600,
        color: "#3b82f6",
        marginBottom: 10,
      }}>
        Real-time
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
        Transcription
      </h4>
      <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, marginBottom: 14 }}>
        Easily convert live or recorded speech into text with just one click.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {speakers.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              padding: "8px 10px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
              background: `${s.color}22`, border: `1.5px solid ${s.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: s.color,
            }}>
              {s.initials}
            </div>
            {s.isWaveform ? (
              <>
                <Waveform color={s.color} bars={20} height={22} speed={1.1} />
                <div style={{
                  marginLeft: "auto", width: 18, height: 18, borderRadius: "50%",
                  background: "linear-gradient(135deg,#a78bfa,#3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: 8 }}>↓</span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{s.text}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", background: "#34d399",
          animation: "lp-pulse-dot 1.8s ease-in-out infinite",
        }} />
        <span style={{ fontSize: 10, color: "#94a3b8" }}>Live transcribing…</span>
      </div>
    </div>
  );
}

/* ─── Recording Card (compact for inside-monitor view) ─── */
function RecordingCard() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: "rgba(34,211,238,0.1)",
        border: "1px solid rgba(34,211,238,0.15)",
        fontSize: 10,
        fontWeight: 600,
        color: "#22d3ee",
        marginBottom: 10,
      }}>
        Voice Capture
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
        Recording
      </h4>
      <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, marginBottom: 14 }}>
        Capture and record your interview sessions from anywhere with ease.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <Waveform color="#3b82f6" bars={12} height={32} speed={0.9} />
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(59,130,246,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 6px rgba(59,130,246,0.06), 0 0 0 12px rgba(59,130,246,0.03)",
          animation: "lp-float 3s ease-in-out infinite",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M19 10a7 7 0 01-14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        </div>
        <Waveform color="#22d3ee" bars={12} height={32} speed={1.2} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(239,68,68,0.08)", borderRadius: 999,
          padding: "3px 10px", border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "lp-pulse-dot 1.2s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#f87171" }}>REC 00:04:37</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PC Monitor Mockup with cards inside ─── */
function MonitorMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1200px" }}
    >
      <div style={{
        animation: "lp-float 8s ease-in-out infinite",
      }}>
        {/* Monitor frame */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px 16px 0 0",
            padding: 3,
            position: "relative",
            animation: "lp-screen-glow 4s ease-in-out infinite",
          }}
        >
          {/* Light sweep */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
            <div style={{
              position: "absolute",
              top: 0,
              width: "30%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
              animation: "lp-light-sweep 4s ease-in-out infinite",
            }} />
          </div>

          {/* Browser chrome bar */}
          <div style={{
            background: "rgba(20, 26, 38, 0.95)",
            borderRadius: "13px 13px 0 0",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fbbf24" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#34d399" }} />
            </div>
            <div style={{ flex: 1, marginLeft: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.02em" }}>
                HIRELY — Interview Tools
              </span>
            </div>
          </div>

          {/* Screen content — two cards side by side */}
          <div style={{
            background: "linear-gradient(180deg, #141c2e, #1a2340)",
            borderRadius: "0 0 13px 13px",
            display: "flex",
            minHeight: 320,
          }}>
            {/* Transcription card (left half) */}
            <div style={{
              flex: 1,
              borderRight: "1px solid rgba(255,255,255,0.05)",
            }}>
              <TranscriptionCard />
            </div>
            {/* Recording card (right half) */}
            <div style={{ flex: 1 }}>
              <RecordingCard />
            </div>
          </div>
        </div>

        {/* Monitor stand */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: -1 }}>
          <div style={{
            width: 70,
            height: 22,
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            borderRadius: "0 0 4px 4px",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 130,
            height: 4,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 2,
          }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════
   ENHANCE SECTION
═══════════════════════════ */
export function EnhanceSection() {
  return (
    <section
      style={{
        background: "var(--lp-background)",
        padding: "60px 24px",
        position: "relative",
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 56,
        flexWrap: "wrap",
      }}>
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ flex: "1 1 360px", minWidth: 280 }}
        >
          <div style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: 999,
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.12)",
            fontSize: 12,
            fontWeight: 600,
            color: "#a78bfa",
            marginBottom: 20,
            letterSpacing: "0.06em",
          }}>
            START EFFORTLESSLY
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            color: "var(--lp-foreground)",
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Enhance interview{" "}
            <span className="lp-gradient-text">productivity</span>
          </h2>
          <p style={{
            fontSize: 16,
            color: "var(--lp-muted-foreground)",
            lineHeight: 1.7,
            maxWidth: 440,
          }}>
            Capture every word, analyze every response, and get feedback in real
            time.
          </p>
        </motion.div>

        {/* Right: Monitor with cards inside */}
        <div style={{ flex: "1 1 520px", minWidth: 340, maxWidth: 640 }}>
          <MonitorMockup />
        </div>
      </div>
    </section>
  );
}
