import { test, expect } from "@playwright/test";
import { setupEditingView } from "./helpers";

test.describe("Settings - P0 Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Upload image and navigate to editing view (Header becomes visible)
    await setupEditingView(page);
  });

  test("should open settings modal from header", async ({ page }) => {
    // Settings button is in Header, which only appears after image upload
    const settingsButton = page.getByTestId("settings-button");
    await expect(settingsButton).toBeVisible({ timeout: 3000 });
    await settingsButton.click();

    // Settings modal should open
    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });
  });

  test("should display API Key tab in settings", async ({ page }) => {
    // Open settings (Header is now visible after image upload)
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.click();

    // Wait for settings modal
    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });

    // Check for API Key tab button (in the sidebar navigation)
    const apiKeyTab = page.getByTestId("settings-tab-api-key");
    await expect(apiKeyTab).toBeVisible({ timeout: 3000 });
  });

  test("should allow managing API key", async ({ page }) => {
    // Open settings
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.click();

    // Wait for settings modal
    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });

    // Verify API Key tab is active (it's the default tab)
    const apiKeyTab = page.getByTestId("settings-tab-api-key");
    await expect(apiKeyTab).toBeVisible({ timeout: 3000 });

    // Check for API key input field
    const apiKeyInput = page.getByTestId("api-key-input");
    await expect(apiKeyInput).toBeVisible({ timeout: 3000 });
  });

  test("should navigate to presets tab", async ({ page }) => {
    // Open settings
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.click();

    // Wait for settings modal
    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });

    // Click on Presets tab button
    const presetsTab = page.getByTestId("settings-tab-presets");
    await expect(presetsTab).toBeVisible({ timeout: 3000 });
    await presetsTab.click();

    // Check for preset management content
    await expect(page.getByText(/Preset Management/i)).toBeVisible({
      timeout: 3000,
    });
  });
});
