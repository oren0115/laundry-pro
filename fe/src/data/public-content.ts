import type { LucideIcon } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import {
  Truck,
  Radar,
  Zap,
  CreditCard,
  Shirt,
  Wind,
  Footprints,
  Layers,
  BedDouble,
} from "lucide-react";

export const SITE = {
  name: BRAND_NAME,
  tagline: "Laundry modern dengan antar jemput & tracking real-time",
  phone: "6281234567890",
  email: "hello@freshfold.id",
  address: "Jl. Raya Sudirman No. 45, Jakarta Selatan",
  hours: "Senin – Minggu, 07.00 – 21.00 WIB",
  whatsappMessage: `Halo ${BRAND_NAME}, saya ingin bertanya tentang layanan laundry.`,
} as const;

export const STATS = [
  { label: "Pelanggan Aktif", value: "12.500+", key: "customers" },
  { label: "Laundry Selesai", value: "480K+", key: "completed" },
  { label: "Rating Pelanggan", value: "4.9/5", key: "rating" },
] as const;

export const LANDING_STATS = [
  {
    label: "Pakaian dicuci",
    value: 10000,
    suffix: "+",
    icon: "shirt" as const,
    key: "washed",
  },
  {
    label: "Pelanggan aktif",
    value: 2500,
    suffix: "+",
    icon: "users" as const,
    key: "customers",
  },
  {
    label: "Customer puas",
    value: 98,
    suffix: "%",
    icon: "heart" as const,
    key: "satisfaction",
  },
  {
    label: "Support",
    value: 24,
    suffix: "/7",
    icon: "headphones" as const,
    key: "support",
  },
] as const;

export const HERO_BADGES = [
  "Express 24 Jam",
  "Pickup & Delivery",
  "1000+ Pelanggan",
] as const;

export const LANDING_SERVICES = [
  {
    id: "reguler",
    name: "Cuci Reguler",
    description: "Cuci + setrika standar untuk kebutuhan harian keluarga.",
    priceLabel: "Rp 9.000/kg",
    estimate: "2–3 hari",
    icon: Shirt,
  },
  {
    id: "express",
    name: "Express",
    description: "Prioritas proses cepat — selesai dalam 6–12 jam.",
    priceLabel: "Rp 14.000/kg",
    estimate: "6–12 jam",
    icon: Zap,
  },
  {
    id: "dry-clean",
    name: "Dry Cleaning",
    description: "Perawatan khusus jas, gaun, dan bahan premium.",
    priceLabel: "Rp 35.000/item",
    estimate: "3–4 hari",
    icon: Wind,
  },
  {
    id: "setrika",
    name: "Setrika Saja",
    description: "Pakaian sudah bersih? Kami rapikan dengan setrika profesional.",
    priceLabel: "Rp 5.000/kg",
    estimate: "1 hari",
    icon: Layers,
  },
  {
    id: "sepatu",
    name: "Laundry Sepatu",
    description: "Deep clean sneaker & kasual, wangi dan higienis.",
    priceLabel: "Rp 35.000/pasang",
    estimate: "2–4 hari",
    icon: Footprints,
  },
  {
    id: "karpet",
    name: "Laundry Karpet",
    description: "Cuci karpet rumah & kantor, berbagai ukuran.",
    priceLabel: "Rp 25.000/m²",
    estimate: "3–5 hari",
    icon: BedDouble,
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Buat Order",
    description: "Pilih layanan, jadwal jemput, bayar cashless dari HP.",
    icon: "clipboard" as const,
  },
  {
    step: 2,
    title: "Kurir Pickup",
    description: "Kurir tiba tepat waktu, cucian ditimbang & dikonfirmasi.",
    icon: "truck" as const,
  },
  {
    step: 3,
    title: "Proses Laundry",
    description: "Dicuci, dikeringkan, disetrika — status update real-time.",
    icon: "sparkles" as const,
  },
  {
    step: 4,
    title: "Antar Kembali",
    description: "Pakaian rapi dikemas & diantar ke alamat Anda.",
    icon: "package" as const,
  },
] as const;

