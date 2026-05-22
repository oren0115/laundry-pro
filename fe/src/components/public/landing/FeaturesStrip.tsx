import { Link } from "react-router-dom";
import { BadgePercent } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";

export function FeaturesStrip() {
  const { content } = usePublicContent();
  const promo = content.promoStrip;

  if (!promo.enabled) return null;

  return (
    <section className="animate-fade-up border-y border-primary/10 bg-primary px-4 py-3.5 text-primary-foreground [animation-delay:200ms] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 text-center text-sm sm:text-base">
        <BadgePercent className="size-5 shrink-0" />
        <span>
          <strong>{promo.title}</strong> {promo.description} — kode{" "}
          <code className="rounded-lg bg-primary-foreground/15 px-2 py-0.5 font-mono text-xs sm:text-sm">
            {promo.code}
          </code>
        </span>
        <Link
          to={`/#${promo.linkHash}`}
          className="ml-1 font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          {promo.linkLabel} →
        </Link>
      </div>
    </section>
  );
}
