import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { useToast } from "@/components/ui/toast";
import { SectionHeading } from "@/components/public/SectionHeading";
import { MotionReveal } from "./AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const { content } = usePublicContent();
  const { site, branches } = content;
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
    <section id="kontak" className="relative scroll-mt-24 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="Kontak"
            title="Kami siap membantu Anda"
            description="Form pesan, lokasi cabang, dan jam operasional."
          />
        </MotionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <MotionReveal delay={0.08}>
            <form onSubmit={submit} className="glass-panel space-y-4 rounded-2xl p-6 sm:p-8">
              <h3 className="font-semibold">Kirim Pesan</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama</label>
                <Input
                  required
                  className="rounded-xl"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  className="rounded-xl"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pesan</label>
                <Textarea
                  required
                  rows={4}
                  className="rounded-xl"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </Button>
            </form>
          </MotionReveal>

          <div className="space-y-4">
            <MotionReveal delay={0.12}>
              <div className="glass-panel space-y-3 rounded-2xl p-6 text-sm">
                <p className="flex gap-2.5">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {site.address}
                </p>
                <p className="flex gap-2.5">
                  <Phone className="size-4 shrink-0 text-primary" />
                  +{site.phone}
                </p>
                <p className="flex gap-2.5">
                  <Clock className="size-4 shrink-0 text-primary" />
                  {site.hours}
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.16}>
              <div className="overflow-hidden rounded-2xl border">
                <iframe
                  title="Lokasi"
                  className="h-48 w-full sm:h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Jakarta%20Sudirman&output=embed"
                />
              </div>
            </MotionReveal>

            {branches.length > 0 && (
              <MotionReveal delay={0.2}>
                <div className="space-y-3">
                  <h3 className="font-semibold">Cabang</h3>
                  {branches.map((b) => (
                    <div key={b.name} className="glass-panel rounded-2xl p-4 text-sm">
                      <p className="font-medium">{b.name}</p>
                      <p className="text-muted-foreground">{b.address}</p>
                      <p className="text-muted-foreground">{b.phone}</p>
                    </div>
                  ))}
                </div>
              </MotionReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
