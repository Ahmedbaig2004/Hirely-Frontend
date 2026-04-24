"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "/contact#faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "Settings", href: "/settings" },
    { label: "Documentation", href: "/help#getting-started" },
    { label: "Interview Tips", href: "/help" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const light = mounted && resolvedTheme === "light";

  const bg = light ? "#f2f9ff" : "#0d1220";
  const borderTop = light ? "1px solid rgba(209,233,255,0.95)" : "1px solid rgba(255,255,255,0.04)";
  const brandColor = light ? "#1b262c" : "#e2e8f0";
  const bodyMuted = light ? "rgba(57,72,103,0.82)" : "#64748b";
  const headingColor = light ? "#1b262c" : "#e2e8f0";
  const linkColor = light ? "rgba(30,41,59,0.92)" : "#64748b";
  const linkHover = light ? "#1d4ed8" : "#e2e8f0";
  const logoGrad = light ? "linear-gradient(135deg, #7eb8ff, #5eb8c4)" : "linear-gradient(135deg, #2563eb, #3b82f6)";
  const iconStroke = light ? "#394867" : "#94a3b8";
  const socialBg = light ? "var(--lp-inner-well)" : "rgba(255,255,255,0.04)";
  const socialBorder = light ? "1px solid var(--lp-inner-well-border)" : "1px solid rgba(255,255,255,0.06)";
  const bottomText = light ? "rgba(51,65,85,0.72)" : "#475569";
  const dividerGrad = light
    ? "linear-gradient(90deg, transparent, rgba(209,233,255,0.9), transparent)"
    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)";

  return (
    <footer
      className="relative z-[60] isolate"
      style={{
        background: bg,
        borderTop,
        padding: "64px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div style={{ flex: "1 1 280px", minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: logoGrad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: brandColor,
                  letterSpacing: "0.04em",
                }}
              >
                HIRELY
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: bodyMuted,
                lineHeight: 1.7,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              AI-powered mock interview platform that helps you practice,
              improve, and land your dream job.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                {
                  label: "Twitter",
                  path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                },
                {
                  label: "GitHub",
                  path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
                },
                {
                  label: "LinkedIn",
                  path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: socialBg,
                    border: socialBorder,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s, border-color 0.2s",
                    ...(light
                      ? { backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }
                      : {}),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = light
                      ? "rgba(162,210,255,0.35)"
                      : "rgba(59,130,246,0.1)";
                    e.currentTarget.style.borderColor = light
                      ? "rgba(255,209,220,0.75)"
                      : "rgba(59,130,246,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = socialBg;
                    e.currentTarget.style.borderColor = light
                      ? "rgba(255, 255, 255, 0.38)"
                      : "rgba(255,255,255,0.06)";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={iconStroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} style={{ flex: "0 0 140px" }}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: headingColor,
                  letterSpacing: "0.04em",
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                {category}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 13,
                        color: linkColor,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = linkHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = linkColor;
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: dividerGrad,
            marginBottom: 24,
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: bottomText, margin: 0 }}>
            &copy; {new Date().getFullYear()} Hirely. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: bottomText, margin: 0 }}>
            Built with AI for the future of hiring.
          </p>
        </div>
      </div>
    </footer>
  );
}
