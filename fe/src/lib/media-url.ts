/** URL untuk preview/tampilan gambar (upload lokal atau eksternal). */
export function mediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `/api/uploads/public/${src.replace(/^\/+/, "")}`;
}
