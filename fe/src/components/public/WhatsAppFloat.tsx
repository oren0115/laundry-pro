import { MessageCircle } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";

export function WhatsAppFloat() {
  const { content } = usePublicContent();
  const { site } = content;
  const url = `https://wa.me/${site.phone}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Hubungi via WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
