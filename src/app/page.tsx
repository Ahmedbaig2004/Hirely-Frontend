"use client";

import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { EnhanceSection } from "@/components/landing/EnhanceSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
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
      <div style={{ position: "relative", zIndex: 2 }}>
        <Navbar />
        <HeroSection />
        <EnhanceSection />
        <HowItWorks />
        <FeatureSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
