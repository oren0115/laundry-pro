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
import { cn } from "@/lib/utils";

export function LoginPage() {
  usePageMeta({ title: "Masuk", description: "Login pelanggan FreshFold — email, HP, atau Google." });
  const { toast } = useToast();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const loginEmail = mode === "email" ? email : `${phone.trim()}@phone.local`;
    try {
      const { data } = await api.post("/auth/login", { email: loginEmail, password });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      const role = data.data.user.role;
      navigate(role === "CUSTOMER" ? "/tracking" : "/dashboard");
      toast({ title: "Selamat datang", description: `Halo, ${data.data.user.name}!`, variant: "success" });
    } catch {
      setError(mode === "email" ? "Email atau password salah" : "Nomor HP atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    toast({
      title: "Login Google",
      description: "Hubungkan OAuth Google di backend untuk mengaktifkan fitur ini.",
    });
  };

  return (
    <PublicAuthLayout>
      <Card className="w-full max-w-md border-border/80 shadow-xl">
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>Akses tracking, riwayat pesanan, dan member benefits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex rounded-lg border p-1">
            {(["email", "phone"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
                onClick={() => setMode(m)}
              >
                {m === "email" ? "Email" : "Nomor HP"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "email" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomor HP</label>
                <Input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link to="/lupa-password" className="text-xs text-primary hover:underline">
                  Lupa password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2" type="button" onClick={googleLogin}>
            <Globe className="size-4" />
            Masuk dengan Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Daftar gratis
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Staff? Demo: owner@laundry.com / password123
          </p>
        </CardContent>
      </Card>
    </PublicAuthLayout>
  );
}
