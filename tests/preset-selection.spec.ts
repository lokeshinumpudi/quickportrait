import { test, expect } from "@playwright/test";
import { setupEditingView } from "./helpers";

test.describe("Preset Selection - P0 Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Upload image and navigate to editing view
    await setupEditingView(page);
  });

  test("should display preset selection buttons", async ({ page }) => {
    // Check that preset buttons are visible
    const portraitifyButton = page.getByTestId("preset-button-Portraitify");
    await expect(portraitifyButton).toBeVisible();
  });

  test("should allow selecting a preset", async ({ page }) => {
    // Click on Portraitify preset
    await page.getByTestId("preset-button-Portraitify").click();

    // Check that prompt text area is populated
    const promptTextarea = page.getByTestId("prompt-textarea");
    await expect(promptTextarea).toHaveValue(/.+/);
  });

  test("should display color picker for color presets", async ({ page }) => {
    // Select Dress Recolor preset
    await page.getByTestId("preset-button-DressRecolor").click();

    // Check that color picker appears
    await expect(page.getByTestId("color-picker")).toBeVisible();
  });

  test("should allow editing prompt text", async ({ page }) => {
    // Select a preset first
    await page.getByTestId("preset-button-Portraitify").click();

    // Edit the prompt
    const promptTextarea = page.getByTestId("prompt-textarea");
    await promptTextarea.fill("Test prompt for editing");

    // Verify the text was entered
    await expect(promptTextarea).toHaveValue("Test prompt for editing");
  });
});
