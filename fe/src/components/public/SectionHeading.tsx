import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}
