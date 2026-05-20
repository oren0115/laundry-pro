import { Router } from "express";
import * as branch from "../controllers/branch.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticate, authorize("OWNER"), branch.listBranches);
router.get("/:id/stats", authenticate, authorize("OWNER"), branch.getBranchStats);
router.post("/", authenticate, authorize("OWNER"), branch.createBranch);
router.put("/:id", authenticate, authorize("OWNER"), branch.updateBranch);
router.delete("/:id", authenticate, authorize("OWNER"), branch.deleteBranch);
export default router;
