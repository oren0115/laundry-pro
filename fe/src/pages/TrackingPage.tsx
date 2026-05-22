import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, STATUS_LABELS } from "@/lib/api";
import type { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderTimeline } from "@/components/OrderTimeline";

export function TrackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [qrInput, setQrInput] = useState("");
  const [tracked, setTracked] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders", { params: { limit: 20 } }).then((res) => setOrders(res.data.data));
  }, []);

  const trackByQr = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.get(`/orders/qr/${encodeURIComponent(qrInput.trim())}`);
      setTracked(data.data);
    } catch {
      setError("Order tidak ditemukan");
      setTracked(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Tracking Order</h2>
        <p className="text-sm text-muted-foreground">Pantau status laundry Anda secara real-time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cari dengan QR / Kode Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={trackByQr} className="flex gap-2">
            <Input
              placeholder="Contoh: LD-2605201234 atau scan QR"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
            />
            <Button type="submit">Lacak</Button>
          </form>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {tracked && (
        <Card>
          <CardHeader>
            <CardTitle>{tracked.orderNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Status: <strong>{STATUS_LABELS[tracked.status]}</strong></p>
            <OrderTimeline currentStatus={tracked.status} logs={tracked.statusLogs} />
            <Link
              to={`/orders/${tracked.id}`}
              className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-muted"
            >
              Detail lengkap
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Saya</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted/50"
            >
              <span className="font-mono">{o.orderNumber}</span>
              <span>{STATUS_LABELS[o.status]}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
