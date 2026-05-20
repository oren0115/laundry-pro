import { env } from "../config/env.js";

export async function sendWhatsApp(phone: string, message: string) {
  const normalized = phone.replace(/\D/g, "").replace(/^0/, "62");

  if (!env.whatsappApiUrl || !env.whatsappApiToken) {
    console.log(`[WhatsApp STUB] To: ${normalized} | ${message}`);
    return { sent: false, stub: true };
  }

  try {
    const res = await fetch(env.whatsappApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.whatsappApiToken}`,
      },
      body: JSON.stringify({ phone: normalized, message }),
    });
    return { sent: res.ok, stub: false };
  } catch {
    console.log(`[WhatsApp FAIL] To: ${normalized} | ${message}`);
    return { sent: false, stub: false };
  }
}

export const waTemplates = {
  orderReceived: (name: string, orderNo: string) =>
    `Halo ${name}, order laundry ${orderNo} telah diterima. Terima kasih!`,
  orderComplete: (name: string, orderNo: string) =>
    `Halo ${name}, laundry Anda (${orderNo}) sudah selesai dan siap diambil.`,
  pickupAssigned: (name: string) =>
    `Halo ${name}, kurir kami sedang menuju lokasi penjemputan laundry Anda.`,
  promo: (name: string) =>
    `Halo ${name}, dapatkan diskon 10% untuk member Gold! Hubungi kami untuk info.`,
};
