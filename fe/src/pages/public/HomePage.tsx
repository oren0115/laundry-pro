import { usePageMeta } from "@/hooks/use-page-meta";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { FeaturesStrip } from "@/components/public/landing/FeaturesStrip";
import { StatsSection } from "@/components/public/landing/StatsSection";
import { ServicesSection } from "@/components/public/landing/ServicesSection";
import { HowItWorksSection } from "@/components/public/landing/HowItWorksSection";
import { TrackingPreviewSection } from "@/components/public/landing/TrackingPreviewSection";
import { PricingSection } from "@/components/public/landing/PricingSection";
import { TestimonialSection } from "@/components/public/TestimonialSection";
import { FAQSection } from "@/components/public/FAQSection";
import { ContactSection } from "@/components/public/landing/ContactSection";
import { CtaBanner } from "@/components/public/landing/CtaBanner";

export function HomePage() {
  usePageMeta({
    title: "Beranda",
    description:
      "Laundry premium dengan antar jemput, tracking realtime, dan pembayaran cashless. Pesan dalam 2 menit.",
  });

  return (
    <>
      <HeroSection />
      <FeaturesStrip />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <TrackingPreviewSection />
      <PricingSection />
      <TestimonialSection />
      <FAQSection />
      <ContactSection />
      <CtaBanner />
    </>
  );
}
