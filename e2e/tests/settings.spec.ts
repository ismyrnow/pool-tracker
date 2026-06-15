import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test.use({ storageState: "e2e/.auth.json" });

  test("updating pool name reflects on dashboard", async ({ page }) => {
    await page.goto("/settings");

    const nameInput = page.getByLabel(/pool name/i);
    await nameInput.clear();
    await nameInput.fill("My Updated Pool");

    await page.getByRole("button", { name: /save/i }).click();

    await page.goto("/");
    await expect(page.getByText("My Updated Pool")).toBeVisible();
  });
});
