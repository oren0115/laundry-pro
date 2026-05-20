import type { Response } from "express";
import QRCode from "qrcode";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { success, error, paginated } from "../utils/apiResponse.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { calculateOrderTotal, estimateFinishDate } from "../utils/pricing.js";
import { sendWhatsApp, waTemplates } from "../services/whatsapp.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { ValidatedRequest } from "../middleware/validate.middleware.js";
import { getIO } from "../socket/index.js";
import { param } from "../utils/params.js";

const STATUS_FLOW: OrderStatus[] = [
  "DITERIMA",
  "DICUCI",
  "DIKERINGKAN",
  "DISETRIKA",
  "PACKING",
  "SELESAI",
  "DIAMBIL",
];

export async function listOrders(req: AuthRequest, res: Response) {
  const { page, limit, search, status, branchId, customerId } = (req as ValidatedRequest).validated!
    .query as {
    page: number;
    limit: number;
    search?: string;
    status?: OrderStatus;
    branchId?: string;
    customerId?: string;
  };

  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (customerId) where.customerId = customerId;
  if (branchId) where.branchId = branchId;
  else if (req.user!.branchId && req.user!.role !== "OWNER") {
    where.branchId = req.user!.branchId;
  }
  if (req.user!.role === "CUSTOMER") {
    const cust = await prisma.customer.findFirst({ where: { userId: req.user!.userId } });
    if (!cust) return paginated(res, [], { page, limit, total: 0, totalPages: 0 });
    where.customerId = cust.id;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        service: true,
        branch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return paginated(res, orders, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getOrder(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      service: true,
      branch: true,
      statusLogs: { orderBy: { createdAt: "asc" }, include: { updater: { select: { name: true } } } },
      createdBy: { select: { name: true } },
    },
  });
  if (!order) return error(res, "Order tidak ditemukan", 404);
  if (req.user!.role === "CUSTOMER") {
    const cust = await prisma.customer.findFirst({ where: { userId: req.user!.userId } });
    if (cust?.id !== order.customerId) return error(res, "Akses ditolak", 403);
  }
  const qrImage = await QRCode.toDataURL(order.qrCode);
  return success(res, { ...order, qrImage });
}

export async function getByQr(req: AuthRequest, res: Response) {
  const qrCode = param(req.params.qrCode);
  const order = await prisma.order.findFirst({
    where: { qrCode, deletedAt: null },
    include: {
      customer: { select: { name: true, phone: true } },
      service: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) return error(res, "Order tidak ditemukan", 404);
  return success(res, order);
}

export async function createOrder(req: AuthRequest, res: Response) {
  const body = req.body as {
    customerId: string;
    serviceId: string;
    branchId?: string;
    serviceType: import("@prisma/client").ServiceType;
    weight?: number;
    itemCount?: number;
    notes?: string;
    paymentMethod?: import("@prisma/client").PaymentMethod;
  };

  const [customer, service] = await Promise.all([
    prisma.customer.findFirst({ where: { id: body.customerId, deletedAt: null } }),
    prisma.service.findFirst({ where: { id: body.serviceId, isActive: true } }),
  ]);
  if (!customer) return error(res, "Pelanggan tidak ditemukan", 404);
  if (!service) return error(res, "Layanan tidak ditemukan", 404);

  const branchId = body.branchId ?? req.user!.branchId ?? customer.branchId;
  const isWeekend = [0, 6].includes(new Date().getDay());
  const pricing = calculateOrderTotal({
    serviceType: body.serviceType,
    basePrice: Number(service.basePrice),
    pricePerKg: service.pricePerKg ? Number(service.pricePerKg) : null,
    expressPct: Number(service.expressPct),
    weight: body.weight,
    itemCount: body.itemCount,
    membershipLevel: customer.membershipLevel,
    isWeekend,
  });

  const orderNumber = generateOrderNumber();
  const qrCode = `LD-${orderNumber}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      qrCode,
      branchId,
      customerId: customer.id,
      serviceId: service.id,
      createdById: req.user?.userId,
      serviceType: body.serviceType,
      weight: body.weight,
      itemCount: body.itemCount,
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      surcharge: pricing.surcharge,
      total: pricing.total,
      notes: body.notes,
      paymentMethod: body.paymentMethod ?? "CASH",
      estimatedFinish: estimateFinishDate(body.serviceType),
      statusLogs: { create: { status: "DITERIMA", updatedBy: req.user?.userId } },
    },
    include: { customer: true, service: true, branch: true },
  });

  const points = Math.floor(Number(pricing.total) / 10000);
  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      points: { increment: points },
      totalSpent: { increment: pricing.total },
    },
  });

  await sendWhatsApp(customer.phone, waTemplates.orderReceived(customer.name, orderNumber));
  getIO()?.emit("order:created", { branchId, order });
  getIO()?.to(`order:${order.id}`).emit("order:updated", order);

  const qrImage = await QRCode.toDataURL(qrCode);
  return success(res, { ...order, qrImage }, "Order berhasil dibuat", 201);
}

export async function updateStatus(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  const { status, note, paymentStatus } = req.body as {
    status: OrderStatus;
    note?: string;
    paymentStatus?: import("@prisma/client").PaymentStatus;
  };

  const order = await prisma.order.findFirst({ where: { id, deletedAt: null }, include: { customer: true } });
  if (!order) return error(res, "Order tidak ditemukan", 404);

  const updateData: Record<string, unknown> = { status };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (status === "SELESAI") updateData.finishedAt = new Date();
  if (status === "DIAMBIL") {
    updateData.pickedUpAt = new Date();
    updateData.paymentStatus = paymentStatus ?? "PAID";
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...updateData,
      statusLogs: { create: { status, note, updatedBy: req.user?.userId } },
    },
    include: { customer: true, service: true, statusLogs: { orderBy: { createdAt: "asc" } } },
  });

  if (status === "SELESAI") {
    await sendWhatsApp(
      order.customer.phone,
      waTemplates.orderComplete(order.customer.name, order.orderNumber)
    );
  }

  getIO()?.emit("order:status", { branchId: order.branchId, orderId: id, status, order: updated });
  getIO()?.to(`order:${id}`).emit("order:updated", updated);

  return success(res, updated, "Status order diperbarui");
}

export async function deleteOrder(req: AuthRequest, res: Response) {
  const id = param(req.params.id);
  await prisma.order.update({ where: { id }, data: { deletedAt: new Date() } });
  return success(res, null, "Order dihapus");
}

export async function getStatusFlow(_req: AuthRequest, res: Response) {
  return success(res, STATUS_FLOW);
}
