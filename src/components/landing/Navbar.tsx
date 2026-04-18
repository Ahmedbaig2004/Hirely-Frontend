"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/components/lib/utils";
import { usePreloaderContextOptional } from "@/components/landing/PreloaderContext";

const SCROLL_RANGE = 140;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact us", href: "/contact" },
] as const;

function useScrollT() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setT(Math.min(1, Math.max(0, y / SCROLL_RANGE)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return t;
}

export function Navbar() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const preloader = usePreloaderContextOptional();
  const logoVisible = preloader?.navbarLogoVisible ?? true;
  const t = useScrollT();
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCursor, setDesktopCursor] = useState(false);
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
    onTarget: false,
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktopCursor(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  const sidePad = t * 96;
  const topPad = 12 + t * 22;
  const ease = reduceMotion ? "0.01s" : "0.68s";
  const easeFn = reduceMotion ? "linear" : "cubic-bezier(0.33, 1, 0.68, 1)";

  const barRadius = t * 22;
  const padY = 14 - t * 1.5;
  const padX = 20 - t * 11;
  const linkGap = 26 - t * 3;
  const linkSize = 13.5;

  const glassBg =
    t > 0.35 ? "rgba(15, 23, 42, 0.82)" : "rgba(17, 24, 39, 0.42)";
  const borderCol =
    t > 0.35 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)";

  const showCustomCursor = desktopCursor && !reduceMotion;

  const trackNavCursor = (e: React.MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    setCursor({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      onTarget: !!el?.closest("[data-nav-cursor-target]"),
    });
  };

  const size = cursor.onTarget ? 32 : 10;
  const borderRadius = cursor.onTarget ? 6 : 999;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          pointerEvents: "none",
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: topPad,
          transition: `padding-left ${ease} ${easeFn}, padding-right ${ease} ${easeFn}, padding-top ${ease} ${easeFn}`,
        }}
      >
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: "easeOut" }}
          style={{
            pointerEvents: "auto",
            width: "100%",
            borderRadius: barRadius,
            padding: `${padY}px ${padX}px`,
            display: "block",
            overflow: "visible",
            background: glassBg,
            backdropFilter: "blur(22px) saturate(1.35)",
            WebkitBackdropFilter: "blur(22px) saturate(1.35)",
            border: `1px solid ${borderCol}`,
            boxShadow:
              t > 0.4
                ? "0 18px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 8px 32px rgba(0,0,0,0.12)",
            transition: `border-radius ${ease} ${easeFn}, padding ${ease} ${easeFn}, background ${ease} ${easeFn}, border-color ${ease} ${easeFn}, box-shadow ${ease} ${easeFn}`,
          }}
        >
          <div
            data-navbar-cursor-inner
            onMouseMove={showCustomCursor ? trackNavCursor : undefined}
            onMouseEnter={
              showCustomCursor ? () => setCursor((c) => ({ ...c, visible: true })) : undefined
            }
            onMouseLeave={
              showCustomCursor
                ? () =>
                    setCursor((c) => ({
                      ...c,
                      visible: false,
                      onTarget: false,
                    }))
                : undefined
            }
            className={cn(
              showCustomCursor ? "max-md:cursor-auto md:cursor-none" : undefined,
              "flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-items-stretch md:gap-x-3"
            )}
            style={{
              alignItems: "center",
              width: "100%",
              overflow: "visible",
            }}
          >
            {/* Logo — left */}
            <div style={{ justifySelf: "start", minWidth: 0 }}>
              <Link
                href="/"
                data-nav-cursor-target
                data-navbar-logo
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  flexShrink: 0,
                  opacity: logoVisible ? 1 : 0,
                  pointerEvents: logoVisible ? "auto" : "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  transform: "scale(1)",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                  </svg>
                </div>
                <span
                  data-navbar-logo-text
                  style={{
                    fontWeight: 600,
                    fontSize: 13.5,
                    letterSpacing: "0.06em",
                    color: "#e2e8f0",
                    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  }}
                >
                  HIRELY
                </span>
              </Link>
            </div>

            {/* Center nav — viewport center on md+ */}
            <div
              className="hidden md:flex"
              style={{
                justifySelf: "center",
                alignItems: "center",
                gap: linkGap,
              }}
            >
              {navLinks.map(({ label, href }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    data-nav-cursor-target
                    style={{
                      fontSize: linkSize,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "#f1f5f9" : "#94a3b8",
                      textDecoration: "none",
                      fontFamily:
                        "var(--font-geist-sans), system-ui, sans-serif",
                      letterSpacing: "0.02em",
                      transition:
                        "color 0.22s ease, transform 0.18s ease, opacity 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#94a3b8";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.97)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right actions + mobile menu */}
            <div
              style={{
                justifySelf: "end",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "nowrap",
                overflow: "visible",
              }}
            >
              <button
                type="button"
                className="md:hidden"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((o) => !o)}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  transition:
                    "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease",
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden lg:inline-flex"
                    data-nav-cursor-target
                    style={{
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 11px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500,
                      color: pathname === "/dashboard" ? "#e2e8f0" : "#94a3b8",
                      textDecoration: "none",
                      transition: "color 0.2s ease, background 0.2s ease",
                    }}
                  >
                    <LayoutDashboard size={13} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="hidden lg:inline-flex"
                    data-nav-cursor-target
                    style={{
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 11px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500,
                      color:
                        pathname === "/dashboard/analytics"
                          ? "#e2e8f0"
                          : "#94a3b8",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                  >
                    <BarChart3 size={13} />
                    <span>Analytics</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hidden lg:inline-flex"
                    data-nav-cursor-target
                    style={{
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 11px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#94a3b8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
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
                  data-nav-cursor-target
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "#94a3b8",
                    textDecoration: "none",
                    transition: "color 0.2s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  Login
                </Link>
              )}

              <div data-nav-cursor-target>
                <ThemeToggle />
              </div>

              <Link
                href="/help"
                data-nav-cursor-target
                className="hidden items-center gap-1.5 sm:inline-flex"
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: pathname === "/help" ? "#e2e8f0" : "#94a3b8",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                title="Help Center"
              >
                <HelpCircle size={15} aria-hidden />
                <span className="hidden lg:inline">Help</span>
              </Link>

              <Link
                href="/settings"
                data-nav-cursor-target
                className={cn(
                  "hidden items-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors sm:inline-flex",
                  pathname === "/settings"
                    ? "border-violet-400/35 bg-violet-500/15 text-[#e2e8f0] shadow-[0_0_20px_-4px_rgba(139,92,246,0.35)]"
                    : "border-white/[0.12] bg-white/[0.05] text-[#e2e8f0] hover:border-violet-400/25 hover:bg-violet-500/10",
                )}
                title="Settings"
              >
                <Settings size={15} strokeWidth={2} aria-hidden />
                <span className="hidden md:inline">Settings</span>
              </Link>

              <Link
                href="/start"
                data-nav-cursor-target
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: `7px ${18 - t * 5}px`,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  color: "#fff",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 2px 14px rgba(59,130,246,0.3)",
                  transition:
                    "transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(59,130,246,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 2px 14px rgba(59,130,246,0.3)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div
              className="md:hidden"
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {navLinks.map(({ label, href }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: "12px 10px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#f1f5f9" : "#94a3b8",
                      textDecoration: "none",
                      background: isActive
                        ? "rgba(59,130,246,0.12)"
                        : "transparent",
                      transition: "background 0.2s ease, color 0.2s ease",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
              {!user && (
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    fontSize: 15,
                    color: "#94a3b8",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              )}
              <Link
                href="/help"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "12px 10px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: pathname === "/help" ? 600 : 400,
                  color: pathname === "/help" ? "#f1f5f9" : "#94a3b8",
                  textDecoration: "none",
                  background:
                    pathname === "/help" ? "rgba(59,130,246,0.12)" : "transparent",
                }}
              >
                Help Center
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "12px 10px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: pathname === "/settings" ? 600 : 400,
                  color: pathname === "/settings" ? "#f1f5f9" : "#94a3b8",
                  textDecoration: "none",
                  background:
                    pathname === "/settings" ? "rgba(139,92,246,0.15)" : "transparent",
                  border: pathname === "/settings" ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
                }}
              >
                Settings
              </Link>
            </div>
          )}
        </motion.nav>
      </div>

      {showCustomCursor && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            left: cursor.x,
            top: cursor.y,
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderRadius,
            border: cursor.onTarget
              ? "1px solid rgba(96,165,250,0.85)"
              : "1px solid rgba(148,163,184,0.45)",
            background: cursor.onTarget
              ? "rgba(59,130,246,0.18)"
              : "rgba(255,255,255,0.04)",
            boxShadow: cursor.onTarget
              ? "0 0 28px rgba(59,130,246,0.55), inset 0 0 12px rgba(34,211,238,0.12)"
              : "none",
            pointerEvents: "none",
            zIndex: 110,
            opacity: cursor.visible ? 1 : 0,
            transition:
              "width 0.22s ease, height 0.22s ease, border-radius 0.22s ease, background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, opacity 0.15s ease",
          }}
        />
      )}

    </>
  );
}
