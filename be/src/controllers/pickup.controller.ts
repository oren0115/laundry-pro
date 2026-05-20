import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success, error } from "../utils/apiResponse.js";
import { sendWhatsApp, waTemplates } from "../services/whatsapp.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { getIO } from "../socket/index.js";
import { param } from "../utils/params.js";

export async function listPickups(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId;
  const pickups = await prisma.pickupDelivery.findMany({
    where: branchId ? { branchId } : {},
    include: {
      customer: { select: { name: true, phone: true } },
      courier: { select: { name: true, phone: true } },
      order: { select: { orderNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return success(res, pickups);
}

export async function requestPickup(req: AuthRequest, res: Response) {
  const { customerId, pickupAddress, deliveryAddress, scheduledAt, orderId } = req.body as {
    customerId: string;
    pickupAddress: string;
    deliveryAddress?: string;
    scheduledAt?: string;
    orderId?: string;
  };
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) return error(res, "Pelanggan tidak ditemukan", 404);

  const baseFee = 15000;
  const distanceFee = deliveryAddress ? 10000 : 0;

  const pickup = await prisma.pickupDelivery.create({
    data: {
      customerId,
      branchId: customer.branchId,
      orderId,
      pickupAddress,
      deliveryAddress,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      shippingFee: baseFee + distanceFee,
      status: "REQUESTED",
    },
    include: { customer: true },
  });

  await sendWhatsApp(customer.phone, waTemplates.pickupAssigned(customer.name));
  getIO()?.emit("pickup:created", pickup);
  return success(res, pickup, "Request pickup dibuat", 201);
}

export async function assignCourier(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const { courierId } = req.body as { courierId: string };
  const pickup = await prisma.pickupDelivery.update({
    where: { id },
    data: { courierId, status: "ASSIGNED" },
    include: { customer: true, courier: true },
  });
  getIO()?.emit("pickup:updated", pickup);
  return success(res, pickup);
}

export async function updatePickupStatus(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const { status } = req.body as { status: import("@prisma/client").PickupStatus };
  const pickup = await prisma.pickupDelivery.update({
    where: { id },
    data: { status },
    include: { customer: true, courier: true },
  });
  getIO()?.emit("pickup:updated", pickup);
  return success(res, pickup);
}
