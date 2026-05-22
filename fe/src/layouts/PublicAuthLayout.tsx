import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { SITE } from "@/data/public-content";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";

export function PublicAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-muted/30">
      <div className="absolute inset-0 bg-background/40" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          {SITE.name}
        </Link>
        <ThemeToggle />
      </header>
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        {children}
      </div>
      <WhatsAppFloat />
    </div>
  );
}
