import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bun run dev:api",
      url: "http://localhost:3001/api/setup-status",
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
      env: {
        DB_PATH: "/tmp/pool-tracker-test.db",
        BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long",
        BETTER_AUTH_URL: "http://localhost:3001",
        FRONTEND_ORIGIN: "http://localhost:5173",
      },
    },
    {
      command: "bun run dev:web",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
  ],
  globalSetup: "./global-setup.ts",
});
