interface GeminiErrorDetails {
  "@type": string;
  reason?: string;
  domain?: string;
  message?: string;
}

interface GeminiError {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: GeminiErrorDetails[];
  };
  message?: string;
  status?: string;
  code?: number;
}

export const isInvalidApiKeyError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const geminiError = error as GeminiError;

  // Check error structure from Gemini API
  if (geminiError.error) {
    const apiError = geminiError.error;
    
    // Check status
    if (apiError.status === "INVALID_ARGUMENT") {
      // Check details for API_KEY_INVALID reason
      if (apiError.details && Array.isArray(apiError.details)) {
        const hasInvalidKeyReason = apiError.details.some(
          (detail) => detail.reason === "API_KEY_INVALID"
        );
        if (hasInvalidKeyReason) return true;
      }
      
      // Check message
      if (
        apiError.message &&
        (apiError.message.includes("API key not valid") ||
          apiError.message.includes("invalid API key") ||
          apiError.message.includes("API_KEY_INVALID"))
      ) {
        return true;
      }
    }
  }

  // Check direct error properties
  if (
    geminiError.message &&
    (geminiError.message.includes("API key not valid") ||
      geminiError.message.includes("invalid API key") ||
      geminiError.message.includes("API_KEY_INVALID"))
  ) {
    return true;
  }

  // Check if it's an Error object with API key message
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (
      errorMessage.includes("api key not valid") ||
      errorMessage.includes("invalid api key") ||
      errorMessage.includes("api_key_invalid")
    ) {
      return true;
    }
  }

  return false;
};

export const getErrorMessage = (error: unknown): string => {
  if (isInvalidApiKeyError(error)) {
    return "Your API key is invalid. Please check your Gemini API key in settings and update it.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "error" in error) {
    const geminiError = error as GeminiError;
    if (geminiError.error?.message) {
      return geminiError.error.message;
    }
  }

  return "An unknown error occurred. Please try again.";
};

