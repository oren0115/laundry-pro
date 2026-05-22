import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 overflow-hidden sm:h-20", className)} aria-hidden>
      <svg
        className="absolute bottom-0 w-full text-background"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,32 C360,80 720,0 1080,40 C1260,56 1380,48 1440,32 L1440,80 L0,80 Z" />
      </svg>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
