import { Router } from "express";
import * as order from "../controllers/order.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderSchema,
  updateStatusSchema,
  listOrderSchema,
  qrLookupSchema,
} from "../validators/order.validator.js";
import { auditLog } from "../middleware/audit.middleware.js";

const router = Router();

router.get("/status-flow", authenticate, order.getStatusFlow);
router.get("/qr/:qrCode", validate(qrLookupSchema), authenticate, order.getByQr);
router.get("/", authenticate, validate(listOrderSchema), order.listOrders);
router.get("/:id", authenticate, order.getOrder);
router.post(
  "/",
  authenticate,
  authorize(...staffRoles, "CUSTOMER"),
  validate(createOrderSchema),
  auditLog("CREATE", "Order"),
  order.createOrder
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(...staffRoles),
  validate(updateStatusSchema),
  auditLog("UPDATE_STATUS", "Order"),
  order.updateStatus
);
router.delete("/:id", authenticate, authorize("OWNER", "ADMIN"), order.deleteOrder);

export default router;
