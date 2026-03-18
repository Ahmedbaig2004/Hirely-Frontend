"use client";

import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-on-surface overflow-x-hidden">
      <MeshGradient />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
        <Footer />
      </div>
    </main>
  );
}
