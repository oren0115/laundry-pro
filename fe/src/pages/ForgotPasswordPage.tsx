import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/components/ui/toast";
import { PublicAuthLayout } from "@/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ForgotPasswordPage() {
  usePageMeta({ title: "Lupa Password", description: "Reset password akun FreshFold." });
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      toast({
        title: "Link reset dikirim",
        description: `Cek inbox ${email} (demo).`,
        variant: "success",
      });
      setLoading(false);
    }, 900);
  };

  return (
    <PublicAuthLayout>
      <Card className="w-full max-w-md border-border/80 shadow-xl">
        <CardHeader>
          <CardTitle>Lupa Password</CardTitle>
          <CardDescription>
            Masukkan email terdaftar. Kami kirim link reset (fitur demo).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Mail className="size-4" />
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
          </form>
          <Button variant="link" className="mt-4 w-full" render={<Link to="/login" />}>
            <ArrowLeft className="size-4" />
            Kembali ke login
          </Button>
        </CardContent>
      </Card>
    </PublicAuthLayout>
  );
}
