import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, authorize(...staffRoles, "OWNER"), getDashboard);
export default router;
