import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SectionDivider amplitude="bold" to="#f7f9fa" />
        <SimulateSection>
          <Simulator />
        </SimulateSection>
        <SectionDivider amplitude="medium" to="#e8f2dd" />
        <HowItWorks />
        <SectionDivider amplitude="medium" flip to="#ffffff" />
        <Faq />
        <SectionDivider amplitude="bold" to="#0a2150" className="-mt-1 mb-0" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays */}
      <LandingOverlays />
    </>
  );
}
