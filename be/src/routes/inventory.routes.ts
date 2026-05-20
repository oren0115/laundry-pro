import { Router } from "express";
import * as inv from "../controllers/inventory.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, authorize(...staffRoles), inv.listInventory);
router.post("/", authenticate, authorize("OWNER", "ADMIN"), inv.createInventory);
router.put("/:id", authenticate, authorize("OWNER", "ADMIN"), inv.updateInventory);
router.patch("/:id/adjust", authenticate, authorize("OWNER", "ADMIN", "OPERATOR"), inv.adjustStock);
export default router;
