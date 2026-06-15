/**
 * Smoke test: starts the server in production mode, hits key endpoints, reports pass/fail.
 * Run with: bun run smoke
 *
 * Requires: `bun run build` first (dist/ must exist)
 */
import { join } from "path";
import { existsSync } from "fs";
import { rm } from "fs/promises";

const PORT = 3099; // Use a different port so it doesn't conflict with dev
const BASE = `http://localhost:${PORT}`;
const TEST_DB = "/tmp/pool-tracker-smoke.db";

let passed = 0;
let failed = 0;

function ok(label: string) {
  console.log(`  ✓ ${label}`);
  passed++;
}

function fail(label: string, detail?: string) {
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

async function check(label: string, fn: () => Promise<void>) {
  try {
    await fn();
    ok(label);
  } catch (e: unknown) {
    fail(label, e instanceof Error ? e.message : String(e));
  }
}

async function get(path: string) {
  return fetch(`${BASE}${path}`);
}

// Verify dist exists
if (!existsSync(join(import.meta.dir, "../dist/index.html"))) {
  console.error("dist/index.html not found — run `bun run build` first");
  process.exit(1);
}

// Clean test DB
await rm(TEST_DB, { force: true });
await rm(`${TEST_DB}-shm`, { force: true });
await rm(`${TEST_DB}-wal`, { force: true });

// Start server
const proc = Bun.spawn(["bun", "src/index.ts"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
    DB_PATH: TEST_DB,
    BETTER_AUTH_SECRET: "smoke-test-secret-at-least-32-chars-long",
    BETTER_AUTH_URL: BASE,
  },
  stdout: "ignore",
  stderr: "ignore",
});

// Wait for server to be ready
let ready = false;
for (let i = 0; i < 20; i++) {
  try {
    await fetch(`${BASE}/api/setup-status`);
    ready = true;
    break;
  } catch {
    await Bun.sleep(150);
  }
}

if (!ready) {
  proc.kill();
  console.error("Server failed to start");
  process.exit(1);
}

console.log("\nSmoke tests:");

await check("GET / → serves index.html", async () => {
  const res = await get("/");
  if (!res.ok) throw new Error(`status ${res.status}`);
  const text = await res.text();
  if (!text.includes("<!doctype")) throw new Error("no doctype in response");
});

await check("GET /api/setup-status → needsSetup:true on fresh DB", async () => {
  const res = await get("/api/setup-status");
  const json = (await res.json()) as { needsSetup: boolean };
  if (!json.needsSetup) throw new Error(`expected needsSetup:true, got ${JSON.stringify(json)}`);
});

await check("GET /assets/* → serves CSS", async () => {
  // Find any CSS asset from dist/
  const glob = new Bun.Glob("assets/*.css");
  const files = [...glob.scanSync(join(import.meta.dir, "../dist"))];
  if (files.length === 0) throw new Error("no CSS asset found in dist/");
  const res = await get(`/${files[0]}`);
  if (!res.ok) throw new Error(`status ${res.status}`);
});

await check("GET /unknown-route → SPA fallback (index.html)", async () => {
  const res = await get("/history");
  if (!res.ok) throw new Error(`status ${res.status}`);
  const text = await res.text();
  if (!text.includes("<!doctype")) throw new Error("no doctype in fallback response");
});

await check("POST /api/auth/sign-up/email → creates user", async () => {
  const res = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "smoke@test.com", password: "password123", name: "Smoke" }),
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
});

await check("GET /api/setup-status → needsSetup:false after signup", async () => {
  const res = await get("/api/setup-status");
  const json = (await res.json()) as { needsSetup: boolean };
  if (json.needsSetup) throw new Error("expected needsSetup:false after signup");
});

await check("POST /api/auth/sign-up/email again → 403 (registration closed)", async () => {
  const res = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "second@test.com", password: "password123", name: "Second" }),
  });
  if (res.status !== 403) throw new Error(`expected 403, got ${res.status}`);
});

proc.kill();

console.log(`\n${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
