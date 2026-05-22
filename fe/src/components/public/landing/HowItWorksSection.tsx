import { ClipboardList, Package, Sparkles, Truck } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/data/public-content";
import { SectionHeading } from "@/components/public/SectionHeading";
import { MotionReveal } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

const stepIcons = {
  clipboard: ClipboardList,
  truck: Truck,
  sparkles: Sparkles,
  package: Package,
};

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 sm:py-28">
      <div className="landing-grid-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="Cara Kerja"
            title="Empat langkah, cucian bersih di rumah"
            description="Proses transparan dari order hingga pengantaran."
          />
        </MotionReveal>

        <div className="relative mt-14">
          <div
            className="absolute top-12 right-8 left-8 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block"
            aria-hidden
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => {
              const Icon = stepIcons[step.icon];
              return (
                <MotionReveal key={step.step} delay={i * 0.1}>
                  <li className="group relative">
                    <div className="glass-panel flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                          <Icon className="size-6" strokeWidth={1.5} />
                        </span>
                        <span
                          className={cn(
                            "text-4xl font-bold tabular-nums text-primary/15 transition-colors",
                            "group-hover:text-primary/25"
                          )}
                        >
                          {String(step.step).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </MotionReveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
