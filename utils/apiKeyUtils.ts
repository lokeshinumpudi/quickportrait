const API_KEY_STORAGE_KEY = "gemini_api_key";

export const getApiKey = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (apiKey: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const hasApiKey = (): boolean => {
  return getApiKey() !== null;
};
