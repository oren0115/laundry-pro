import type { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "./auth.middleware.js";

export function auditLog(action: string, entity: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      if (res.statusCode < 400 && req.user) {
        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              entity,
              entityId: (req.params as { id?: string }).id,
              details: { method: req.method, path: req.path },
              ip: req.ip,
            },
          })
          .catch(console.error);
      }
      return originalJson(body);
    };
    next();
  };
}
