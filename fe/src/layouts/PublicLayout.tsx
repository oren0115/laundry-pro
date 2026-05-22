import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PublicContentProvider } from "@/contexts/PublicContentContext";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";

export function PublicLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = hash.replace("#", "");
    if (!id || pathname !== "/") return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return (
    <PublicContentProvider>
      <div className="flex min-h-svh flex-col">
        <PublicNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
        <WhatsAppFloat />
      </div>
    </PublicContentProvider>
  );
}
