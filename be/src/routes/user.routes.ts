import { Router } from "express";
import * as user from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/audit-logs", authenticate, authorize("OWNER", "ADMIN"), user.getAuditLogs);
router.get("/login-history", authenticate, user.getLoginHistory);
export default router;
