"use client";

import { motion } from "framer-motion";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`lp-surface-md animate-pulse rounded-xl ${className ?? ""}`} />
  );
}

export function AnalyticsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 flex flex-col gap-3">
            <Shimmer className="w-8 h-8" />
            <div className="flex flex-col gap-2">
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Trend + Radar row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <Shimmer className="h-4 w-32 mb-6" />
          <Shimmer className="h-[280px]" />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <Shimmer className="h-4 w-28 mb-6" />
          <Shimmer className="h-[280px] rounded-full" />
        </div>
      </div>

      {/* Type + Decision row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <Shimmer className="h-4 w-36 mb-6" />
            <Shimmer className="h-[280px]" />
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="glass-card rounded-2xl p-6">
        <Shimmer className="h-4 w-32 mb-6" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 mb-3">
            <Shimmer className="h-9 w-36" />
            <Shimmer className="h-9 w-14" />
            <Shimmer className="h-9 w-14" />
            <Shimmer className="h-9 w-14" />
          </div>
        ))}
      </div>

      {/* Delivery */}
      <div className="glass-card rounded-2xl p-6">
        <Shimmer className="h-4 w-40 mb-6" />
        <div className="flex gap-4 mb-6">
          <Shimmer className="h-20 w-24" />
          <Shimmer className="h-20 w-24" />
          <Shimmer className="h-20 w-24" />
        </div>
        <Shimmer className="h-[160px]" />
      </div>
    </motion.div>
  );
}
