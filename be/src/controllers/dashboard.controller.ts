import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { success } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function getDashboard(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId || undefined;
  const where = branchId ? { branchId, deletedAt: null } : { deletedAt: null };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    todayRevenue,
    monthRevenue,
    ordersByStatus,
    ordersByService,
    expressVsReguler,
    last7Days,
  ] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.count({
      where: { ...where, status: { notIn: ["SELESAI", "DIAMBIL"] } },
    }),
    prisma.order.count({ where: { ...where, status: { in: ["SELESAI", "DIAMBIL"] } } }),
    prisma.customer.count({ where: branchId ? { branchId, deletedAt: null } : { deletedAt: null } }),
    prisma.order.aggregate({
      where: { ...where, createdAt: { gte: startOfDay }, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { ...where, createdAt: { gte: startOfMonth }, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.groupBy({ by: ["status"], where, _count: true }),
    prisma.order.groupBy({ by: ["serviceType"], where, _count: true }),
    prisma.order.groupBy({
      by: ["serviceType"],
      where: { ...where, serviceType: { in: ["EXPRESS", "REGULER"] } },
      _count: true,
    }),
    getLast7DaysRevenue(where),
  ]);

  const busyHours = await getBusyHours(where);

  return success(res, {
    summary: {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      todayRevenue: Number(todayRevenue._sum.total ?? 0),
      monthRevenue: Number(monthRevenue._sum.total ?? 0),
    },
    charts: {
      ordersByStatus: ordersByStatus.map((s) => ({
        name: s.status,
        value: s._count,
      })),
      ordersByService: ordersByService.map((s) => ({
        name: s.serviceType,
        value: s._count,
      })),
      expressVsReguler: expressVsReguler.map((s) => ({
        name: s.serviceType,
        value: s._count,
      })),
      revenueTrend: last7Days,
      busyHours,
    },
  });
}

async function getLast7DaysRevenue(where: Record<string, unknown>) {
  const days: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const [agg, count] = await Promise.all([
      prisma.order.aggregate({
        where: {
          ...where,
          createdAt: { gte: start, lt: end },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { ...where, createdAt: { gte: start, lt: end } },
      }),
    ]);
    days.push({
      date: start.toISOString().slice(0, 10),
      revenue: Number(agg._sum.total ?? 0),
      orders: count,
    });
  }
  return days;
}

async function getBusyHours(where: Record<string, unknown>) {
  const orders = await prisma.order.findMany({
    where,
    select: { createdAt: true },
    take: 500,
    orderBy: { createdAt: "desc" },
  });
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, count: 0 }));
  orders.forEach((o) => {
    const h = o.createdAt.getHours();
    hours[h].count++;
  });
  return hours.filter((h) => h.count > 0);
}
