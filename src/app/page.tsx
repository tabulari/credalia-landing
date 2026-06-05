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
import { StickyPaymentBar } from "@/components/StickyPaymentBar";
import { ApplyModal } from "@/components/ApplyModal";
import { ResumeNudge } from "@/components/ResumeNudge";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SimulateSection>
        <Simulator />
      </SimulateSection>
      <Requirements />
      <HowItWorks />
      <Faq />
      <Security />
      <CtaBanner />
      <Footer />

      {/* landing-only overlays */}
      <StickyPaymentBar />
      <ApplyModal />
      <ResumeNudge />
    </>
  );
}
