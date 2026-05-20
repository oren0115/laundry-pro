import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt.js";
import { error } from "../utils/apiResponse.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
    branchId?: string | null;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return error(res, "Token tidak ditemukan", 401);
  }
  try {
    const token = header.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return error(res, "Token tidak valid atau kedaluwarsa", 401);
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return error(res, "Unauthorized", 401);
    if (roles.length && !roles.includes(req.user.role)) {
      return error(res, "Akses ditolak", 403);
    }
    next();
  };
}

export const staffRoles: Role[] = ["OWNER", "ADMIN", "KASIR", "OPERATOR", "KURIR"];
export const adminRoles: Role[] = ["OWNER", "ADMIN"];
