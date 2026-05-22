import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { mediaUrl } from "@/lib/media-url";
import { GradientBlob } from "./GradientBlob";
import { ProgressBarInView } from "./ProgressBarInView";

const floatingCards = [
  { title: "Order selesai", subtitle: "LD-20260520", icon: CheckCircle2, className: "left-0 top-8 animate-float" },
  { title: "Tracking realtime", subtitle: "Status: Dicuci", icon: MapPin, className: "right-0 top-16 animate-float-delayed" },
  { title: "Rating customer", subtitle: "4.9 / 5.0", icon: Star, className: "bottom-8 left-8 animate-float-slow" },
];

export function HeroSection() {
  const { content } = usePublicContent();
  const { hero } = content;
  const hasBgImage = Boolean(hero.images.background);

  const headlinePrefix = hero.headline.includes(hero.headlineHighlight)
    ? hero.headline.replace(hero.headlineHighlight, "").trim().replace(/,\s*$/, "")
    : hero.headline.split(",")[0];

  return (
    <section className="relative overflow-hidden landing-mesh">
      {/* Background image jumbotron */}
      {hasBgImage && (
        <>
          <img
            src={mediaUrl(hero.images.background)}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
        </>
      )}
      <div className="landing-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      {!hasBgImage && <GradientBlob className="-left-24 top-10" size="lg" />}
      {!hasBgImage && <GradientBlob className="-right-16 top-32 opacity-60" size="md" />}

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div className="animate-fade-up space-y-8">
          <div className="flex flex-wrap gap-2">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="glass-panel inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              >
                <Sparkles className="size-3 text-primary" />
                {badge}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {headlinePrefix},{" "}
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                {hero.headlineHighlight}
              </span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{hero.subheadline}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-11 rounded-xl px-6 shadow-lg shadow-primary/10" render={<Link to="/register" />}>
              Mulai Laundry
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-xl border-border/80 bg-background/50 px-6 backdrop-blur-sm"
              render={<Link to="/cek-status" />}
            >
              <Search className="size-4" />
              Cek Status
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[hero.images.customer, hero.images.courier].map((src, i) => (
                <img
                  key={i}
                  src={mediaUrl(src)}
                  alt=""
                  loading="lazy"
                  className="size-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span>
              <strong className="text-foreground">{hero.socialProof}</strong>
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:150ms] lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/5 sm:aspect-square lg:aspect-[5/6]">
            <img
              src={mediaUrl(hero.images.main)}
              alt="Fasilitas laundry premium"
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Progress order</p>
                  <p className="font-semibold">Dicuci — 68%</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Truck className="size-5" />
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <ProgressBarInView percent={68} />
              </div>
            </div>
          </div>

          {floatingCards.map((card) => (
            <div key={card.title} className={`absolute hidden sm:block ${card.className}`}>
              <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <card.icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold">{card.title}</p>
                  <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
