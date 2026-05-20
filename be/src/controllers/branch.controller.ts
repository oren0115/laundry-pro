import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success, error } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { param } from "../utils/params.js";

export async function listBranches(_req: AuthRequest, res: Response) {
  const branches = await prisma.branch.findMany({
    where: { deletedAt: null, isActive: true },
    include: {
      _count: { select: { orders: true, users: true, customers: true } },
    },
  });
  return success(res, branches);
}

export async function getBranchStats(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const branch = await prisma.branch.findFirst({ where: { id, deletedAt: null } });
  if (!branch) return error(res, "Cabang tidak ditemukan", 404);

  const [orders, revenue, employees, customers] = await Promise.all([
    prisma.order.count({ where: { branchId: id, deletedAt: null } }),
    prisma.order.aggregate({
      where: { branchId: id, paymentStatus: "PAID", deletedAt: null },
      _sum: { total: true },
    }),
    prisma.employee.count({ where: { branchId: id } }),
    prisma.customer.count({ where: { branchId: id, deletedAt: null } }),
  ]);

  return success(res, {
    branch,
    stats: {
      orders,
      revenue: Number(revenue._sum?.total ?? 0),
      employees,
      customers,
    },
  });
}

export async function createBranch(req: AuthRequest, res: Response) {
  const { name, address, phone } = req.body as { name: string; address: string; phone?: string };
  const branch = await prisma.branch.create({ data: { name, address, phone } });
  return success(res, branch, "Cabang ditambahkan", 201);
}

export async function updateBranch(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const branch = await prisma.branch.update({ where: { id }, data: req.body });
  return success(res, branch);
}

export async function deleteBranch(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const branch = await prisma.branch.findFirst({ where: { id, deletedAt: null } });
  if (!branch) return error(res, "Cabang tidak ditemukan", 404);

  const deleted = await prisma.branch.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });
  return success(res, deleted, "Cabang dihapus");
}
