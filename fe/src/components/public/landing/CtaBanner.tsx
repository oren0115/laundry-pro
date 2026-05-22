import { Link } from "react-router-dom";
import { Download, Sparkles } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { mediaUrl } from "@/lib/media-url";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "./AnimatedCounter";
import { GradientBlob } from "./GradientBlob";

export function CtaBanner() {
  const { content } = usePublicContent();
  const { cta } = content;
  const hasBg = Boolean(cta.backgroundImage);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-primary text-primary-foreground">
            {/* Background image — visible nyata dengan overlay primary di atasnya */}
            {hasBg && (
              <img
                src={mediaUrl(cta.backgroundImage)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* Overlay: primary + gradient supaya teks tetap terbaca */}
            <div className={`absolute inset-0 ${hasBg ? "bg-primary/75" : "bg-primary"}`} />
            {!hasBg && <GradientBlob className="left-0 top-0 opacity-30 mix-blend-soft-light" size="lg" />}
            {!hasBg && <GradientBlob className="right-0 bottom-0 opacity-20" size="md" />}
            <div className="landing-grid-pattern absolute inset-0 opacity-20" />

            <div className="relative flex flex-col items-center gap-8 px-6 py-14 text-center sm:px-12 sm:py-16 lg:flex-row lg:text-left">
              <div className="flex-1 space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                  <Sparkles className="size-3.5" />
                  {cta.eyebrow}
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{cta.title}</h2>
                <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">{cta.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-primary-foreground px-8 text-primary hover:bg-primary-foreground/90"
                  render={<Link to="/register" />}
                >
                  Order Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.alert("Aplikasi mobile segera hadir!")}
                >
                  <Download className="size-4" />
                  Download App
                </Button>
              </div>
            </div>

            <div
              className="absolute -right-4 -bottom-4 hidden size-32 animate-float rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur lg:block"
              aria-hidden
            />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
