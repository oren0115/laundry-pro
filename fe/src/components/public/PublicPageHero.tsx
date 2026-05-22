import { cn } from "@/lib/utils";

export function PublicPageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b landing-mesh py-14 sm:py-16">
      <div className="landing-grid-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className={cn("text-3xl font-bold tracking-tight sm:text-4xl")}>{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">{description}</p>
        )}
      </div>
    </div>
  );
}
