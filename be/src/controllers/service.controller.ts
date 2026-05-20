import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function listServices(_req: AuthRequest, res: Response) {
  const services = await prisma.service.findMany({ where: { isActive: true } });
  return success(res, services);
}
