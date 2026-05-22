import { usePageMeta } from "@/hooks/use-page-meta";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { FadeIn } from "@/components/public/FadeIn";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { ServiceCard } from "@/components/public/ServiceCard";

export function ServicesPage() {
  const { content } = usePublicContent();

  usePageMeta({
    title: "Layanan",
    description: "Daftar layanan laundry: reguler, express, dry cleaning, setrika, sepatu, karpet.",
  });

  return (
    <>
      <PublicPageHero
        eyebrow="Layanan"
        title="Solusi laundry lengkap"
        description="Setiap layanan dengan harga transparan, estimasi jelas, dan tombol pesan instan."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.services.map((s, i) => (
              <FadeIn key={s.id} delay={i * 50}>
                <ServiceCard {...s} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
