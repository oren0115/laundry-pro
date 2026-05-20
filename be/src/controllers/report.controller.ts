import type { Response } from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { prisma } from "../lib/prisma.js";
import { success } from "../utils/apiResponse.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function financialReport(req: AuthRequest, res: Response) {
  const { from, to, branchId } = req.query as { from?: string; to?: string; branchId?: string };
  const start = from ? new Date(from) : new Date(new Date().setDate(1));
  const end = to ? new Date(to) : new Date();
  const bid = branchId || req.user!.branchId;

  const orderWhere = {
    deletedAt: null,
    createdAt: { gte: start, lte: end },
    ...(bid ? { branchId: bid } : {}),
  };

  const [revenue, expenses, orders] = await Promise.all([
    prisma.order.aggregate({
      where: { ...orderWhere, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.expense.aggregate({
      where: { date: { gte: start, lte: end }, ...(bid ? { branchId: bid } : {}) },
      _sum: { amount: true },
    }),
    prisma.order.count({ where: orderWhere }),
  ]);

  const totalRevenue = Number(revenue._sum.total ?? 0);
  const totalExpense = Number(expenses._sum.amount ?? 0);

  return success(res, {
    period: { from: start, to: end },
    orders,
    totalRevenue,
    totalExpense,
    profit: totalRevenue - totalExpense,
  });
}

export async function exportOrdersPdf(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId;
  const orders = await prisma.order.findMany({
    where: { ...(branchId ? { branchId } : {}), deletedAt: null },
    include: { customer: true, service: true },
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=laporan-order.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Laporan Order Laundry", { align: "center" });
  doc.moveDown();
  orders.forEach((o) => {
    doc.fontSize(10).text(
      `${o.orderNumber} | ${o.customer.name} | ${o.status} | Rp ${Number(o.total).toLocaleString("id-ID")}`
    );
  });
  doc.end();
}

export async function exportOrdersExcel(req: AuthRequest, res: Response) {
  const branchId = (req.query.branchId as string) || req.user!.branchId;
  const orders = await prisma.order.findMany({
    where: { ...(branchId ? { branchId } : {}), deletedAt: null },
    include: { customer: true, service: true },
    take: 500,
    orderBy: { createdAt: "desc" },
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Orders");
  ws.columns = [
    { header: "No Order", key: "orderNumber", width: 15 },
    { header: "Pelanggan", key: "customer", width: 20 },
    { header: "Layanan", key: "service", width: 15 },
    { header: "Status", key: "status", width: 12 },
    { header: "Total", key: "total", width: 12 },
    { header: "Tanggal", key: "date", width: 15 },
  ];
  orders.forEach((o) => {
    ws.addRow({
      orderNumber: o.orderNumber,
      customer: o.customer.name,
      service: o.service.name,
      status: o.status,
      total: Number(o.total),
      date: o.createdAt.toISOString().slice(0, 10),
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=laporan-order.xlsx");
  await wb.xlsx.write(res);
}

export async function createExpense(req: AuthRequest, res: Response) {
  const branchId = req.body.branchId ?? req.user!.branchId;
  const expense = await prisma.expense.create({ data: { ...req.body, branchId } });
  return success(res, expense, "Pengeluaran dicatat", 201);
}
