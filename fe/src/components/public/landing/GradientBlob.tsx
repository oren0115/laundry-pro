import { cn } from "@/lib/utils";

export function GradientBlob({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-48 w-48",
    md: "h-72 w-72",
    lg: "h-96 w-96",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-primary/10 blur-3xl animate-blob",
        sizes[size],
        className
      )}
    />
  );
}
