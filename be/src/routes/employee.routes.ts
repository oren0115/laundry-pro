import { Router } from "express";
import * as emp from "../controllers/employee.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, authorize("OWNER", "ADMIN"), emp.listEmployees);
router.get("/performance", authenticate, authorize("OWNER", "ADMIN"), emp.operatorPerformance);
router.post("/", authenticate, authorize("OWNER", "ADMIN"), emp.createEmployee);
router.put("/:id", authenticate, authorize("OWNER", "ADMIN"), emp.updateEmployee);
router.delete("/:id", authenticate, authorize("OWNER", "ADMIN"), emp.deleteEmployee);
router.post("/attendance", authenticate, emp.recordAttendance);
export default router;
