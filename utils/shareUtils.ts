/**
 * Utility functions for sharing and copying images
 */

/**
 * Copies an image data URL to clipboard
 * Note: This requires the image to be converted to a blob first
 */
export const copyImageToClipboard = async (
  imageDataUrl: string
): Promise<void> => {
  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Use Clipboard API if available
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      return;
    }

    // Fallback: Copy as file (not supported in all browsers)
    throw new Error(
      "Clipboard API not fully supported. Please use download or share options."
    );
  } catch (error) {
    console.error("Failed to copy image to clipboard:", error);
    throw error;
  }
};

/**
 * Copies text to clipboard
 */
export const copyTextToClipboard = async (text: string): Promise<void> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    throw error;
  }
};

/**
 * Generates share URLs for social media platforms
 */
export const getShareUrl = (
  platform: "twitter" | "linkedin" | "facebook",
  imageUrl: string,
  appUrl: string,
  customText?: string
): string => {
  const defaultText =
    customText ||
    "Just created an amazing AI-powered portrait edit with Quick Portrait! 🎨✨";
  const encodedText = encodeURIComponent(defaultText);
  const encodedUrl = encodeURIComponent(appUrl);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    default:
      return appUrl;
  }
};

/**
 * Opens a share dialog (native Web Share API if available)
 */
export const shareImage = async (
  imageDataUrl: string,
  filename: string = "quick-portrait-edit.png"
): Promise<void> => {
  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });

    // Use native Web Share API if available
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Quick Portrait Edit",
        text: "Check out my AI-powered portrait edit!",
        files: [file],
      });
      return;
    }

    // Fallback: Copy image data URL to clipboard
    await copyTextToClipboard(imageDataUrl);
    throw new Error(
      "Native sharing not available. Image URL copied to clipboard."
    );
  } catch (error) {
    // If user cancels share, don't throw error
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    throw error;
  }
};
