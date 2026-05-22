import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  MapPin,
  Navigation,
  Package,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { mediaUrl } from "@/lib/media-url";
import { SectionHeading } from "@/components/public/SectionHeading";
import { MotionReveal } from "./AnimatedCounter";
import { GradientBlob } from "./GradientBlob";
import { ProgressBarInView } from "./ProgressBarInView";

const timelineSteps = [
  { label: "Dijemput", done: true },
  { label: "Dicuci", done: true, current: true },
  { label: "Disetrika", done: false },
  { label: "Diantar", done: false },
];

export function TrackingPreviewSection() {
  const { content } = usePublicContent();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GradientBlob className="right-0 top-20" size="lg" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="Live Tracking"
              title="Pantau cucian seperti aplikasi ride-hailing"
              description="Status progres, estimasi selesai, dan posisi kurir — semua dalam satu dashboard."
            />
            <Button className="mt-6 rounded-xl" render={<Link to="/cek-status" />}>
              <Search className="size-4" />
              Coba Cek Status
              <ArrowRight className="size-4" />
            </Button>
          </MotionReveal>

          <MotionReveal delay={0.15}>
            <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/10 p-1 shadow-2xl shadow-primary/10">
              <div className="rounded-[1.35rem] bg-card p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Order aktif</p>
                    <p className="text-lg font-semibold">#LD-20260520</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Dicuci
                  </span>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                  <ProgressBarInView percent={55} />
                </div>

                <div className="mb-6 flex justify-between gap-1">
                  {timelineSteps.map((step) => (
                    <div key={step.label} className="flex flex-1 flex-col items-center gap-1.5">
                      <span
                        className={`flex size-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                          step.current
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : step.done
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.done ? "✓" : "·"}
                      </span>
                      <span
                        className={`text-center text-[10px] sm:text-xs ${
                          step.current ? "font-medium text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Navigation className="size-3.5 text-primary" />
                      Driver location
                    </div>
                    <p className="mt-1 text-sm font-medium">Kurir: 1.2 km menuju outlet</p>
                    <div className="mt-3 flex items-center gap-2">
                      <img
                        src={mediaUrl(content.hero.images.courier)}
                        alt=""
                        loading="lazy"
                        className="size-8 rounded-full object-cover"
                      />
                      <span className="text-xs text-muted-foreground">Budi — ETA 12 menit</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-primary" />
                      Estimasi selesai
                    </div>
                    <p className="mt-1 text-sm font-medium">Hari ini, 18:30 WIB</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="size-3.5" />
                      4.5 kg · Cuci Setrika
                    </p>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border">
                  <div className="relative h-28 bg-muted/50">
                    <img
                      src={mediaUrl(content.hero.images.facility)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="glass-panel inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
                        <MapPin className="size-3.5 text-primary" />
                        Outlet Sudirman — Proses aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
