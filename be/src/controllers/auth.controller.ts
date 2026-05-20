import type { Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { success, error } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email, deletedAt: null } });
  if (!user || !user.isActive) {
    await logLogin(null, email, false, req.ip, req.get("user-agent"));
    return error(res, "Email atau password salah", 401);
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    await logLogin(user.id, email, false, req.ip, req.get("user-agent"));
    return error(res, "Email atau password salah", 401);
  }
  await logLogin(user.id, email, true, req.ip, req.get("user-agent"));
  const tokens = await issueTokens(user);
  const { password: _, ...safe } = user;
  return success(res, { user: safe, ...tokens }, "Login berhasil");
}

export async function register(req: AuthRequest, res: Response) {
  const { name, email, password, phone, address, branchId } = req.body as {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    branchId?: string;
  };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return error(res, "Email sudah terdaftar", 409);

  const branch = branchId
    ? await prisma.branch.findFirst({ where: { id: branchId, isActive: true } })
    : await prisma.branch.findFirst({ where: { isActive: true } });
  if (!branch) return error(res, "Cabang tidak ditemukan", 404);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      phone,
      role: "CUSTOMER",
      branchId: branch.id,
      customer: {
        create: {
          name,
          phone,
          email,
          address,
          branchId: branch.id,
        },
      },
    },
    include: { customer: true },
  });
  const tokens = await issueTokens(user);
  const { password: _, ...safe } = user;
  return success(res, { user: safe, ...tokens }, "Registrasi berhasil", 201);
}

export async function refresh(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body as { refreshToken: string };
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });
  if (!stored || stored.expiresAt < new Date()) {
    return error(res, "Refresh token tidak valid", 401);
  }
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const tokens = await issueTokens(stored.user);
  return success(res, tokens, "Token diperbarui");
}

export async function logout(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  return success(res, null, "Logout berhasil");
}

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      branchId: true,
      branch: { select: { id: true, name: true } },
      customer: true,
      employee: true,
    },
  });
  if (!user) return error(res, "User tidak ditemukan", 404);
  return success(res, user);
}

export async function forgotPassword(req: AuthRequest, res: Response) {
  const { email } = req.body as { email: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return success(res, null, "Jika email terdaftar, link reset akan dikirim");
  const token = uuidv4();
  await prisma.passwordReset.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });
  return success(res, { resetToken: token }, "Token reset dibuat (dev mode)");
}

export async function resetPassword(req: AuthRequest, res: Response) {
  const { token, password } = req.body as { token: string; password: string };
  const reset = await prisma.passwordReset.findFirst({
    where: { token, used: false, expiresAt: { gt: new Date() } },
  });
  if (!reset) return error(res, "Token reset tidak valid", 400);
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email: reset.email }, data: { password: hashed } });
  await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
  return success(res, null, "Password berhasil diubah");
}

async function issueTokens(user: { id: string; email: string; role: import("@prisma/client").Role; branchId: string | null }) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    branchId: user.branchId,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });
  return { accessToken, refreshToken };
}

async function logLogin(
  userId: string | null,
  email: string,
  successFlag: boolean,
  ip?: string,
  userAgent?: string
) {
  if (userId) {
    await prisma.loginHistory.create({
      data: { userId, ip, userAgent, success: successFlag },
    });
  }
}
