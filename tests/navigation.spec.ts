import { test, expect } from "@playwright/test";
import { setupEditingView, uploadTestImage } from "./helpers";

test.describe("Navigation - P0 Flows", () => {
  test("should navigate from landing to editing view", async ({ page }) => {
    await page.goto("/");
    // Upload image to test navigation from landing to editing view
    await uploadTestImage(page);

    // Should see editing panel
    await expect(page.getByText(/Choose Preset/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("should open preset settings from editing panel", async ({ page }) => {
    // Upload image and navigate to editing view
    await setupEditingView(page);

    // Click "Manage" button next to "Choose Preset"
    const manageButton = page.getByRole("button", {
      name: /Open preset settings/i,
    });
    await expect(manageButton).toBeVisible({ timeout: 3000 });
    await manageButton.click();

    // Should open settings with presets tab
    await expect(page.getByTestId("settings-modal")).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText(/Preset Management/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("should close settings modal", async ({ page }) => {
    // Upload image and navigate to editing view (Header becomes visible)
    await setupEditingView(page);

    // Open settings (Header is now visible)
    const settingsButton = page.getByTestId("settings-button");
    await expect(settingsButton).toBeVisible({ timeout: 3000 });
    await settingsButton.click();

    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });

    // Close modal (look for close button)
    const closeButton = page
      .locator('button[aria-label*="Close"], button[aria-label*="close"]')
      .or(page.locator("button").filter({ hasText: /×|Close/i }))
      .first();

    await expect(closeButton).toBeVisible({ timeout: 2000 });
    await closeButton.click();

    // Settings modal should close
    await expect(page.getByTestId("settings-modal")).not.toBeVisible({
      timeout: 2000,
    });
  });
});
