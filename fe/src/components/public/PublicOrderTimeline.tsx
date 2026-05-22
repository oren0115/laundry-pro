import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicStepKey } from "@/lib/tracking-steps";

type Step = {
  key: PublicStepKey;
  label: string;
  state: "done" | "current" | "upcoming";
};

export function PublicOrderTimeline({ steps }: { steps: Step[] }) {
  const currentIdx = steps.findIndex((s) => s.state === "current");
  const progress =
    currentIdx >= 0 ? ((currentIdx + 0.5) / steps.length) * 100 : 100;

  return (
    <div className="space-y-8">
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.key}
            className={cn(
              "relative rounded-xl border p-4 transition-all",
              step.state === "done" && "border-primary/30 bg-primary/5",
              step.state === "current" && "border-primary ring-2 ring-primary/20 shadow-md",
              step.state === "upcoming" && "border-border opacity-60"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                  step.state === "done" && "bg-primary text-primary-foreground",
                  step.state === "current" && "bg-primary text-primary-foreground animate-pulse",
                  step.state === "upcoming" && "bg-muted text-muted-foreground"
                )}
              >
                {step.state === "done" ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className="text-xs text-muted-foreground">Langkah {i + 1}</span>
            </div>
            <p className="text-sm font-medium">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
