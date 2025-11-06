import { Page, expect } from "@playwright/test";

/**
 * Uploads a test image to get to the editing view where Header is visible
 * This is needed for most tests since settings and other features are only
 * accessible after uploading an image.
 */
export async function uploadTestImage(page: Page): Promise<void> {
  const testImage = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "test.png",
    mimeType: "image/png",
    buffer: testImage,
  });
  // Wait for editing view to appear
  await expect(page.getByText(/Choose Preset/i)).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Sets up the page to be in editing view (uploads image and waits for editing panel)
 * Use this in beforeEach hooks for tests that need editing view access
 */
export async function setupEditingView(page: Page): Promise<void> {
  // Mark onboarding as completed to prevent modal from appearing
  await page.addInitScript(() => {
    localStorage.setItem("qp_onboarding_completed", "true");
  });

  await page.goto("/");

  // Upload test image
  await uploadTestImage(page);

  // Ensure onboarding is dismissed if it somehow appears
  const onboardingModal = page.locator('[data-testid="onboarding-modal"]');
  const isOnboardingVisible = await onboardingModal
    .isVisible()
    .catch(() => false);
  if (isOnboardingVisible) {
    // Try to close onboarding by clicking close button
    const closeButton = page
      .getByRole("button", { name: /close onboarding/i })
      .first();
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }
  }
}
