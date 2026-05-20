import { Router } from "express";
import * as publicCtrl from "../controllers/public.controller.js";

const router = Router();
router.get("/content", publicCtrl.getContent);
export default router;
