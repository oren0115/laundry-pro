import { useEffect } from "react";
import { BRAND_FULL_NAME } from "@/lib/brand";

export function usePageMeta({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  useEffect(() => {
    const base = BRAND_FULL_NAME;
    document.title = title ? `${title} | ${base}` : base;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
