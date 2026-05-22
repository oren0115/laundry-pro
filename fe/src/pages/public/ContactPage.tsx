import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { BRANCHES, SITE } from "@/data/public-content";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/public/FadeIn";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_NAME } from "@/lib/brand";

export function ContactPage() {
  usePageMeta({
    title: "Kontak",
    description: `Hubungi ${BRAND_NAME} — form pesan, lokasi cabang, jam operasional.`,
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      toast({
        title: "Pesan terkirim",
        description: "Tim kami akan membalas dalam 1×24 jam.",
        variant: "success",
      });
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            align="left"
            eyebrow="Kontak"
            title="Kami siap membantu Anda"
          />
        </FadeIn>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pesan</label>
                    <Textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-4">
            <FadeIn delay={60}>
              <Card>
                <CardContent className="space-y-3 pt-6 text-sm">
                  <p className="flex gap-2">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    {SITE.address}
                  </p>
                  <p className="flex gap-2">
                    <Phone className="size-4 shrink-0 text-primary" />
                    +{SITE.phone}
                  </p>
                  <p className="flex gap-2">
                    <Clock className="size-4 shrink-0 text-primary" />
                    {SITE.hours}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="overflow-hidden rounded-xl border">
                <iframe
                  title={`Lokasi ${BRAND_NAME}`}
                  className="h-48 w-full sm:h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Jakarta%20Sudirman&output=embed"
                />
              </div>
            </FadeIn>

            <FadeIn delay={180}>
              <div className="space-y-3">
                <h3 className="font-semibold">Cabang</h3>
                {BRANCHES.map((b) => (
                  <Card key={b.name}>
                    <CardContent className="pt-4 text-sm">
                      <p className="font-medium">{b.name}</p>
                      <p className="text-muted-foreground">{b.address}</p>
                      <p className="text-muted-foreground">{b.phone}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
