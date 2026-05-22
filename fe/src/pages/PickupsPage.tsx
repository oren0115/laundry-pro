import { useEffect, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Pickup {
  id: string;
  status: string;
  pickupAddress: string;
  shippingFee: number;
  customer: { name: string; phone: string };
  courier?: { name: string };
  order?: { orderNumber: string };
}

export function PickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);

  const load = () => api.get("/pickups").then((res) => setPickups(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/pickups/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pickup & Delivery</h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ongkir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickups.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.customer.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.pickupAddress}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>{formatCurrency(Number(p.shippingFee))}</TableCell>
                  <TableCell>
                    {p.status === "REQUESTED" && (
                      <Button size="sm" onClick={() => updateStatus(p.id, "ASSIGNED")}>
                        Assign
                      </Button>
                    )}
                    {p.status === "ASSIGNED" && (
                      <Button size="sm" onClick={() => updateStatus(p.id, "PICKED_UP")}>
                        Diambil
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
