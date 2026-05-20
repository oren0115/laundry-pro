# LaundryPro - Laundry Management System

Aplikasi manajemen laundry fullstack: dashboard analytics, order tracking real-time, QR code, membership, multi-cabang, inventori, pickup/delivery, dan laporan keuangan.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, TailwindCSS, Zustand, React Router, Axios, Recharts, Socket.IO Client |
| Backend | Express 5, TypeScript, Prisma, PostgreSQL, JWT, Socket.IO |
| Fitur diabaikan (sesuai requirements) | Pembayaran online (Midtrans), AI, Mobile app |

## Struktur Proyek

```
laundry/
├── be/                 # Backend API
│   ├── prisma/         # Schema, seed, ERD
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/   # WhatsApp stub
│       └── socket/
└── fe/                 # Frontend React
    └── src/
        ├── pages/
        ├── layouts/
        ├── store/
        └── components/
```

## Persiapan

### 1. PostgreSQL

Buat database `laundry_db` di PostgreSQL.

### 2. Backend

```bash
cd be
cp .env.example .env
# Edit DATABASE_URL dan JWT secrets di .env

npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Server berjalan di `http://localhost:3001`

### 3. Frontend

```bash
cd fe
cp .env.example .env
pnpm install   # atau npm install
pnpm dev
```

Aplikasi berjalan di `http://localhost:5173`

## Akun Demo (setelah seed)

| Email | Role | Password |
|-------|------|----------|
| owner@laundry.com | Owner | password123 |
| admin@laundry.com | Admin | password123 |
| kasir@laundry.com | Kasir | password123 |
| operator@laundry.com | Operator | password123 |
| customer@demo.com | Customer | password123 |

## API Utama

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrasi customer
- `GET /api/dashboard` - Analytics
- `GET/POST /api/orders` - Manajemen order
- `PATCH /api/orders/:id/status` - Update status + realtime
- `GET /api/orders/qr/:qrCode` - Lookup QR
- `GET/POST /api/customers` - Pelanggan
- `GET /api/reports/financial` - Laporan keuangan
- `GET /api/reports/export/pdf|excel` - Export

## Fitur

- Auth JWT + refresh token, RBAC multi-role
- Dashboard: pendapatan, grafik order, layanan populer, express vs reguler
- Order: 7 status tracking, QR code, smart pricing (express, member, weekend)
- Real-time via Socket.IO
- Membership & poin
- Multi cabang
- Inventori + alert stok menipis
- Pickup/delivery + ongkir otomatis
- WhatsApp notifikasi (stub/log mode tanpa API key)
- Laporan PDF & Excel
- Audit log & login history
- Dark mode

## WhatsApp (Opsional)

Isi `WHATSAPP_API_URL` dan `WHATSAPP_API_TOKEN` di `be/.env` untuk gateway (Fonnte/Wablas). Tanpa konfigurasi, notifikasi dicetak ke console.
