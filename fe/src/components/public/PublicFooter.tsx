import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone, Share2, Sparkles } from "lucide-react";
import { FOOTER_LINKS } from "@/data/public-content";
import { usePublicContent } from "@/contexts/PublicContentContext";

export function PublicFooter() {
  const { content } = usePublicContent();
  const { site } = content;

  return (
    <footer id="kontak" className="relative scroll-mt-24 border-t bg-muted/20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2.5 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            {site.name}
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{site.tagline}</p>
          <div className="flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-xl border border-border/80 text-muted-foreground outline-none transition-all hover:border-primary/30 hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              aria-label="Instagram"
            >
              <Share2 className="size-4" />
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex size-10 items-center justify-center rounded-xl border border-border/80 text-muted-foreground outline-none transition-all hover:border-primary/30 hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Navigasi</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="rounded-md outline-none transition-colors hover:text-foreground focus:outline-none focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-semibold">Kontak</h3>
          <p className="flex gap-2.5 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {site.address}
          </p>
          <p className="flex gap-2.5 text-muted-foreground">
            <Phone className="size-4 shrink-0 text-primary" />
            +{site.phone}
          </p>
          <p className="flex gap-2.5 text-muted-foreground">
            <Mail className="size-4 shrink-0 text-primary" />
            {site.email}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-semibold">Jam Operasional</h3>
          <p className="flex gap-2.5 text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" />
            {site.hours}
          </p>
          <p className="text-xs text-muted-foreground">Support chat 24/7 via WhatsApp</p>
          <Link
            to="/register"
            className="inline-flex text-sm font-medium text-primary transition-colors hover:underline"
          >
            Daftar member →
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}. Semua hak dilindungi.
      </div>
    </footer>
  );
}
