import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { ServiceCard } from "@/components/public/ServiceCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { MotionReveal } from "./AnimatedCounter";
import { SectionDivider } from "./SectionDivider";

export function ServicesSection() {
  const { content } = usePublicContent();

  return (
    <section id="layanan" className="relative scroll-mt-24 py-20 sm:py-28">
      <SectionDivider className="absolute -top-1 rotate-180 text-muted/40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="Layanan"
            title="Satu platform, semua kebutuhan laundry"
            description="Pilih layanan sesuai ritme hidup Anda — dari reguler hingga perawatan premium."
          />
        </MotionReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.map((service, i) => (
            <MotionReveal key={service.id} delay={i * 0.06}>
              <ServiceCard {...service} compact />
            </MotionReveal>
          ))}
        </div>
        <MotionReveal className="mt-10 text-center" delay={0.2}>
          <Link
            to="/layanan"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
          >
            Lihat detail semua layanan
            <ArrowRight className="size-4" />
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}
