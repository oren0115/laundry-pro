import axios from "axios";
import { api } from "@/lib/api";
import type { PublicContentData } from "@/types/public-content";

export async function fetchCmsContent() {
  const { data } = await api.get<{ success: boolean; data: PublicContentData }>("/cms/content");
  return data.data;
}

export async function saveCmsContent(payload: PublicContentData) {
  const { data } = await api.put<{ success: boolean; data: PublicContentData }>(
    "/cms/content",
    payload
  );
  return data.data;
}

export async function uploadCmsImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);
  const { data } = await api.post<{ success: boolean; data: { url: string } }>(
    "/cms/upload",
    form
  );
  return data.data.url;
}

export function getUploadErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
    const msg = (err.response.data as { message?: string }).message;
    if (msg) return msg;
  }
  return "Gagal mengunggah gambar";
}
