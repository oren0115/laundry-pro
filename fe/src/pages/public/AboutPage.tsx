import { Award, Building2, Target, Users } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { FadeIn } from "@/components/public/FadeIn";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND_FULL_NAME, BRAND_NAME } from "@/lib/brand";

const CERTS = ["ISO 9001 Proses Cuci", "Eco Detergent Certified", "Partner Hotel 4★"];

export function AboutPage() {
  usePageMeta({
    title: "Tentang Kami",
    description: `Profil ${BRAND_FULL_NAME}, visi misi, pengalaman, dan tim profesional.`,
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            align="left"
            eyebrow="Tentang"
            title="Mencuci dengan standar profesional sejak 2018"
            description={`${BRAND_NAME} lahir dari visi membuat laundry tradisional menjadi pengalaman digital yang rapi, cepat, dan terpercaya.`}
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Building2 className="size-5 text-primary" />
                  Profil Usaha
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Kami mengoperasikan 12 outlet di Jabodetabek dengan teknologi tracking,
                  mesin industri, dan tim terlatih. Lebih dari 480.000 order telah kami
                  selesaikan dengan rating 4.9/5.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn delay={80}>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Target className="size-5 text-primary" />
                  Visi & Misi
                </h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Visi:</strong> Menjadi platform laundry #1 yang ramah digital di
                  Indonesia.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Misi:</strong> Memberikan layanan cepat, higienis, transparan, dengan
                  harga fair dan pengalaman pelanggan terbaik.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <section className="mt-16">
          <FadeIn>
            <SectionHeading align="left" title="Outlet & Tim" />
          </FadeIn>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Outlet Sudirman", "Tim Produksi", "Tim Kurir"].map((label, i) => (
              <FadeIn key={label} delay={i * 60}>
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border bg-gradient-to-br from-primary/10 to-muted text-center">
                  <Users className="mb-2 size-8 text-primary/60" />
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground/80">Foto placeholder</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <FadeIn>
            <SectionHeading align="left" title="Sertifikat & Keunggulan" />
          </FadeIn>
          <div className="mt-6 flex flex-wrap gap-3">
            {CERTS.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm"
              >
                <Award className="size-4 text-primary" />
                {c}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
