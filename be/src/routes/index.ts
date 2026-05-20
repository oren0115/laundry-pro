import { Router } from "express";
import authRoutes from "./auth.routes.js";
import orderRoutes from "./order.routes.js";
import customerRoutes from "./customer.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import branchRoutes from "./branch.routes.js";
import serviceRoutes from "./service.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import employeeRoutes from "./employee.routes.js";
import pickupRoutes from "./pickup.routes.js";
import reportRoutes from "./report.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/branches", branchRoutes);
router.use("/services", serviceRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/employees", employeeRoutes);
router.use("/pickups", pickupRoutes);
router.use("/reports", reportRoutes);
router.use("/users", userRoutes);

export default router;
