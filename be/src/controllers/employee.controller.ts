import type { Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { success, error } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { param } from "../utils/params.js";

export async function listEmployees(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId;
  const employees = await prisma.employee.findMany({
    where: branchId ? { branchId } : {},
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true, isActive: true } },
      branch: { select: { name: true } },
      shifts: true,
    },
  });
  return success(res, employees);
}

export async function createEmployee(req: AuthRequest, res: Response) {
  const { name, email, password, phone, role, branchId, position, salary } = req.body as {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: import("@prisma/client").Role;
    branchId: string;
    position: string;
    salary?: number;
  };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return error(res, "Email sudah digunakan", 409);
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      phone,
      role,
      branchId,
      employee: { create: { branchId, position, salary } },
    },
    include: { employee: true },
  });
  const { password: _, ...safe } = user;
  return success(res, safe, "Karyawan ditambahkan", 201);
}

export async function updateEmployee(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!employee) return error(res, "Karyawan tidak ditemukan", 404);

  const { name, email, password, phone, role, branchId, position, salary, isActive } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    role?: import("@prisma/client").Role;
    branchId?: string;
    position?: string;
    salary?: number | null;
    isActive?: boolean;
  };

  if (email && email !== employee.user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return error(res, "Email sudah digunakan", 409);
  }

  const hashed = password ? await bcrypt.hash(password, 10) : undefined;
  const updated = await prisma.employee.update({
    where: { id },
    data: {
      position,
      salary,
      branch: branchId ? { connect: { id: branchId } } : undefined,
      user: {
        update: {
          name,
          email,
          phone,
          role,
          branchId,
          isActive,
          ...(hashed ? { password: hashed } : {}),
        },
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true, isActive: true } },
      branch: { select: { name: true } },
      shifts: true,
    },
  });
  return success(res, updated, "Karyawan diperbarui");
}

export async function deleteEmployee(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) return error(res, "Karyawan tidak ditemukan", 404);

  await prisma.$transaction([
    prisma.employee.delete({ where: { id } }),
    prisma.user.update({
      where: { id: employee.userId },
      data: { isActive: false, deletedAt: new Date() },
    }),
  ]);

  return success(res, null, "Karyawan dihapus");
}

export async function recordAttendance(req: AuthRequest, res: Response) {
  const { employeeId, checkIn, checkOut } = req.body as {
    employeeId: string;
    checkIn?: string;
    checkOut?: string;
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const att = await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date: today } },
    create: {
      employeeId,
      date: today,
      checkIn: checkIn ? new Date(checkIn) : new Date(),
      checkOut: checkOut ? new Date(checkOut) : undefined,
    },
    update: {
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
    },
  });
  return success(res, att);
}

export async function operatorPerformance(req: AuthRequest, res: Response) {
  const operators = await prisma.user.findMany({
    where: { role: "OPERATOR", isActive: true },
    select: {
      id: true,
      name: true,
      _count: { select: { statusUpdates: true } },
    },
    orderBy: { statusUpdates: { _count: "desc" } },
    take: 10,
  });
  return success(res, operators);
}
