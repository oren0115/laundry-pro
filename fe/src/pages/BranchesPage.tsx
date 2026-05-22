import { useEffect, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  _count?: { orders: number; customers: number; users: number };
}

export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<Record<string, { orders: number; revenue: number }>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", address: "", phone: "" });
  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const load = async () => {
    const res = await api.get("/branches");
    setBranches(res.data.data);
    const map: Record<string, { orders: number; revenue: number }> = {};
    for (const b of res.data.data as Branch[]) {
      const s = await api.get(`/branches/${b.id}/stats`);
      map[b.id] = s.data.data.stats;
    }
    setStats(map);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone ?? "",
    });
    setIsEditOpen(true);
  };

  const resetEdit = () => {
    setEditingId(null);
    setForm({ name: "", address: "", phone: "" });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      await api.put(`/branches/${editingId}`, {
        name: form.name,
        address: form.address,
        phone: form.phone || undefined,
      });
      setIsEditOpen(false);
      resetEdit();
      await load();
    } catch {
      alert("Gagal memperbarui cabang.");
    } finally {
      setLoading(false);
    }
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/branches", {
        name: createForm.name,
        address: createForm.address,
        phone: createForm.phone || undefined,
      });
      setCreateForm({ name: "", address: "", phone: "" });
      setIsCreateOpen(false);
      await load();
    } catch {
      alert("Gagal menambah cabang.");
    } finally {
      setLoading(false);
    }
  };

  const removeBranch = async (branch: Branch) => {
    const ok = window.confirm(`Hapus cabang ${branch.name}?`);
    if (!ok) return;
    await api.delete(`/branches/${branch.id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Cabang</h2>
        <Button onClick={() => setIsCreateOpen(true)}>Tambah Cabang</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <CardTitle>{b.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{b.address}</p>
              <p>Telepon: {b.phone || "-"}</p>
              <p>Order: {stats[b.id]?.orders ?? b._count?.orders ?? 0}</p>
              <p>Pendapatan: {formatCurrency(stats[b.id]?.revenue ?? 0)}</p>
              <p>Pelanggan: {b._count?.customers ?? 0}</p>
              <div className="space-x-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(b)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeBranch(b)}>
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          <SheetHeader>
            <SheetTitle>Tambah Cabang</SheetTitle>
            <SheetDescription>Isi data cabang baru.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submitCreate} className="grid gap-3 p-4">
            <Input
              placeholder="Nama cabang"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
            />
            <Input
              placeholder="Alamat"
              value={createForm.address}
              onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
              required
            />
            <Input
              placeholder="Telepon (opsional)"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              Simpan Cabang
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetEdit();
        }}
      >
        <SheetContent side="right" className="w-full max-w-xl">
          <SheetHeader>
            <SheetTitle>Edit Cabang</SheetTitle>
            <SheetDescription>Ubah data cabang, lalu simpan perubahan.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submitEdit} className="grid gap-3 p-4">
            <Input
              placeholder="Nama cabang"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Alamat"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <Input
              placeholder="Telepon (opsional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              Simpan Perubahan
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
