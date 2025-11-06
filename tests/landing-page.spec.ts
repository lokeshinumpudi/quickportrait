import { test, expect } from "@playwright/test";

test.describe("Landing Page - P0 Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display landing page with upload button", async ({ page }) => {
    // Check main heading
    await expect(page.getByText(/AI-POWERED PHOTO EDITING/i)).toBeVisible();

    // Check upload button
    await expect(page.getByText(/START EDITING/i)).toBeVisible();

    // Check footer
    await expect(page.getByText(/Powered by Gemini AI/i)).toBeVisible();
  });

  test("should allow image upload", async ({ page }) => {
    // Create a test image file
    const testImage = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: testImage,
    });

    // Should navigate to editing view after upload
    await expect(page.getByText(/Choose Preset/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
