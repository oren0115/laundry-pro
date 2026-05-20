import "dotenv/config";

export const env = {
  port: parseInt(process.env.PORT ?? "3001", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  whatsappApiUrl: process.env.WHATSAPP_API_URL ?? "",
  whatsappApiToken: process.env.WHATSAPP_API_TOKEN ?? "",
};
