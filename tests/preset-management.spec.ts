import { test, expect } from "@playwright/test";
import { setupEditingView } from "./helpers";

test.describe("Preset Management - P0 Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Upload image and navigate to editing view (Header becomes visible)
    await setupEditingView(page);

    // Open settings (Header is now visible)
    const settingsButton = page.getByTestId("settings-button");
    await expect(settingsButton).toBeVisible({ timeout: 3000 });
    await settingsButton.click();

    // Wait for settings modal
    await expect(page.getByTestId("settings-modal")).toBeVisible({ timeout: 3000 });

    // Navigate to presets tab
    const presetsTab = page.getByTestId("settings-tab-presets");
    await expect(presetsTab).toBeVisible({ timeout: 3000 });
    await presetsTab.click();

    await expect(page.getByText(/Preset Management/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("should display list of presets", async ({ page }) => {
    // Check that preset list is visible
    await expect(page.getByText(/All Presets/i)).toBeVisible({
      timeout: 3000,
    });

    // Check that at least one preset is displayed
    const presetItems = page
      .locator('[class*="glass"][class*="border"]')
      .filter({ hasText: /Portraitify|Dress Recolor/i });
    await expect(presetItems.first()).toBeVisible({ timeout: 3000 });
  });

  test("should allow creating new preset", async ({ page }) => {
    // Click "New Preset" button
    const newPresetButton = page.getByRole("button", { name: /New Preset/i });
    await expect(newPresetButton).toBeVisible({ timeout: 3000 });
    await newPresetButton.click();

    // Editor should open
    await expect(page.getByText(/Edit Custom Preset/i)).toBeVisible({
      timeout: 3000,
    });

    // Check for preset name input
    const nameInput = page
      .locator('input[placeholder*="preset name"], input[type="text"]')
      .first();
    await expect(nameInput).toBeVisible({ timeout: 3000 });
  });

  test("should allow editing existing preset", async ({ page }) => {
    // Find and click edit button on first preset (use test ID for reliability)
    // First, wait for presets to load
    await expect(page.getByText(/All Presets/i)).toBeVisible({
      timeout: 3000,
    });

    // Find the first preset's edit button using test ID
    // We'll use Portraitify as it's a built-in preset that should always exist
    const editButton = page.getByTestId("edit-preset-button-Portraitify");
    await expect(editButton).toBeVisible({ timeout: 3000 });
    await editButton.click();

    // Editor should open
    await expect(
      page
        .getByText(/Edit Custom Preset/i)
        .or(page.getByText(/Edit Preset Prompt/i))
    ).toBeVisible({ timeout: 3000 });
  });

  test("should display preset names correctly", async ({ page }) => {
    // Check that preset names are visible (not just IDs)
    const presetNames = page.locator('h5, [class*="font-bold"]').filter({
      hasText: /Portraitify|Dress Recolor|Background Replace|Object Removal/i,
    });

    // At least one preset name should be visible
    const count = await presetNames.count();
    expect(count).toBeGreaterThan(0);
  });
});
