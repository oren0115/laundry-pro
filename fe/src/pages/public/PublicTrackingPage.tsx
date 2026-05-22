import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import { api } from "@/lib/api";
import { mapToPublicSteps } from "@/lib/tracking-steps";
import type { Order } from "@/types";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FadeIn } from "@/components/public/FadeIn";
import { SectionHeading } from "@/components/public/SectionHeading";
import { PublicOrderTimeline } from "@/components/public/PublicOrderTimeline";
import { formatCurrency } from "@/lib/api";

export function PublicTrackingPage() {
  usePageMeta({
    title: "Cek Status",
    description: "Lacak status laundry dengan nomor invoice atau nomor HP.",
  });

  const [invoice, setInvoice] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    const code = invoice.trim();
    const hp = phone.trim();

    if (!code && !hp) {
      setError("Isi nomor invoice atau nomor HP");
      setLoading(false);
      return;
    }

    try {
      if (code) {
        const { data } = await api.get(`/orders/qr/${encodeURIComponent(code)}`);
        setOrder(data.data);
      } else {
        const { data } = await api.get("/orders", {
          params: { search: hp, limit: 1 },
        });
        const list = data.data as Order[];
        if (list?.length) setOrder(list[0]);
        else setError("Pesanan tidak ditemukan untuk nomor HP ini");
      }
    } catch {
      setError("Pesanan tidak ditemukan. Periksa invoice atau nomor HP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            align="left"
            eyebrow="Tracking"
            title="Cek status laundry Anda"
            description="Masukkan nomor invoice (contoh LD-2605201234) atau nomor HP terdaftar."
          />
        </FadeIn>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Lacak pesanan</CardTitle>
            <CardDescription>Data diperbarui secara real-time dari outlet kami</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={search} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomor Invoice</label>
                <Input
                  placeholder="LD-2605201234"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">atau</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomor HP</label>
                <Input
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Search className="size-4" />
                {loading ? "Mencari..." : "Cek Status"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!loading && searched && !order && !error && (
          <Empty className="mt-8 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageSearch />
              </EmptyMedia>
              <EmptyTitle>Pesanan tidak ditemukan</EmptyTitle>
              <EmptyDescription>
                Pastikan invoice atau nomor HP sudah benar.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" render={<Link to="/kontak" />}>
                Hubungi CS
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {order && (
          <FadeIn>
            <Card className="mt-6 border-primary/20">
              <CardHeader>
                <CardTitle className="font-mono">{order.orderNumber}</CardTitle>
                <CardDescription>
                  {order.customer.name} · {order.service?.name ?? order.serviceType} ·{" "}
                  {formatCurrency(order.total)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PublicOrderTimeline steps={mapToPublicSteps(order.status)} />
              </CardContent>
            </Card>
          </FadeIn>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Punya akun?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>{" "}
          untuk melihat semua pesanan.
        </p>
      </div>
    </section>
  );
}
