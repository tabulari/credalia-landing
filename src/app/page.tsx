import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { Requirements } from "@/components/Requirements";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { Security } from "@/components/Security";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SimulateSection>
          <Simulator />
        </SimulateSection>
        <Requirements />
        <HowItWorks />
        <Faq />
        <Security />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays */}
      <LandingOverlays />
    </>
  );
}