export const PRICING_TIERS = [
  {
    id: "reguler",
    name: "Reguler",
    description: "Cuci standar untuk kebutuhan harian",
    priceKg: 9000,
    priceItem: 15000,
    features: ["Cuci + setrika", "Estimasi 2–3 hari", "Pickup gratis 3 km"],
    highlight: false,
  },
  {
    id: "express",
    name: "Express",
    description: "Paling populer untuk profesional sibuk",
    priceKg: 14000,
    priceItem: 22000,
    features: ["Prioritas antrian", "Selesai 6–12 jam", "Notifikasi realtime"],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Perawatan khusus bahan premium",
    priceKg: 22000,
    priceItem: 45000,
    features: ["Dry clean included", "Dedicated handler", "Garansi kualitas"],
    highlight: false,
  },
] as const;

export const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Antar Jemput",
    description: "Kurir menjemput & mengantar ke rumah Anda. Gratis radius 3 km.",
    icon: Truck,
  },
  {
    title: "Tracking Real-time",
    description: "Pantau setiap tahap cucian lewat invoice atau nomor HP.",
    icon: Radar,
  },
  {
    title: "Express Service",
    description: "Selesai dalam 6–12 jam untuk kebutuhan mendesak.",
    icon: Zap,
  },
  {
    title: "Cashless Payment",
    description: "QRIS, e-wallet, transfer bank — tanpa uang tunai.",
    icon: CreditCard,
  },
];

export const HOW_IT_WORKS = [
  { step: 1, title: "Pesan Online", description: "Pilih layanan, jadwal jemput, dan bayar cashless." },
  { step: 2, title: "Kurir Jemput", description: "Tim kami mengambil cucian di alamat Anda." },
  { step: 3, title: "Proses & Lacak", description: "Cucian diproses; status diperbarui real-time." },
  { step: 4, title: "Antar Bersih", description: "Pakaian rapi dikemas dan diantar ke rumah." },
];

export const SERVICES = [
  {
    id: "cuci-kering",
    name: "Cuci Kering",
    description: "Cuci tanpa setrika, cocok untuk pakaian sehari-hari.",
    priceLabel: "Rp 7.000/kg",
    price: 7000,
    unit: "kg",
    estimate: "2–3 hari",
    icon: Wind,
  },
  {
    id: "cuci-setrika",
    name: "Cuci Setrika",
    description: "Cuci lengkap plus setrika rapi siap pakai.",
    priceLabel: "Rp 9.000/kg",
    price: 9000,
    unit: "kg",
    estimate: "2–3 hari",
    icon: Shirt,
  },
  {
    id: "express",
    name: "Express",
    description: "Prioritas proses cepat untuk kebutuhan mendesak.",
    priceLabel: "Rp 14.000/kg",
    price: 14000,
    unit: "kg",
    estimate: "6–12 jam",
    icon: Zap,
  },
  {
    id: "sepatu",
    name: "Laundry Sepatu",
    description: "Deep clean sepatu sneaker & kasual.",
    priceLabel: "Rp 35.000/pasang",
    price: 35000,
    unit: "pasang",
    estimate: "2–4 hari",
    icon: Footprints,
  },
  {
    id: "karpet",
    name: "Laundry Karpet",
    description: "Cuci karpet rumah & kantor berbagai ukuran.",
    priceLabel: "Rp 25.000/m²",
    price: 25000,
    unit: "m²",
    estimate: "3–5 hari",
    icon: Layers,
  },
  {
    id: "bed-cover",
    name: "Laundry Bed Cover",
    description: "Sprei, duvet, dan linen hotel quality.",
    priceLabel: "Rp 45.000/item",
    price: 45000,
    unit: "item",
    estimate: "3–4 hari",
    icon: BedDouble,
  },
] as const;

export const PRICING_ROWS = SERVICES.map((s) => ({
  service: s.name,
  price: s.priceLabel,
  estimate: s.estimate,
  minimum: s.unit === "kg" ? "Min. 3 kg" : s.unit === "m²" ? "Min. 1 m²" : "Min. 1 item",
}));

export const MEMBER_PACKAGES = [
  {
    name: "Silver",
    price: "Rp 99.000/bulan",
    perks: ["Diskon 10%", "Gratis pickup 2x", "Prioritas antrian"],
    highlight: false,
  },
  {
    name: "Gold",
    price: "Rp 199.000/bulan",
    perks: ["Diskon 20%", "Gratis pickup unlimited", "Express -15%", "Poin 2x"],
    highlight: true,
  },
  {
    name: "Platinum",
    price: "Rp 349.000/bulan",
    perks: ["Diskon 30%", "Dedicated kurir", "Garansi kualitas", "Konsultasi linen"],
    highlight: false,
  },
];

