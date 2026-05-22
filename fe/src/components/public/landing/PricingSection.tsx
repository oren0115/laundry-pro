import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/SectionHeading";
import { cn } from "@/lib/utils";
import { MotionReveal } from "./AnimatedCounter";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PricingSection({ anchorId = "harga" }: { anchorId?: string | false }) {
  const { content } = usePublicContent();
  const [unit, setUnit] = useState<"kg" | "item">("kg");

  return (
    <section
      {...(anchorId ? { id: anchorId } : {})}
      className="relative scroll-mt-24 bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MotionReveal>
          <SectionHeading
            eyebrow="Harga"
            title="Paket transparan, tanpa biaya tersembunyi"
            description="Toggle per kg atau per item — pilih yang sesuai kebutuhan Anda."
          />
        </MotionReveal>

        <MotionReveal className="mt-8 flex justify-center" delay={0.1}>
          <div className="glass-panel inline-flex rounded-2xl p-1">
            {(["kg", "item"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={cn(
                  "relative rounded-xl px-5 py-2 text-sm font-medium transition-all duration-300",
                  unit === u
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {u === "kg" ? "Per Kg" : "Per Item"}
              </button>
            ))}
          </div>
        </MotionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {content.pricingTiers.map((tier, i) => {
            const price = unit === "kg" ? tier.priceKg : tier.priceItem;
            return (
              <MotionReveal key={tier.id} delay={i * 0.1}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 sm:p-8",
                    tier.highlight
                      ? "border-primary bg-card shadow-xl shadow-primary/10 scale-[1.02] lg:scale-105"
                      : "glass-panel hover:-translate-y-1 hover:shadow-lg"
                  )}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      <Sparkles className="size-3" />
                      Paling Populer
                    </span>
                  )}
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                  <p className="mt-6">
                    <span className="text-3xl font-bold tracking-tight">{formatRp(price)}</span>
                    <span className="text-sm text-muted-foreground">/{unit === "kg" ? "kg" : "item"}</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn("mt-8 w-full rounded-xl", tier.highlight && "shadow-md")}
                    variant={tier.highlight ? "default" : "outline"}
                    render={<Link to="/register" />}
                  >
                    Pilih {tier.name}
                  </Button>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
