import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api, formatCurrency, STATUS_LABELS } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import type { Order, OrderStatus } from "@/types";
import { OrderTimeline } from "@/components/OrderTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  DITERIMA: "DICUCI",
  DICUCI: "DIKERINGKAN",
  DIKERINGKAN: "DISETRIKA",
  DISETRIKA: "PACKING",
  PACKING: "SELESAI",
  SELESAI: "DIAMBIL",
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const isStaff = useAuthStore((s) => s.isStaff());

  const load = () => {
    if (!id) return;
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data));
  };

  useEffect(() => {
    load();
    const socket = getSocket();
    if (socket && id) {
      socket.emit("order:subscribe", id);
      socket.on("order:updated", (o: Order) => {
        if (o.id === id) setOrder(o);
      });
      return () => {
        socket.emit("order:unsubscribe", id);
        socket.off("order:updated");
      };
    }
  }, [id]);

  const advanceStatus = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const paymentStatus = next === "DIAMBIL" ? "PAID" : undefined;
    await api.patch(`/orders/${order.id}/status`, { status: next, paymentStatus });
    load();
  };

  if (!order) return <p>Memuat...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{order.orderNumber}</h2>
          <p className="text-muted-foreground">{order.customer.name}</p>
        </div>
        {isStaff && order.status !== "DIAMBIL" && (
          <Button onClick={advanceStatus}>
            Update ke: {NEXT_STATUS[order.status] ? STATUS_LABELS[NEXT_STATUS[order.status]!] : "-"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Status:</span> {STATUS_LABELS[order.status]}
            </p>
            <p>
              <span className="text-muted-foreground">Layanan:</span> {order.service.name} ({order.serviceType})
            </p>
            <p>
              <span className="text-muted-foreground">Total:</span> {formatCurrency(Number(order.total))}
            </p>
            <p>
              <span className="text-muted-foreground">Pembayaran:</span> {order.paymentStatus} ({order.paymentMethod})
            </p>
            {order.estimatedFinish && (
              <p>
                <span className="text-muted-foreground">Estimasi selesai:</span>{" "}
                {new Date(order.estimatedFinish).toLocaleString("id-ID")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Order</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <QRCodeSVG value={order.qrCode} size={160} />
            <p className="font-mono text-xs text-muted-foreground">{order.qrCode}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline currentStatus={order.status} logs={order.statusLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
