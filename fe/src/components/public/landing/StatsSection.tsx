import { Headphones, Heart, Shirt, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { AnimatedCounter, MotionReveal } from "./AnimatedCounter";
import { GradientBlob } from "./GradientBlob";

const iconMap: Record<string, LucideIcon> = {
  shirt: Shirt,
  users: Users,
  heart: Heart,
  headphones: Headphones,
};

export function StatsSection() {
  const { content } = usePublicContent();

  return (
    <section className="relative overflow-hidden py-16 sm:py-20" id="stats">
      <GradientBlob className="left-1/2 top-0 -translate-x-1/2 opacity-40" size="md" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, i) => {
            const Icon = iconMap[stat.icon] ?? Shirt;
            return (
              <MotionReveal key={stat.key} delay={i * 0.08}>
                <div className="group glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
