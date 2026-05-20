import { Router } from "express";
import * as report from "../controllers/report.controller.js";
import { authenticate, authorize, staffRoles } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/financial", authenticate, authorize("OWNER", "ADMIN"), report.financialReport);
router.get("/export/pdf", authenticate, authorize(...staffRoles), report.exportOrdersPdf);
router.get("/export/excel", authenticate, authorize(...staffRoles), report.exportOrdersExcel);
router.post("/expenses", authenticate, authorize("OWNER", "ADMIN"), report.createExpense);
export default router;
