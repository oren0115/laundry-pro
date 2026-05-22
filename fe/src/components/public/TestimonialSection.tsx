import { useCallback, useEffect } from "react";
import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { mediaUrl } from "@/lib/media-url";
import { SectionHeading } from "./SectionHeading";
import { MotionReveal } from "./landing/AnimatedCounter";
import { cn } from "@/lib/utils";

export function TestimonialSection() {
  const { content } = usePublicContent();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(scrollNext, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, scrollNext]);

  if (!content.testimonials.length) return null;

  return (
    <section id="testimoni" className="relative scroll-mt-24 overflow-hidden bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="Testimoni"
            title="Dipercaya ribuan pelanggan"
            description="Ulasan nyata dari pengguna layanan kami."
          />
        </MotionReveal>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {content.testimonials.map((t) => (
              <div
                key={t.name + t.text.slice(0, 12)}
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)]"
              >
                <article className="glass-panel flex h-full flex-col rounded-2xl p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <img
                        src={mediaUrl(t.image)}
                        alt={t.name}
                        loading="lazy"
                        className="size-12 rounded-full object-cover ring-2 ring-primary/10"
                      />
                    ) : (
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {t.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {content.testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn("h-1.5 w-6 rounded-full bg-primary/20 transition-all first:bg-primary")}
              aria-label={`Slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
