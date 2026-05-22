import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceIcon } from "@/lib/service-icons";
import { cn } from "@/lib/utils";

export function ServiceCard({
  name,
  description,
  priceLabel,
  estimate,
  icon,
  compact = false,
}: {
  name: string;
  description: string;
  priceLabel: string;
  estimate: string;
  icon: LucideIcon | string;
  compact?: boolean;
}) {
  const Icon = typeof icon === "string" ? getServiceIcon(icon) : icon;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
      )}
    >
      <div className="relative border-b border-border/50 bg-gradient-to-br from-muted/60 to-transparent p-6">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/10 bg-background shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/20">
          <Icon className="size-6 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold tracking-tight">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <p className="mt-4 text-lg font-semibold text-primary">{priceLabel}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          Estimasi {estimate}
        </p>
        <Button
          size={compact ? "sm" : "default"}
          variant="ghost"
          className="mt-4 w-fit gap-1 px-0 hover:bg-transparent"
          render={<Link to="/register" />}
        >
          Pesan sekarang
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </article>
  );
}
