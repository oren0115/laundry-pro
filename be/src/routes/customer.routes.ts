import { Router } from "express";
import * as customer from "../controllers/customer.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
  listCustomerSchema,
} from "../validators/customer.validator.js";

const router = Router();

router.get("/", authenticate, validate(listCustomerSchema), customer.listCustomers);
router.get("/:id", authenticate, customer.getCustomer);
router.post(
  "/",
  authenticate,
  authorize(...staffRoles),
  validate(createCustomerSchema),
  customer.createCustomer
);
router.put(
  "/:id",
  authenticate,
  authorize(...staffRoles),
  validate(updateCustomerSchema),
  customer.updateCustomer
);
router.delete("/:id", authenticate, authorize("OWNER", "ADMIN"), customer.deleteCustomer);

export default router;
