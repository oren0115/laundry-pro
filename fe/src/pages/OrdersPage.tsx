import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { api, formatCurrency, STATUS_LABELS } from "@/lib/api";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import { CreateOrderDialog } from "@/components/CreateOrderDialog";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const isStaff = useAuthStore((s) => s.isStaff());

  const load = () => {
    setLoading(true);
    api
      .get("/orders", { params: { search: search || undefined, limit: 50 } })
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Order Laundry</h2>
          <p className="text-sm text-muted-foreground">Kelola semua transaksi laundry</p>
        </div>
        {isStaff && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            Order Baru
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Input
            placeholder="Cari no order / nama pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Memuat...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No Order</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                    <TableCell>{o.customer.name}</TableCell>
                    <TableCell>{o.serviceType}</TableCell>
                    <TableCell>{STATUS_LABELS[o.status]}</TableCell>
                    <TableCell>{formatCurrency(Number(o.total))}</TableCell>
                    <TableCell>
                      <Link to={`/orders/${o.id}`} className="text-sm text-primary underline">
                        Detail
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showCreate && <CreateOrderDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={load} />}
    </div>
  );
}
