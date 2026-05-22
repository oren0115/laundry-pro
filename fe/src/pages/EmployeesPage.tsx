import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Employee {
  id: string;
  position: string;
  salary?: number;
  branchId: string;
  user: { id: string; name: string; email: string; phone?: string; role: string; isActive: boolean };
  branch: { name: string };
}

interface Branch {
  id: string;
  name: string;
}

interface EmployeeForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "KASIR" | "OPERATOR" | "KURIR";
  branchId: string;
  position: string;
  salary: string;
}

const initialForm: EmployeeForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "KASIR",
  branchId: "",
  position: "",
  salary: "",
};

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<{ name: string; _count: { statusUpdates: number } }[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [createForm, setCreateForm] = useState<EmployeeForm>(initialForm);
  const [editForm, setEditForm] = useState<EmployeeForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [employeesRes, performanceRes, branchesRes] = await Promise.all([
      api.get("/employees"),
      api.get("/employees/performance"),
      api.get("/branches"),
    ]);
    setEmployees(employeesRes.data.data);
    setPerformance(performanceRes.data.data);
    setBranches(branchesRes.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetCreateForm = () => {
    setCreateForm((prev) => ({ ...initialForm, branchId: prev.branchId || branches[0]?.id || "" }));
  };

  const resetEditForm = () => {
    setEditForm((prev) => ({ ...initialForm, branchId: prev.branchId || branches[0]?.id || "" }));
    setEditingId(null);
  };

  useEffect(() => {
    if (!createForm.branchId && branches.length > 0) {
      setCreateForm((prev) => ({ ...prev, branchId: branches[0]!.id }));
    }
    if (!editForm.branchId && branches.length > 0) {
      setEditForm((prev) => ({ ...prev, branchId: branches[0]!.id }));
    }
  }, [branches, createForm.branchId, editForm.branchId]);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.password) {
      alert("Password wajib diisi saat menambah karyawan.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: createForm.name,
        email: createForm.email,
        phone: createForm.phone || undefined,
        role: createForm.role,
        branchId: createForm.branchId,
        position: createForm.position,
        salary: createForm.salary ? Number(createForm.salary) : undefined,
        password: createForm.password,
      };
      await api.post("/employees", payload);
      resetCreateForm();
      await load();
    } catch {
      alert("Gagal menyimpan data karyawan.");
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || undefined,
        role: editForm.role,
        branchId: editForm.branchId,
        position: editForm.position,
        salary: editForm.salary ? Number(editForm.salary) : undefined,
        ...(editForm.password ? { password: editForm.password } : {}),
      };
      await api.put(`/employees/${editingId}`, payload);
      setIsEditOpen(false);
      resetEditForm();
      await load();
    } catch {
      alert("Gagal memperbarui data karyawan.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setEditForm({
      name: employee.user.name,
      email: employee.user.email,
      phone: employee.user.phone ?? "",
      password: "",
      role: employee.user.role as EmployeeForm["role"],
      branchId: employee.branchId,
      position: employee.position,
      salary: employee.salary ? String(employee.salary) : "",
    });
    setIsEditOpen(true);
  };

  const remove = async (employee: Employee) => {
    const ok = window.confirm(`Hapus karyawan ${employee.user.name}?`);
    if (!ok) return;
    await api.delete(`/employees/${employee.id}`);
    if (editingId === employee.id && isEditOpen) {
      setIsEditOpen(false);
      resetEditForm();
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Karyawan</h2>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submitCreate} className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Nama"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
            <Input
              placeholder="Telepon"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              required
            />
            <NativeSelect
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as EmployeeForm["role"] })}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="KASIR">KASIR</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="KURIR">KURIR</option>
            </NativeSelect>
            <NativeSelect value={createForm.branchId} onChange={(e) => setCreateForm({ ...createForm, branchId: e.target.value })}>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </NativeSelect>
            <Input
              placeholder="Posisi"
              value={createForm.position}
              onChange={(e) => setCreateForm({ ...createForm, position: e.target.value })}
              required
            />
            <Input
              type="number"
              min={0}
              placeholder="Gaji (opsional)"
              value={createForm.salary}
              onChange={(e) => setCreateForm({ ...createForm, salary: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              Tambah Karyawan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.user.name}</TableCell>
                  <TableCell>{e.user.email}</TableCell>
                  <TableCell>{e.user.role}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell>{e.branch.name}</TableCell>
                  <TableCell>{e.user.isActive ? "Aktif" : "Nonaktif"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(e)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetEditForm();
        }}
      >
        <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Karyawan</SheetTitle>
            <SheetDescription>Ubah data karyawan, lalu simpan perubahan.</SheetDescription>
          </SheetHeader>
          <form onSubmit={submitEdit} className="grid gap-3 p-4">
            <Input
              placeholder="Nama"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />
            <Input
              placeholder="Telepon"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password baru (opsional)"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
            <NativeSelect
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as EmployeeForm["role"] })}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="KASIR">KASIR</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="KURIR">KURIR</option>
            </NativeSelect>
            <NativeSelect value={editForm.branchId} onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </NativeSelect>
            <Input
              placeholder="Posisi"
              value={editForm.position}
              onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
              required
            />
            <Input
              type="number"
              min={0}
              placeholder="Gaji (opsional)"
              value={editForm.salary}
              onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              Simpan Perubahan
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 font-medium">Performa Operator</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performance.map((p) => (
                <TableRow key={p.name}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p._count.statusUpdates}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
