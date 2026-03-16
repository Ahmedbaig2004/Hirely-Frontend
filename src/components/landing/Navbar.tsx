"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, LayoutDashboard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabaseClient";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Interview", href: "/start" },
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
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,16,0.88)" : "rgba(8,8,16,0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
        >
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm tracking-wide text-white/70">HIRELY</span>
      </Link>

      {/* Center nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-7">
        {navLinks.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors duration-200 ${
                active ? "text-white/90 font-medium" : "text-white/50 hover:text-white/90"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </>
        )}
        <Link
          href="/start"
          className="btn-violet rounded-full px-5 py-2 text-xs font-semibold"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
