import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Customer, Service, ServiceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateOrderDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    serviceId: "",
    serviceType: "KILOAN" as ServiceType,
    weight: 3,
    itemCount: 1,
    notes: "",
    paymentMethod: "CASH",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      api.get("/customers", { params: { limit: 100 } }),
      api.get("/services"),
    ]).then(([c, s]) => {
      setCustomers(c.data.data);
      setServices(s.data.data);
      if (c.data.data[0]) setForm((f) => ({ ...f, customerId: c.data.data[0].id }));
      if (s.data.data[0]) {
        setForm((f) => ({
          ...f,
          serviceId: s.data.data[0].id,
          serviceType: s.data.data[0].type,
        }));
      }
    });
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/orders", form);
      onCreated();
      onClose();
    } catch (err) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <CardHeader>
          <CardTitle>Buat Order Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Pelanggan</label>
              <NativeSelect
                className="w-full"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Layanan</label>
              <NativeSelect
                className="w-full"
                value={form.serviceId}
                onChange={(e) => {
                  const svc = services.find((s) => s.id === e.target.value);
                  setForm({
                    ...form,
                    serviceId: e.target.value,
                    serviceType: (svc?.type ?? "KILOAN") as ServiceType,
                  });
                }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipe</label>
              <NativeSelect
                className="w-full"
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value as ServiceType })}
              >
                {(["REGULER", "EXPRESS", "SATUAN", "KILOAN"] as const).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </NativeSelect>
            </div>
            {(form.serviceType === "KILOAN" || form.serviceType === "REGULER" || form.serviceType === "EXPRESS") && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Berat (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
                />
              </div>
            )}
            {form.serviceType === "SATUAN" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Jumlah item</label>
                <Input
                  type="number"
                  value={form.itemCount}
                  onChange={(e) => setForm({ ...form, itemCount: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
