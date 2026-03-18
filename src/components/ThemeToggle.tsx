"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200"
      style={{
        background: "var(--md-sys-color-surface-container)",
        borderColor: "var(--md-sys-color-outline-variant)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={15} style={{ color: "var(--md-sys-color-primary)" }} />
      ) : (
        <Moon size={15} style={{ color: "var(--md-sys-color-primary)" }} />
      )}
    </button>
  );
}
