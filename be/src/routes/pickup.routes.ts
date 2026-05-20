import { Router } from "express";
import * as pickup from "../controllers/pickup.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, authorize(...staffRoles, "CUSTOMER", "KURIR"), pickup.listPickups);
router.post("/request", authenticate, pickup.requestPickup);
router.patch("/:id/assign", authenticate, authorize("OWNER", "ADMIN", "KASIR"), pickup.assignCourier);
router.patch("/:id/status", authenticate, authorize("KURIR", "ADMIN", "OWNER"), pickup.updatePickupStatus);
export default router;
