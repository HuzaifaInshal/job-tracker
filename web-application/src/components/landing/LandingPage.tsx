"use client";

import { AmbientBackground } from "./AmbientBackground";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { MarqueeSection } from "./MarqueeSection";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
