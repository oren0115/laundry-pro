import { useEffect, useState, type ReactNode } from "react";
import {
  Globe,
  Loader2,
  Plus,
  Save,
  Trash2,
  Info,
  ImageIcon,
  ListChecks,
  Star,
  HelpCircle,
  Megaphone,
} from "lucide-react";
import { fetchCmsContent, saveCmsContent } from "@/lib/cms";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/cms/ImageUploadField";
import type { PublicContentData } from "@/types/public-content";
import { DEFAULT_PUBLIC_CONTENT } from "@/lib/public-content-defaults";
import { cn } from "@/lib/utils";

// ─── Tab definition ──────────────────────────────────────────────────────────

type TabId = "umum" | "hero" | "layanan" | "promo" | "faq";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "umum", label: "Umum", icon: <Info className="size-4" /> },
  { id: "hero", label: "Hero & Banner", icon: <ImageIcon className="size-4" /> },
  { id: "layanan", label: "Layanan & Harga", icon: <ListChecks className="size-4" /> },
  { id: "promo", label: "Promo & Ulasan", icon: <Star className="size-4" /> },
  { id: "faq", label: "FAQ & Cabang", icon: <HelpCircle className="size-4" /> },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export function WebsiteContentPage() {
  usePageMeta({ title: "Konten Website", description: "Kelola halaman publik laundry." });
  const { toast } = useToast();
  const [data, setData] = useState<PublicContentData>(DEFAULT_PUBLIC_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("umum");

  useEffect(() => {
    fetchCmsContent()
      .then(setData)
      .catch(() => toast({ title: "Gagal memuat konten", variant: "error" }))
      .finally(() => setLoading(false));
  }, [toast]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await saveCmsContent(data);
      setData(updated);
      toast({ title: "Konten disimpan", description: "Halaman publik diperbarui.", variant: "success" });
    } catch {
      toast({ title: "Gagal menyimpan", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const patchSite = <K extends keyof PublicContentData["site"]>(
    key: K,
    value: PublicContentData["site"][K]
  ) => setData((d) => ({ ...d, site: { ...d.site, [key]: value } }));

  const patchHero = <K extends keyof PublicContentData["hero"]>(
    key: K,
    value: PublicContentData["hero"][K]
  ) => setData((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));

  const patchHeroImage = (key: keyof PublicContentData["hero"]["images"], value: string) =>
    setData((d) => ({ ...d, hero: { ...d.hero, images: { ...d.hero.images, [key]: value } } }));

  const patchPromoStrip = <K extends keyof PublicContentData["promoStrip"]>(
    key: K,
    value: PublicContentData["promoStrip"][K]
  ) => setData((d) => ({ ...d, promoStrip: { ...d.promoStrip, [key]: value } }));

  const patchCta = <K extends keyof PublicContentData["cta"]>(
    key: K,
    value: PublicContentData["cta"][K]
  ) => setData((d) => ({ ...d, cta: { ...d.cta, [key]: value } }));

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Globe className="size-6" />
            Konten Website
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola teks, foto, dan konten halaman publik. Hanya Owner.
          </p>
        </div>
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan Semua
        </Button>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-1 rounded-xl border bg-muted/40 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Umum ───────────────────────────────────────────────────────── */}
      {activeTab === "umum" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>Nama brand, kontak, jam operasional</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama brand" value={data.site.name} onChange={(v) => patchSite("name", v)} />
              <Field label="Tagline" value={data.site.tagline} onChange={(v) => patchSite("tagline", v)} />
              <Field label="Telepon (WA)" value={data.site.phone} onChange={(v) => patchSite("phone", v)} />
              <Field label="Email" value={data.site.email} onChange={(v) => patchSite("email", v)} />
              <Field
                label="Alamat"
                value={data.site.address}
                onChange={(v) => patchSite("address", v)}
                className="sm:col-span-2"
              />
              <Field label="Jam operasional" value={data.site.hours} onChange={(v) => patchSite("hours", v)} />
              <Field
                label="Pesan WhatsApp default"
                value={data.site.whatsappMessage}
                onChange={(v) => patchSite("whatsappMessage", v)}
                className="sm:col-span-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-4" />
                CTA Banner
              </CardTitle>
              <CardDescription>Banner ajak-bertindak di bagian bawah halaman</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Eyebrow (teks kecil atas)" value={data.cta.eyebrow} onChange={(v) => patchCta("eyebrow", v)} />
              <Field label="Judul utama" value={data.cta.title} onChange={(v) => patchCta("title", v)} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea rows={2} value={data.cta.description} onChange={(e) => patchCta("description", e.target.value)} />
              </div>
              <ImageUploadField
                label="Gambar background"
                value={data.cta.backgroundImage}
                onChange={(v) => patchCta("backgroundImage", v)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Hero & Banner ──────────────────────────────────────────────── */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teks Hero</CardTitle>
              <CardDescription>Judul besar di bagian atas halaman utama</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Judul (bagian awal)"
                  value={data.hero.headline}
                  onChange={(v) => patchHero("headline", v)}
                />
                <Field
                  label="Judul (teks highlight)"
                  value={data.hero.headlineHighlight}
                  onChange={(v) => patchHero("headlineHighlight", v)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Subheadline</label>
                <Textarea
                  rows={3}
                  value={data.hero.subheadline}
                  onChange={(e) => patchHero("subheadline", e.target.value)}
                />
              </div>
              <Field
                label="Social proof (mis: ★ 4.9 · 2000+ pelanggan)"
                value={data.hero.socialProof}
                onChange={(v) => patchHero("socialProof", v)}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Badge hero (satu per baris)</label>
                <Textarea
                  rows={3}
                  value={data.hero.badges.join("\n")}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      hero: { ...d.hero, badges: e.target.value.split("\n").filter(Boolean) },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Foto Hero</CardTitle>
              <CardDescription>Gambar utama dan foto pendukung di section hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploadField
                label="Gambar background jumbotron"
                hint="Ditampilkan sebagai latar penuh section hero. Kosongkan untuk pakai gradien default."
                value={data.hero.images.background}
                onChange={(v) => patchHeroImage("background", v)}
              />
              <ImageUploadField
                label="Foto hero utama (kartu kanan)"
                hint="Foto utama yang tampil di dalam kartu di sisi kanan hero."
                value={data.hero.images.main}
                onChange={(v) => patchHeroImage("main", v)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageUploadField
                  label="Foto kurir"
                  value={data.hero.images.courier}
                  onChange={(v) => patchHeroImage("courier", v)}
                />
                <ImageUploadField
                  label="Foto customer"
                  value={data.hero.images.customer}
                  onChange={(v) => patchHeroImage("customer", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strip Promo</CardTitle>
              <CardDescription>Banner promo yang muncul di bawah section hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={data.promoStrip.enabled}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      promoStrip: { ...d.promoStrip, enabled: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                Tampilkan banner promo
              </label>
              <div className={cn("space-y-4", !data.promoStrip.enabled && "pointer-events-none opacity-50")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Judul promo"
                    value={data.promoStrip.title}
                    onChange={(v) => patchPromoStrip("title", v)}
                  />
                  <Field
                    label="Kode diskon"
                    value={data.promoStrip.code}
                    onChange={(v) => patchPromoStrip("code", v)}
                  />
                </div>
                <Field
                  label="Deskripsi promo"
                  value={data.promoStrip.description}
                  onChange={(v) => patchPromoStrip("description", v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Layanan & Harga ────────────────────────────────────────────── */}
      {activeTab === "layanan" && (
        <div className="space-y-6">
          <ListSection
            title="Statistik Landing"
            description="Angka-angka pencapaian di section statistik"
            items={data.stats}
            onChange={(stats) => setData((d) => ({ ...d, stats }))}
            renderItem={(item, i, items) => (
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-4">
                <Field label="Label" value={item.label} onChange={(v) => updateItem(items, i, { label: v })} />
                <Field
                  label="Nilai"
                  type="number"
                  value={String(item.value)}
                  onChange={(v) => updateItem(items, i, { value: Number(v) || 0 })}
                />
                <Field label="Suffix" value={item.suffix} onChange={(v) => updateItem(items, i, { suffix: v })} />
                <Field label="Icon key" value={item.icon} onChange={(v) => updateItem(items, i, { icon: v })} />
              </div>
            )}
            newItem={() => ({
              key: `stat-${Date.now()}`,
              label: "Label baru",
              value: 0,
              suffix: "+",
              icon: "shirt",
            })}
          />

          <ListSection
            title="Layanan"
            description="Kartu layanan di section layanan halaman utama"
            items={data.services}
            onChange={(services) => setData((d) => ({ ...d, services }))}
            renderItem={(item, i, items) => (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nama" value={item.name} onChange={(v) => updateItem(items, i, { name: v })} />
                  <Field
                    label="Harga label"
                    value={item.priceLabel}
                    onChange={(v) => updateItem(items, i, { priceLabel: v })}
                  />
                  <Field
                    label="Estimasi"
                    value={item.estimate}
                    onChange={(v) => updateItem(items, i, { estimate: v })}
                  />
                  <Field label="Icon key" value={item.icon} onChange={(v) => updateItem(items, i, { icon: v })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateItem(items, i, { description: e.target.value })}
                  />
                </div>
              </div>
            )}
            newItem={() => ({
              id: `svc-${Date.now()}`,
              name: "Layanan Baru",
              description: "",
              priceLabel: "Rp 0",
              estimate: "1 hari",
              icon: "shirt",
            })}
          />

          <ListSection
            title="Paket Harga"
            description="Paket Reguler / Express / Premium"
            items={data.pricingTiers}
            onChange={(pricingTiers) => setData((d) => ({ ...d, pricingTiers }))}
            renderItem={(item, i, items) => (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nama paket" value={item.name} onChange={(v) => updateItem(items, i, { name: v })} />
                  <label className="flex items-center gap-2 self-end pb-1 text-sm">
                    <input
                      type="checkbox"
                      checked={item.highlight}
                      onChange={(e) => updateItem(items, i, { highlight: e.target.checked })}
                      className="rounded"
                    />
                    Paket populer
                  </label>
                  <Field
                    label="Harga / kg"
                    type="number"
                    value={String(item.priceKg)}
                    onChange={(v) => updateItem(items, i, { priceKg: Number(v) || 0 })}
                  />
                  <Field
                    label="Harga / item"
                    type="number"
                    value={String(item.priceItem)}
                    onChange={(v) => updateItem(items, i, { priceItem: Number(v) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Fitur (satu per baris)</label>
                  <Textarea
                    rows={3}
                    value={item.features.join("\n")}
                    onChange={(e) =>
                      updateItem(items, i, { features: e.target.value.split("\n").filter(Boolean) })
                    }
                  />
                </div>
              </div>
            )}
            newItem={() => ({
              id: `tier-${Date.now()}`,
              name: "Paket Baru",
              description: "",
              priceKg: 10000,
              priceItem: 15000,
              features: [],
              highlight: false,
            })}
          />
        </div>
      )}

      {/* ── Tab: Promo & Ulasan ─────────────────────────────────────────────── */}
      {activeTab === "promo" && (
        <div className="space-y-6">
          <ListSection
            title="Promo Aktif"
            description="Kode promo yang ditampilkan di halaman pricing"
            items={data.promos}
            onChange={(promos) => setData((d) => ({ ...d, promos }))}
            renderItem={(item, i, items) => (
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
                <Field label="Judul" value={item.title} onChange={(v) => updateItem(items, i, { title: v })} />
                <Field label="Kode" value={item.code} onChange={(v) => updateItem(items, i, { code: v })} />
                <Field label="Berlaku hingga" value={item.until} onChange={(v) => updateItem(items, i, { until: v })} />
              </div>
            )}
            newItem={() => ({ title: "Promo Baru", code: "KODE", until: "31 Des 2026" })}
          />

          <ListSection
            title="Testimoni Pelanggan"
            description="Ulasan pelanggan yang muncul di section testimoni"
            items={data.testimonials}
            onChange={(testimonials) => setData((d) => ({ ...d, testimonials }))}
            renderItem={(item, i, items) => (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nama" value={item.name} onChange={(v) => updateItem(items, i, { name: v })} />
                  <Field label="Peran / lokasi" value={item.role} onChange={(v) => updateItem(items, i, { role: v })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Ulasan</label>
                  <Textarea
                    rows={2}
                    value={item.text}
                    onChange={(e) => updateItem(items, i, { text: e.target.value })}
                  />
                </div>
                <Field
                  label="Rating (1–5)"
                  type="number"
                  value={String(item.rating)}
                  onChange={(v) => updateItem(items, i, { rating: Math.min(5, Math.max(1, Number(v) || 5)) })}
                />
                <ImageUploadField
                  label="Foto pelanggan"
                  value={item.image}
                  onChange={(v) => updateItem(items, i, { image: v })}
                />
              </div>
            )}
            newItem={() => ({
              name: "Nama Pelanggan",
              role: "Pelanggan",
              text: "Ulasan positif tentang layanan...",
              rating: 5,
              image: "",
            })}
          />
        </div>
      )}

      {/* ── Tab: FAQ & Cabang ───────────────────────────────────────────────── */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          <ListSection
            title="FAQ"
            description="Pertanyaan yang sering ditanyakan pelanggan"
            items={data.faqs}
            onChange={(faqs) => setData((d) => ({ ...d, faqs }))}
            renderItem={(item, i, items) => (
              <div className="space-y-2 rounded-lg border p-4">
                <Field
                  label="Pertanyaan"
                  value={item.q}
                  onChange={(v) => updateItem(items, i, { q: v })}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Jawaban</label>
                  <Textarea
                    rows={2}
                    value={item.a}
                    onChange={(e) => updateItem(items, i, { a: e.target.value })}
                  />
                </div>
              </div>
            )}
            newItem={() => ({ q: "Pertanyaan baru?", a: "Jawaban." })}
          />

          <ListSection
            title="Cabang"
            description="Informasi cabang yang tampil di halaman publik"
            items={data.branches}
            onChange={(branches) => setData((d) => ({ ...d, branches }))}
            renderItem={(item, i, items) => (
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
                <Field label="Nama cabang" value={item.name} onChange={(v) => updateItem(items, i, { name: v })} />
                <Field label="Alamat" value={item.address} onChange={(v) => updateItem(items, i, { address: v })} />
                <Field label="Telepon" value={item.phone} onChange={(v) => updateItem(items, i, { phone: v })} />
              </div>
            )}
            newItem={() => ({ name: "Cabang Baru", address: "", phone: "" })}
          />
        </div>
      )}

      {/* Footer save */}
      <div className="flex justify-end pb-8">
        <Button size="lg" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan Semua
        </Button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function updateItem<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function ListSection<T>({
  title,
  description,
  items,
  onChange,
  renderItem,
  newItem,
}: {
  title: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, items: T[]) => ReactNode;
  newItem: () => T;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => onChange([...items, newItem()])}
        >
          <Plus className="size-4" />
          Tambah
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">Belum ada item. Klik Tambah.</p>
        )}
        {items.map((item, i) => (
          <div key={i} className="relative">
            {renderItem(item, i, items)}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