export const MONTHLY_PACKAGES = [
  { name: "Rumah Tangga", price: "Rp 450.000", detail: "~50 kg/bulan, cuci + setrika" },
  { name: "Kantor Kecil", price: "Rp 890.000", detail: "~100 kg/bulan + laporan invoice" },
  { name: "Apartemen", price: "Rp 1.200.000", detail: "Unlimited pickup 2x/minggu (max 80 kg)" },
];

export const PROMOS = [
  { title: "Diskon 25% Member Baru", code: "FRESH25", until: "30 Jun 2026" },
  { title: "Gratis Ongkir 3x", code: "GRATIS3", until: "Berlaku untuk Gold+" },
  { title: "Cashback 10% QRIS", code: "QRIS10", until: "Setiap weekend" },
];

export const TESTIMONIALS = [
  {
    name: "Dewi Santoso",
    role: "Ibu rumah tangga",
    text: "Pakaian selalu wangi dan rapi. Tracking-nya jelas, kurirnya sopan.",
    rating: 5,
    avatar: "DS",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Rizky Pratama",
    role: "Startup founder",
    text: "Express-nya beneran cepat. Cocok buat kemeja meeting besok pagi.",
    rating: 5,
    avatar: "RP",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Maya Kusuma",
    role: "Apartemen resident",
    text: "Antar jemputnya tepat waktu. Bayar pakai QRIS praktis banget.",
    rating: 5,
    avatar: "MK",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Andi Wijaya",
    role: "Karyawan kantor",
    text: "Dashboard tracking-nya modern banget. Tau persis cucian lagi di tahap mana.",
    rating: 5,
    avatar: "AW",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Siti Rahayu",
    role: "Owner kos-kosan",
    text: "Paket bulanan hemat. Linen kamar kos selalu fresh setiap minggu.",
    rating: 5,
    avatar: "SR",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Berapa lama laundry selesai?",
    a: "Reguler 2–3 hari kerja. Express 6–12 jam tergantung beban outlet.",
  },
  {
    q: "Apakah ada minimal berat?",
    a: "Ya, minimal 3 kg untuk layanan per kg. Layanan satuan tidak ada minimum berat.",
  },
  {
    q: "Bagaimana cara cek status pesanan?",
    a: "Gunakan halaman Cek Status dengan nomor invoice atau nomor HP terdaftar.",
  },
  {
    q: "Area pickup gratis di mana?",
    a: "Gratis radius 3 km dari cabang terdekat. Di luar radius dikenakan biaya per km.",
  },
  {
    q: "Apakah ada garansi?",
    a: "Kami memberikan garansi kualitas cuci. Klaim dalam 24 jam setelah pengantaran.",
  },
];

export const PUBLIC_TRACKING_STEPS = [
  { key: "CREATED", label: "Pesanan Dibuat" },
  { key: "PICKUP", label: "Dijemput" },
  { key: "WASH", label: "Dicuci" },
  { key: "DRY", label: "Dikeringkan" },
  { key: "IRON", label: "Disetrika" },
  { key: "DELIVER", label: "Diantar" },
  { key: "DONE", label: "Selesai" },
] as const;

export const BRANCHES = [
  { name: "Cabang Sudirman", address: "Jl. Sudirman No. 45, Jakarta", phone: "021-1234567" },
  { name: "Cabang BSD", address: "Ruko Golden Madrid, Tangerang", phone: "021-7654321" },
];

export const NAV_LINKS = [
  { to: "/", label: "Home", hash: "" },
  { to: "/", label: "Layanan", hash: "layanan" },
  { to: "/", label: "Harga", hash: "harga" },
  { to: "/cek-status", label: "Tracking", hash: "" },
  { to: "/", label: "Testimoni", hash: "testimoni" },
  { to: "/", label: "FAQ", hash: "faq" },
  { to: "/", label: "Contact", hash: "kontak" },
] as const;

export const FOOTER_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/layanan", label: "Layanan" },
  { to: "/harga", label: "Harga" },
  { to: "/cek-status", label: "Cek Status" },
  { to: "/tentang", label: "Tentang" },
  { to: "/kontak", label: "Kontak" },
] as const;

export const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1582735680399-3e889b9dd275?w=800&q=80",
  courier: "https://images.unsplash.com/photo-1600880292203-757bb62b3344?w=400&q=80",
  customer: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  facility: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80",
} as const;
