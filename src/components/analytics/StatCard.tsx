"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number | null;
  suffix?: string;
  accent?: "violet" | "cyan" | "emerald" | "amber" | "rose";
  delay?: number;
}

const ACCENT_STYLES: Record<string, { icon: string; border: string }> = {
  violet: { icon: "text-violet-400", border: "border-violet-500/20" },
  cyan:   { icon: "text-cyan-400",   border: "border-cyan-500/20" },
  emerald:{ icon: "text-emerald-400",border: "border-emerald-500/20" },
  amber:  { icon: "text-amber-400",  border: "border-amber-500/20" },
  rose:   { icon: "text-rose-400",   border: "border-rose-500/20" },
};

export function StatCard({ icon, label, value, suffix, accent = "violet", delay = 0 }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];
  const display = value === null || value === undefined ? "—" : `${value}${suffix ?? ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`glass-card rounded-2xl p-5 border ${styles.border} flex flex-col gap-3`}
    >
      <div className={`${styles.icon} w-8 h-8 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="label-caps lp-muted mb-1">{label}</p>
        <p className="text-2xl font-black lp-hi">{display}</p>
      </div>
    </motion.div>
  );
}
