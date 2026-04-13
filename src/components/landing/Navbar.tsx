"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { label: "Product", href: "#features", hasDropdown: true },
  { label: "Solutions", href: "#how-it-works", hasDropdown: true },
  { label: "Resources", href: "#faq", hasDropdown: true },
  { label: "Company", href: "/about", hasDropdown: true },
  { label: "Pricing", href: "/pricing", hasDropdown: false },
];

export function Navbar() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(17, 24, 39, 0.88)"
          : "rgba(17, 24, 39, 0.4)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
          </svg>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "0.04em", color: "#e2e8f0" }}>
          HIRELY
        </span>
      </Link>

      {/* Center nav links */}
      <div
        className="hidden md:flex"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {navLinks.map(({ label, href, hasDropdown }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "#e2e8f0" : "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#e2e8f0"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#94a3b8"; }}
            >
              {label}
              {hasDropdown && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <>
            <Link
              href="/dashboard"
              className="hidden md:flex"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="hidden md:flex"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                color: "#94a3b8",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </>
        )}

        {!user && (
          <Link
            href="/auth"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#94a3b8",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#e2e8f0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
          >
            Login
          </Link>
        )}

        <ThemeToggle />

        <Link
          href="/start"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(59,130,246,0.25)",
            transition: "transform 0.2s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(59,130,246,0.25)";
          }}
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
