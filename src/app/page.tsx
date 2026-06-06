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
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SectionDivider shape="wave" to="#f7f9fa" />
        <SimulateSection>
          <Simulator />
        </SimulateSection>
        <SectionDivider shape="slant" to="#ffffff" />
        <Requirements />
        <SectionDivider shape="curve" to="#e8f2dd" />
        <HowItWorks />
        <SectionDivider shape="curve" flip to="#ffffff" />
        <Faq />
        <Security />
        <SectionDivider shape="slant" to="#0a2150" className="-mt-1 mb-0" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays */}
      <LandingOverlays />
    </>
  );
}
