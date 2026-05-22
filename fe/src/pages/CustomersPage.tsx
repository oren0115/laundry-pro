import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Customer } from "@/types";
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

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const load = () => {
    api.get("/customers", { params: { search: search || undefined, limit: 50 } }).then((res) => {
      setCustomers(res.data.data);
    });
  };

  useEffect(() => {
    load();
  }, [search]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/customers", form);
    setShowForm(false);
    setForm({ name: "", phone: "", email: "", address: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Pelanggan</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Batal" : "Tambah Pelanggan"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Button type="submit">Simpan</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <Input placeholder="Cari pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead>Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.membershipLevel}</TableCell>
                  <TableCell>{c.points}</TableCell>
                  <TableCell>{c._count?.orders ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
