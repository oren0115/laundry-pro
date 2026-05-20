import { z } from "zod";

const serviceTypes = ["REGULER", "EXPRESS", "SATUAN", "KILOAN"] as const;
const orderStatuses = [
  "DITERIMA",
  "DICUCI",
  "DIKERINGKAN",
  "DISETRIKA",
  "PACKING",
  "SELESAI",
  "DIAMBIL",
] as const;
const paymentMethods = ["CASH", "QRIS", "TRANSFER"] as const;

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    serviceId: z.string().uuid(),
    branchId: z.string().uuid().optional(),
    serviceType: z.enum(serviceTypes),
    weight: z.number().positive().optional(),
    itemCount: z.number().int().positive().optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(paymentMethods).default("CASH"),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum(orderStatuses),
    note: z.string().optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "CANCELLED"]).optional(),
  }),
});

export const listOrderSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    status: z.enum(orderStatuses).optional(),
    branchId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
  }),
});

export const qrLookupSchema = z.object({
  params: z.object({ qrCode: z.string().min(1) }),
});
