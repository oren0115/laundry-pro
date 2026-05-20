import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuid } from "uuid";

const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "public");

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".jpe", ".jfif", ".png", ".webp", ".gif"]);

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext || ext === ".") {
      const mime = (file.mimetype || "").toLowerCase();
      if (mime.includes("png")) ext = ".png";
      else if (mime.includes("webp")) ext = ".webp";
      else if (mime.includes("gif")) ext = ".gif";
      else ext = ".jpg";
    }
    if (!ALLOWED_EXT.has(ext)) ext = ".jpg";
    cb(null, `${uuid()}${ext}`);
  },
});

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  const extOk = ALLOWED_EXT.has(ext);
  const mimeOk =
    /^image\/(jpeg|jpg|jpe|png|webp|gif|pjpeg|x-png)$/i.test(mime) ||
    mime === "application/octet-stream";

  if (extOk || mimeOk) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF (bukan SVG/HEIC)."
    )
  );
};

export const uploadPublicImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export function publicUploadUrl(filename: string) {
  return `/api/uploads/public/${filename}`;
}
