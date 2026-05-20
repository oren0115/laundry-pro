import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.frontendUrl, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const user = verifyAccessToken(token);
      socket.data.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as { userId: string; branchId?: string | null };
    if (user.branchId) socket.join(`branch:${user.branchId}`);

    socket.on("order:subscribe", (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on("order:unsubscribe", (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

export function getIO() {
  return io;
}
