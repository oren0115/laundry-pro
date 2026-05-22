import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { MotionReveal } from "./landing/AnimatedCounter";

export function FAQSection() {
  const { content } = usePublicContent();
  const [open, setOpen] = useState<number | null>(0);

  if (!content.faqs.length) return null;

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang sering ditanyakan"
            description="Belum menemukan jawaban? Hubungi kami via WhatsApp."
          />
        </MotionReveal>
        <div className="mt-10 space-y-3">
          {content.faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <MotionReveal key={item.q} delay={i * 0.05}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-colors duration-300",
                    isOpen && "border-primary/25 shadow-sm"
                  )}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium sm:px-6"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    {item.q}
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                    aria-hidden={!isOpen}
                  >
                    <div
                      className={cn(
                        "min-h-0 overflow-hidden transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <div className="border-t px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground sm:px-6">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
