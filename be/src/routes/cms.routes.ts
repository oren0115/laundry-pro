import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import * as cms from "../controllers/cms.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { uploadPublicImage } from "../middleware/upload.middleware.js";
import { error } from "../utils/apiResponse.js";

const router = Router();

router.use(authenticate, authorize("OWNER"));

router.get("/content", cms.getCmsContent);
router.put("/content", cms.updateCmsContent);

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  uploadPublicImage.single("file")(req, res, (err: unknown) => {
    if (err) {
      const msg =
        err instanceof Error
          ? err.message.includes("File too large")
            ? "Ukuran file maksimal 5 MB"
            : err.message
          : "Gagal mengunggah file";
      return error(res, msg, 400);
    }
    next();
  });
}, cms.uploadImage);

export default router;
