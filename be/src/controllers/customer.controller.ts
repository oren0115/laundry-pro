import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success, error, paginated } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { ValidatedRequest } from "../middleware/validate.middleware.js";
import { param } from "../utils/params.js";

export async function listCustomers(req: AuthRequest, res: Response) {
  const { page, limit, search, branchId, membershipLevel } = (req as ValidatedRequest).validated!
    .query as {
    page: number;
    limit: number;
    search?: string;
    branchId?: string;
    membershipLevel?: string;
  };

  const where: Record<string, unknown> = { deletedAt: null };
  if (branchId) where.branchId = branchId;
  else if (req.user!.branchId && req.user!.role !== "OWNER") where.branchId = req.user!.branchId;
  if (membershipLevel) where.membershipLevel = membershipLevel;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return paginated(res, customers, { page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function getCustomer(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const customer = await prisma.customer.findFirst({
    where: { id, deletedAt: null },
    include: {
      orders: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { service: true },
      },
    },
  });
  if (!customer) return error(res, "Pelanggan tidak ditemukan", 404);
  return success(res, customer);
}

export async function createCustomer(req: AuthRequest, res: Response) {
  const body = req.body as {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    branchId?: string;
    membershipLevel?: import("@prisma/client").MembershipLevel;
  };
  const branchId = body.branchId ?? req.user!.branchId;
  if (!branchId) return error(res, "Cabang wajib dipilih", 400);

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      branchId,
      membershipLevel: body.membershipLevel ?? "BRONZE",
    },
  });
  return success(res, customer, "Pelanggan ditambahkan", 201);
}

export async function updateCustomer(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const customer = await prisma.customer.update({
    where: { id },
    data: req.body,
  });
  return success(res, customer, "Pelanggan diperbarui");
}

export async function deleteCustomer(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  return success(res, null, "Pelanggan dihapus");
}
