import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/components/ui/toast";
import { PublicAuthLayout } from "@/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterPage() {
  usePageMeta({ title: "Daftar", description: "Buat akun pelanggan FreshFold gratis." });
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast({ title: "Akun berhasil dibuat", variant: "success" });
      navigate("/tracking");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Registrasi gagal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicAuthLayout>
      <Card className="w-full max-w-md border-border/80 shadow-xl">
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
          <CardDescription>Pesan laundry, lacak status, dan nikmati promo member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={submit} className="space-y-3">
            {(["name", "email", "phone", "password"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium capitalize">
                  {field === "name" ? "Nama Lengkap" : field === "phone" ? "Nomor HP" : field}
                </label>
                <Input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required={field !== "phone" || true}
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-sm font-medium">Alamat (opsional)</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Buat Akun"}
            </Button>
          </form>

          <Button
            variant="outline"
            className="w-full gap-2"
            type="button"
            onClick={() =>
              toast({ title: "Daftar Google", description: "Hubungkan OAuth di backend." })
            }
          >
            <Globe className="size-4" />
            Daftar dengan Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </PublicAuthLayout>
  );
}
