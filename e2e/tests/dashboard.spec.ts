import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeAll(async ({ browser }) => {
    // Seed a user via the setup flow
    const page = await browser.newPage();
    await page.goto("/setup");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByLabel(/pool name/i).fill("Test Pool");
    await page.getByLabel(/gallons/i).fill("15000");
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL("/");
    await page.context().storageState({ path: "e2e/.auth.json" });
    await page.close();
  });

  test.use({ storageState: "e2e/.auth.json" });

  test("shows pool name, parameter cards, and last maintenance section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Test Pool")).toBeVisible();
    await expect(page.getByText("Water Chemistry")).toBeVisible();

    // 6 parameter cards with "No data" state
    const noDataBadges = page.getByText("No data");
    await expect(noDataBadges).toHaveCount(6);

    await expect(page.getByText("Last Maintenance")).toBeVisible();
  });

  test("FAB expands with three log options", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "+" }).click();

    await expect(page.getByText("Test Results")).toBeVisible();
    await expect(page.getByText("Chemicals")).toBeVisible();
    await expect(page.getByText("Maintenance")).toBeVisible();
  });

  test("logging a test reading updates dashboard parameter cards", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "+" }).click();
    await page.getByText("Test Results").click();

    // Drawer should open
    await expect(page.getByText("Log Test Results")).toBeVisible();

    await page.getByLabel(/free chlorine/i).fill("3.2");
    await page.getByLabel(/ph/i).fill("7.4");

    await page.getByRole("button", { name: /save/i }).click();

    // Dashboard should update — Free Chlorine should no longer show "No data"
    await expect(page.getByText("No data")).not.toHaveCount(6);
    await expect(page.getByText("3.2")).toBeVisible();
  });
});
