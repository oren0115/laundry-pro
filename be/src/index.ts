import { createServer } from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/index.js";
import { prisma } from "./lib/prisma.js";

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
