import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedPublicContentIfEmpty } from "../src/services/publicContent.service.js";

const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Laundry Pusat",
      address: "Jl. Sudirman No. 1, Denpasar",
      phone: "081234567890",
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Laundry Cabang Sanur",
      address: "Jl. Danau Tamblingan, Sanur",
      phone: "081234567891",
    },
  });

  const password = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@laundry.com" },
    update: {},
    create: {
      email: "owner@laundry.com",
      password,
      name: "Owner Laundry",
      role: "OWNER",
      branchId: branch.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@laundry.com" },
    update: {},
    create: {
      email: "admin@laundry.com",
      password,
      name: "Admin Laundry",
      role: "ADMIN",
      branchId: branch.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "kasir@laundry.com" },
    update: {},
    create: {
      email: "kasir@laundry.com",
      password,
      name: "Kasir Laundry",
      role: "KASIR",
      branchId: branch.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "operator@laundry.com" },
    update: {},
    create: {
      email: "operator@laundry.com",
      password,
      name: "Operator Laundry",
      role: "OPERATOR",
      branchId: branch.id,
    },
  });

  const services = [
    { name: "Cuci Reguler", type: "REGULER" as const, basePrice: 8000, pricePerKg: 8000 },
    { name: "Cuci Express", type: "EXPRESS" as const, basePrice: 12000, pricePerKg: 12000, expressPct: 30 },
    { name: "Cuci Satuan", type: "SATUAN" as const, basePrice: 15000 },
    { name: "Cuci Kiloan", type: "KILOAN" as const, basePrice: 7000, pricePerKg: 7000 },
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.service.create({ data: s });
  }

  const inventoryItems = [
    { name: "Deterjen Liquid", category: "DETERJEN" as const, quantity: 50, unit: "liter", minStock: 10 },
    { name: "Pewangi", category: "PEWANGI" as const, quantity: 30, unit: "liter", minStock: 5 },
    { name: "Plastik Kemasan", category: "PLASTIK" as const, quantity: 200, unit: "pcs", minStock: 50 },
    { name: "Hanger", category: "HANGER" as const, quantity: 100, unit: "pcs", minStock: 20 },
  ];

  for (const item of inventoryItems) {
    const exists = await prisma.inventory.findFirst({
      where: { branchId: branch.id, name: item.name },
    });
    if (!exists) await prisma.inventory.create({ data: { ...item, branchId: branch.id } });
  }

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@demo.com" },
    update: {},
    create: {
      email: "customer@demo.com",
      password,
      name: "Budi Santoso",
      phone: "081298765432",
      role: "CUSTOMER",
      branchId: branch.id,
      customer: {
        create: {
          name: "Budi Santoso",
          phone: "081298765432",
          email: "customer@demo.com",
          branchId: branch.id,
          membershipLevel: "SILVER",
          points: 150,
        },
      },
    },
    include: { customer: true },
  });

  await seedPublicContentIfEmpty();

  console.log("Seed completed!");
  console.log("Accounts (password: password123):");
  console.log("  owner@laundry.com (OWNER)");
  console.log("  admin@laundry.com (ADMIN)");
  console.log("  kasir@laundry.com (KASIR)");
  console.log("  operator@laundry.com (OPERATOR)");
  console.log("  customer@demo.com (CUSTOMER)");
  console.log(`Branches: ${branch.name}, ${branch2.name}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
