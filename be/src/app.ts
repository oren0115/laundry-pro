import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { error } from "./utils/apiResponse.js";

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: "Terlalu banyak request" },
  })
);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.use((_req, res) => error(res, "Endpoint tidak ditemukan", 404));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  error(res, "Terjadi kesalahan server", 500);
});

export default app;
