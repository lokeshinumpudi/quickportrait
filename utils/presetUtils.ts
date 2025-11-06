const CUSTOM_PRESETS_STORAGE_KEY = "custom_presets";
const EDITED_PROMPTS_STORAGE_KEY = "edited_prompts";
const PRESET_ORDER_STORAGE_KEY = "preset_order";

export interface CustomPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface EditedPrompt {
  presetId: string;
  prompt: string;
  updatedAt: number;
}

// Custom Presets Management
export const getCustomPresets = (): CustomPreset[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCustomPreset = (preset: CustomPreset): void => {
  if (typeof window === "undefined") return;
  try {
    const presets = getCustomPresets();
    const existingIndex = presets.findIndex((p) => p.id === preset.id);

    if (existingIndex >= 0) {
      presets[existingIndex] = { ...preset, updatedAt: Date.now() };
    } else {
      presets.push({ ...preset, createdAt: Date.now(), updatedAt: Date.now() });
    }

    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error("Failed to save custom preset:", error);
  }
};

export const deleteCustomPreset = (presetId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const presets = getCustomPresets();
    const filtered = presets.filter((p) => p.id !== presetId);
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete custom preset:", error);
  }
};

// Edited Prompts Management (for default presets)
export const getEditedPrompts = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(EDITED_PROMPTS_STORAGE_KEY);
    const edited: EditedPrompt[] = stored ? JSON.parse(stored) : [];
    return edited.reduce((acc, item) => {
      acc[item.presetId] = item.prompt;
      return acc;
    }, {} as Record<string, string>);
  } catch {
    return {};
  }
};

export const saveEditedPrompt = (presetId: string, prompt: string): void => {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(EDITED_PROMPTS_STORAGE_KEY);
    const edited: EditedPrompt[] = stored ? JSON.parse(stored) : [];
    const existingIndex = edited.findIndex((e) => e.presetId === presetId);

    const editedPrompt: EditedPrompt = {
      presetId,
      prompt,
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      edited[existingIndex] = editedPrompt;
    } else {
      edited.push(editedPrompt);
    }

    localStorage.setItem(EDITED_PROMPTS_STORAGE_KEY, JSON.stringify(edited));
  } catch (error) {
    console.error("Failed to save edited prompt:", error);
  }
};

export const resetEditedPrompt = (presetId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(EDITED_PROMPTS_STORAGE_KEY);
    const edited: EditedPrompt[] = stored ? JSON.parse(stored) : [];
    const filtered = edited.filter((e) => e.presetId !== presetId);
    localStorage.setItem(EDITED_PROMPTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to reset edited prompt:", error);
  }
};

export const resetAllEditedPrompts = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(EDITED_PROMPTS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset all edited prompts:", error);
  }
};

// Generate unique ID for custom presets
export const generatePresetId = (name: string): string => {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const timestamp = Date.now();
  return `custom-${sanitized}-${timestamp}`;
};

// Preset Order Management
export const getPresetOrder = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(PRESET_ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const savePresetOrder = (order: string[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRESET_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    console.error("Failed to save preset order:", error);
  }
};

export const resetPresetOrder = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PRESET_ORDER_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset preset order:", error);
  }
};
