import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success, error } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { param } from "../utils/params.js";

export async function listInventory(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId;
  const items = await prisma.inventory.findMany({
    where: branchId ? { branchId } : {},
    orderBy: { name: "asc" },
  });
  const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.minStock));
  return success(res, { items, lowStock, lowStockCount: lowStock.length });
}

export async function createInventory(req: AuthRequest, res: Response) {
  const branchId = req.body.branchId ?? req.user!.branchId;
  if (!branchId) return error(res, "Cabang wajib", 400);
  const item = await prisma.inventory.create({ data: { ...req.body, branchId } });
  return success(res, item, "Stok ditambahkan", 201);
}

export async function updateInventory(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const item = await prisma.inventory.update({ where: { id }, data: req.body });
  return success(res, item);
}

export async function adjustStock(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const { delta } = req.body as { delta: number };
  const current = await prisma.inventory.findUnique({ where: { id } });
  if (!current) return error(res, "Item tidak ditemukan", 404);
  const newQty = Math.max(0, Number(current.quantity) + delta);
  const item = await prisma.inventory.update({
    where: { id },
    data: { quantity: newQty },
  });
  return success(res, item);
}
