const MAX_FILE_SIZE_STORAGE_KEY = "max_file_size_mb";
const DEFAULT_MAX_FILE_SIZE_MB = 10;

/**
 * Get the maximum file size limit in megabytes
 */
export const getMaxFileSizeMB = (): number => {
  if (typeof window === "undefined") return DEFAULT_MAX_FILE_SIZE_MB;

  const stored = localStorage.getItem(MAX_FILE_SIZE_STORAGE_KEY);
  if (stored) {
    const parsed = parseFloat(stored);
    // Validate that it's a reasonable number (between 1MB and 100MB)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
      return parsed;
    }
  }

  return DEFAULT_MAX_FILE_SIZE_MB;
};

/**
 * Set the maximum file size limit in megabytes
 */
export const setMaxFileSizeMB = (sizeMB: number): void => {
  if (typeof window === "undefined") return;

  // Validate size is between 1MB and 100MB
  if (sizeMB >= 1 && sizeMB <= 100) {
    localStorage.setItem(MAX_FILE_SIZE_STORAGE_KEY, sizeMB.toString());
  }
};

/**
 * Reset to default file size limit
 */
export const resetMaxFileSizeMB = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MAX_FILE_SIZE_STORAGE_KEY);
};

/**
 * Convert megabytes to bytes
 */
export const mbToBytes = (mb: number): number => {
  return mb * 1024 * 1024;
};

/**
 * Convert bytes to megabytes
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

/**
 * Format bytes to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validate if file size is within the limit
 */
export const validateFileSize = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSizeMB = getMaxFileSizeMB();
  const maxSizeBytes = mbToBytes(maxSizeMB);

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${formatFileSize(
        file.size
      )}) exceeds the maximum limit of ${maxSizeMB}MB. Please choose a smaller image or increase the limit in settings.`,
    };
  }

  return { valid: true };
};
