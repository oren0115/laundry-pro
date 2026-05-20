import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function getAuditLogs(req: AuthRequest, res: Response) {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
  return success(res, logs);
}

export async function getLoginHistory(req: AuthRequest, res: Response) {
  const logs = await prisma.loginHistory.findMany({
    where: { userId: req.user!.userId },
    take: 20,
    orderBy: { createdAt: "desc" },
  });
  return success(res, logs);
}
