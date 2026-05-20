import { Router } from "express";
import { listServices } from "../controllers/service.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, listServices);
export default router;
