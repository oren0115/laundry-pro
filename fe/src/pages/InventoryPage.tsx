import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);

  const load = () => {
    api.get("/inventory").then((res) => {
      setItems(res.data.data.items);
      setLowStock(res.data.data.lowStock);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (id: string, delta: number) => {
    await api.patch(`/inventory/${id}/adjust`, { delta });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Inventori</h2>

      {lowStock.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <CardTitle className="text-destructive">Stok Menipis ({lowStock.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm">
              {lowStock.map((i) => (
                <li key={i.id}>
                  {i.name}: {i.quantity} {i.unit} (min: {i.minStock})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.category}</TableCell>
                  <TableCell>
                    {i.quantity} {i.unit}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => adjust(i.id, -1)}>
                      -
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => adjust(i.id, 1)}>
                      +
                    </Button>
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
