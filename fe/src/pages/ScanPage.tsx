import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ScanPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.get(`/orders/qr/${encodeURIComponent(code.trim())}`);
      navigate(`/orders/${data.data.id}`);
    } catch {
      setError("QR tidak ditemukan");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-2xl font-semibold">Scan QR Order</h2>
      <p className="text-sm text-muted-foreground">
        Masukkan kode QR order untuk membuka detail dan update status
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Input Kode QR</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={lookup} className="space-y-4">
            <Input
              placeholder="LD-..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Buka Order
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
