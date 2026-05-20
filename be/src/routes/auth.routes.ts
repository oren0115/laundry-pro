import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  loginSchema,
  registerSchema,
  refreshSchema,
  forgotSchema,
  resetSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginSchema), auth.login);
router.post("/register", validate(registerSchema), auth.register);
router.post("/refresh", validate(refreshSchema), auth.refresh);
router.post("/logout", auth.logout);
router.post("/forgot-password", validate(forgotSchema), auth.forgotPassword);
router.post("/reset-password", validate(resetSchema), auth.resetPassword);
router.get("/me", authenticate, auth.me);

export default router;
