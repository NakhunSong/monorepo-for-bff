import { serve } from "@hono/node-server";
import { createApp } from "./app";

export type { AppType } from "./app";

const app = createApp();

// 서버 시작
const port = Number(process.env.PORT) || 4001;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
