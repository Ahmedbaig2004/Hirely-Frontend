"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { getLpGradientAccentStyle } from "./lpGradientAccent";
import { HeroVisual } from "./HeroVisual";

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme !== "dark";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas Background */}
      <HeroVisual />

      {/* Content overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "120px 24px 40px",
          maxWidth: 800,
          width: "100%",
        }}
      >
        {/* Top badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 15px",
              borderRadius: 999,
              background: light
                ? "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(239,246,255,0.95) 100%)"
                : "rgba(59, 130, 246, 0.1)",
              border: light ? "1px solid rgba(37, 99, 235, 0.42)" : "1px solid rgba(59, 130, 246, 0.2)",
              boxShadow: light ? "0 2px 14px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255,255,255,0.95)" : undefined,
              fontSize: 11,
              fontWeight: 800,
              color: light ? "#1d4ed8" : "#93c5fd",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Prototype v0.1
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 15px",
              borderRadius: 999,
              background: light
                ? "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(224,242,254,0.92) 100%)"
                : "rgba(34, 211, 238, 0.08)",
              border: light ? "1px solid rgba(2, 132, 199, 0.45)" : "1px solid rgba(34, 211, 238, 0.18)",
              boxShadow: light ? "0 2px 14px rgba(14, 165, 233, 0.14), inset 0 1px 0 rgba(255,255,255,0.92)" : undefined,
              fontSize: 11,
              fontWeight: 800,
              color: light ? "#0369a1" : "#67e8f9",
              letterSpacing: "0.04em",
            }}
          >
            Resume + JD anchored
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.12,
            color: light ? "#0f172a" : "#f8fafc",
            marginBottom: 24,
            letterSpacing: "-0.02em",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          The room before
          <br />
          <span
            style={
              light
                ? {
                    display: "inline",
                    fontStyle: "italic",
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    backgroundImage:
                      "linear-gradient(118deg, #1d4ed8 0%, #6366f1 38%, #a855f7 62%, #db2777 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }
                : { ...getLpGradientAccentStyle(true) }
            }
          >
            the room.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            fontSize: "clamp(15px, 1.9vw, 18px)",
            color: light ? "#1e293b" : "#94a3b8",
            lineHeight: 1.75,
            maxWidth: 540,
            marginBottom: 40,
            fontWeight: light ? 600 : 400,
            letterSpacing: light ? "-0.01em" : undefined,
            WebkitFontSmoothing: "antialiased",
            ...(light
              ? {
                  textShadow:
                    "0 1px 0 rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.65)",
                }
              : {}),
          }}
        >
          HIRELY generates interview questions from your resume and target
          job description, then walks you through a session that feels like
          the real loop.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 48, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href="/start"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px -10px rgba(59, 130, 246, 0.4)",
              transition: "transform 0.2s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.45), 0 0 60px -10px rgba(59, 130, 246, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px -10px rgba(59, 130, 246, 0.4)";
            }}
          >
            See what a session looks like
          </Link>
          <Link
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "13px 24px",
              borderRadius: 999,
              background: "transparent",
              border: light ? "1px solid rgba(27,38,44,0.2)" : "1px solid rgba(255,255,255,0.12)",
              color: light ? "#1b262c" : "#e2e8f0",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              if (light) {
                e.currentTarget.style.borderColor = "rgba(27,38,44,0.35)";
                e.currentTarget.style.background = "rgba(255,255,255,0.45)";
              } else {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = light ? "rgba(27,38,44,0.2)" : "rgba(255,255,255,0.12)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            View pricing
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "13px 24px",
              borderRadius: 999,
              background: "transparent",
              border: light ? "1px solid rgba(27,38,44,0.2)" : "1px solid rgba(255,255,255,0.12)",
              color: light ? "#1b262c" : "#e2e8f0",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              if (light) {
                e.currentTarget.style.borderColor = "rgba(27,38,44,0.35)";
                e.currentTarget.style.background = "rgba(255,255,255,0.45)";
              } else {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = light ? "rgba(27,38,44,0.2)" : "rgba(255,255,255,0.12)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </motion.div>

        {/* Bottom nav links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Capabilities", href: "#features" },
            { label: "Testimonials", href: "#testimonials" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 13,
                fontWeight: light ? 600 : 500,
                color: light ? "#0f172a" : "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s",
                ...(light
                  ? {
                      textShadow:
                        "0 1px 0 rgba(255, 255, 255, 0.92), 0 0 18px rgba(255, 255, 255, 0.4)",
                    }
                  : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = light ? "#1d4ed8" : "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = light ? "#0f172a" : "#94a3b8";
              }}
            >
              {link.label}
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: light ? "#0f172a" : "#64748b",
            textTransform: "uppercase",
            ...(light
              ? {
                  textShadow:
                    "0 1px 0 rgba(255, 255, 255, 0.95), 0 0 16px rgba(255, 255, 255, 0.45)",
                }
              : {}),
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: 2,
            borderRadius: 1,
            height: 24,
            background: light
              ? "linear-gradient(to bottom, #1e40af, rgba(30, 64, 175, 0.15))"
              : "linear-gradient(to bottom, #64748b, transparent)",
          }}
        />
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, transparent, var(--lp-background))",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </section>
  );
}
