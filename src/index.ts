import { router } from "./router";
import { runMigrations } from "./db/migrate";
import { join } from "path";

runMigrations();

const isProd = process.env.NODE_ENV === "production";
const distDir = join(import.meta.dir, "../dist");

const server = Bun.serve({
  port: process.env.PORT ?? 3001,
  async fetch(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname.startsWith("/api/")) {
      return router(req);
    }

    if (isProd) {
      const file = Bun.file(join(distDir, pathname));
      if (await file.exists()) return new Response(file);
      return new Response(Bun.file(join(distDir, "index.html")));
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`API running on http://localhost:${server.port}`);
