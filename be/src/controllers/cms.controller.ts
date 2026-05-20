import type { Response } from "express";
import { getPublicContent, upsertPublicContent } from "../services/publicContent.service.js";
import type { PublicContentData } from "../data/defaultPublicContent.js";
import { success, error } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { publicUploadUrl } from "../middleware/upload.middleware.js";

export async function getCmsContent(_req: AuthRequest, res: Response) {
  const content = await getPublicContent();
  return success(res, content);
}

export async function updateCmsContent(req: AuthRequest, res: Response) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return error(res, "Data konten tidak valid", 400);
  }

  const content = await upsertPublicContent(req.body as PublicContentData, req.user?.id);
  return success(res, content, "Konten website diperbarui");
}

export async function uploadImage(req: AuthRequest, res: Response) {
  const file = req.file;
  if (!file) {
    return error(
      res,
      "File tidak diterima server. Gunakan JPG/PNG/WebP/GIF (maks. 5 MB) dan pastikan login sebagai Owner.",
      400
    );
  }
  return success(res, { url: publicUploadUrl(file.filename) }, "Gambar diunggah", 201);
}
