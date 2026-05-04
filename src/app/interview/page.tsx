"use client";

import InterviewPanel from "@/components/InterviewPanel";
import LpBackground from "@/components/landing/LpBackground";
export default function InterviewPage() {
  return (
    <div
      className="lp-page relative min-h-screen overflow-hidden pt-[var(--app-report-page-pt)]"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <LpBackground />
      <div className="relative z-[2]">
        <InterviewPanel />
      </div>
    </div>
  );
}
