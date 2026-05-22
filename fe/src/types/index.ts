export type Role = "OWNER" | "ADMIN" | "KASIR" | "OPERATOR" | "KURIR" | "CUSTOMER";

export type OrderStatus =
  | "DITERIMA"
  | "DICUCI"
  | "DIKERINGKAN"
  | "DISETRIKA"
  | "PACKING"
  | "SELESAI"
  | "DIAMBIL";

export type ServiceType = "REGULER" | "EXPRESS" | "SATUAN" | "KILOAN";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  branchId?: string;
  branch?: { id: string; name: string };
  customer?: Customer;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  membershipLevel: string;
  points: number;
  totalSpent: number;
  _count?: { orders: number };
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  basePrice: number;
  pricePerKg?: number;
  expressPct: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  qrCode: string;
  qrImage?: string;
  status: OrderStatus;
  serviceType: ServiceType;
  weight?: number;
  itemCount?: number;
  total: number;
  subtotal: number;
  discount: number;
  surcharge: number;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string;
  estimatedFinish?: string;
  createdAt: string;
  customer: { id: string; name: string; phone: string };
  service: Service;
  branch?: { id: string; name: string };
  statusLogs?: StatusLog[];
}

export interface StatusLog {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updater?: { name: string };
}

export interface DashboardData {
  summary: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalCustomers: number;
    todayRevenue: number;
    monthRevenue: number;
  };
  charts: {
    ordersByStatus: { name: string; value: number }[];
    ordersByService: { name: string; value: number }[];
    expressVsReguler: { name: string; value: number }[];
    revenueTrend: { date: string; revenue: number; orders: number }[];
    busyHours: { hour: string; count: number }[];
  };
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
