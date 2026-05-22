import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket | null = null;

export function getSocket() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;
  if (!socket) {
    socket = io(SOCKET_URL, { auth: { token } });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
