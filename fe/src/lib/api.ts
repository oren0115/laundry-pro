import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // FormData harus pakai multipart boundary — jangan pakai default application/json
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token");

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export const STATUS_LABELS: Record<string, string> = {
  DITERIMA: "Diterima",
  DICUCI: "Dicuci",
  DIKERINGKAN: "Dikeringkan",
  DISETRIKA: "Disetrika",
  PACKING: "Packing",
  SELESAI: "Selesai",
  DIAMBIL: "Diambil",
};
