import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { NAV_LINKS } from "@/data/public-content";
import { usePublicContent } from "@/contexts/PublicContentContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/authStore";

function NavItem({
  label,
  hash,
  to,
  onNavigate,
}: {
  label: string;
  hash: string;
  to: string;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const currentHash = location.hash.replace(/^#/, "");

  const active = hash
    ? isHome && currentHash === hash
    : to === "/"
      ? isHome && !currentHash
      : location.pathname === to;

  const handleClick = (e: React.MouseEvent) => {
    if (to === "/" && !hash) {
      e.preventDefault();
      navigate({ pathname: "/" });
      if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
      onNavigate?.();
      return;
    }

    if (hash && to === "/") {
      e.preventDefault();
      navigate({ pathname: "/", hash }, { replace: isHome });
      onNavigate?.();
      return;
    }

    onNavigate?.();
  };

  const href = hash && to === "/" ? `/#${hash}` : to;

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "block rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:inline-block lg:py-2",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {label}
    </a>
  );
}

export function PublicNavbar() {
  const { content } = usePublicContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useAuthStore((s) => s.user);
  const dashboardTo = user?.role === "CUSTOMER" ? "/tracking" : "/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight outline-none transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden sm:inline">{content.site.name}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.label} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <Button size="sm" className="rounded-xl" render={<Link to={dashboardTo} />}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden rounded-xl sm:inline-flex"
                render={<Link to="/cek-status" />}
              >
                <Search className="size-4" />
                Cek Status
              </Button>
              <Button size="sm" className="hidden rounded-xl sm:inline-flex" render={<Link to="/register" />}>
                Mulai Laundry
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <nav className="min-h-0 space-y-1 bg-background/95 px-4 py-4 backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.label} {...link} onNavigate={() => setOpen(false)} />
          ))}
          {!user && (
            <div className="flex flex-col gap-2 border-t pt-4">
              <Button className="rounded-xl" render={<Link to="/register" onClick={() => setOpen(false)} />}>
                Mulai Laundry
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                render={<Link to="/cek-status" onClick={() => setOpen(false)} />}
              >
                Cek Status
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
