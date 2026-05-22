import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";

export function ProgressBarInView({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce("-40px");

  return (
    <div ref={ref} className="h-full w-full">
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-[width] duration-1000 ease-out",
          className
        )}
        style={{ width: inView ? `${percent}%` : "0%" }}
      />
    </div>
  );
}
