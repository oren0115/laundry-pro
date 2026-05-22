import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { FadeIn } from "@/components/public/FadeIn";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { PricingSection } from "@/components/public/landing/PricingSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingPage() {
  const { content } = usePublicContent();

  usePageMeta({
    title: "Harga",
    description: "Tabel harga laundry, paket member, paket bulanan, dan promo.",
  });

  return (
    <>
      <PublicPageHero
        eyebrow="Harga"
        title="Harga transparan, tanpa biaya tersembunyi"
        description="Pilih paket per kg atau per item, plus opsi member dan bulanan."
      />
      <PricingSection anchorId={false} />

      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeIn>
            <SectionHeading align="left" title="Tabel Harga Layanan" />
          </FadeIn>
          <FadeIn>
            <div className="glass-panel mt-8 overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="px-4 py-3 font-medium">Jenis Layanan</th>
                      <th className="px-4 py-3 font-medium">Harga</th>
                      <th className="px-4 py-3 font-medium">Estimasi</th>
                      <th className="px-4 py-3 font-medium">Minimal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content.pricingRows.length ? content.pricingRows : []).map((row) => (
                      <tr key={row.service} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">{row.service}</td>
                        <td className="px-4 py-3 text-primary">{row.price}</td>
                        <td className="px-4 py-3">{row.estimate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.minimum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          <section className="mt-16">
            <FadeIn>
              <SectionHeading align="left" title="Paket Member" />
            </FadeIn>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {(content.memberPackages.length ? content.memberPackages : []).map((pkg, i) => (
                <FadeIn key={pkg.name} delay={i * 60}>
                  <div
                    className={cn(
                      "glass-panel flex h-full flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg",
                      pkg.highlight && "border-primary/30 ring-1 ring-primary/20"
                    )}
                  >
                    {pkg.highlight && (
                      <span className="mb-3 w-fit rounded-full bg-primary px-2.5 py-0.5 text-xs text-primary-foreground">
                        Populer
                      </span>
                    )}
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="mt-1 text-2xl font-bold text-primary">{pkg.price}</p>
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                      {pkg.perks.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="text-primary">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-6 w-full rounded-xl" render={<Link to="/register" />}>
                      Daftar Member
                    </Button>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <FadeIn>
              <SectionHeading align="left" title="Paket Bulanan" />
            </FadeIn>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {(content.monthlyPackages.length ? content.monthlyPackages : []).map((p) => (
                <div key={p.name} className="glass-panel rounded-2xl p-6">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xl font-bold text-primary">{p.price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <FadeIn>
              <SectionHeading align="left" title="Promo Aktif" />
            </FadeIn>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {content.promos.map((promo) => (
                <div key={promo.code} className="glass-panel flex gap-3 rounded-2xl border-dashed p-5">
                  <Tag className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{promo.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Kode: <strong>{promo.code}</strong> · {promo.until}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
