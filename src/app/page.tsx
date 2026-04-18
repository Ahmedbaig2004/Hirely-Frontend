"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { EnhanceSection } from "@/components/landing/EnhanceSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import LpBackground, { PageCursorGlow } from "@/components/landing/LpBackground";

export default function Home() {
  return (
    <main
      className="lp-page"
      style={{
        background: "var(--lp-background)",
        color: "var(--lp-foreground)",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <PageCursorGlow />
      <LpBackground />
      <div id="landing-scroll-content" style={{ position: "relative", zIndex: 2 }}>
        <HeroSection />
        <div className="relative isolate">
          <div className="relative z-[1]">
            <EnhanceSection />
            <HowItWorks />
            <FeatureSection />
            <StatsSection />
            <TestimonialsSection />
            <CTASection />
          </div>
        </div>
      </div>
    </main>
  );
}
