"use client";

import Link from "next/link";
import { Zap, Github } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Privacy", href: "#" },
  {
    label: "GitHub",
    href: "https://github.com",
    external: true,
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    external: true,
  },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="py-8 px-6 md:px-10 border-t border-outline-variant"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-primary-container))" }}
          >
            <Zap size={12} style={{ color: "var(--md-sys-color-on-primary)" }} />
          </div>
          <span className="font-semibold text-xs tracking-wide text-on-surface-variant opacity-60">HIRELY</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map(({ label, href, external, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant opacity-50 hover:opacity-80 transition-opacity duration-200"
            >
              {Icon && <Icon size={12} />}
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-on-surface-variant opacity-30">
          © {new Date().getFullYear()} Hirely. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
