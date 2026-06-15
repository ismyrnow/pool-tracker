import { test, expect } from "@playwright/test";

test.describe("First-time setup", () => {
  test("redirects to /setup on fresh DB", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/setup/);
  });

  test("setup page renders account and pool sections", async ({ page }) => {
    await page.goto("/setup");
    await expect(page.getByText("Your Account")).toBeVisible();
    await expect(page.getByText("Your Pool")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("completing setup lands on dashboard", async ({ page }) => {
    await page.goto("/setup");

    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByLabel(/pool name/i).fill("Test Pool");
    await page.getByLabel(/gallons/i).fill("15000");

    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Test Pool")).toBeVisible();
  });

  test("registration is blocked after first user exists", async ({ page }) => {
    const res = await page.request.post("/api/auth/sign-up/email", {
      data: { email: "second@example.com", password: "password123", name: "Second" },
    });
    expect(res.status()).toBe(403);
  });
});
