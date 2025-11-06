import { Preset } from "./types";
import {
  getCustomPresets,
  getEditedPrompts,
  getPresetOrder,
  type CustomPreset,
} from "./utils/presetUtils";

export const PRESET_OPTIONS = Object.values(Preset);

export const PROMPT_TEMPLATES: Record<Preset, string> = {
  [Preset.Portraitify]:
    "Professional studio headshot: upper body portrait, centered, eye-level. Subject with clear, even skin tone, subtle natural texture, radiant sparkling eyes, and a confident subtle smile with bright teeth. Soft, diffused studio lighting gently sculpting features. Shallow depth of field with creamy, blurred bokeh background. Rich, cinematic color grading with warm, inviting tones. Hyperrealistic, sharp focus on the face, high detail, polished.",
  [Preset.DressRecolor]:
    "Realistically change the color of the main subject's garment to {{color}}. Preserve all fabric details, textures, folds, and lighting (shadows and highlights). Isolate the color change to the garment only, leaving skin tones, background, and other elements untouched. The result should be photorealistic, as if it were a color selection mask with a hue/saturation adjustment.",
  [Preset.BackgroundReplace]:
    "Expertly mask the subject and replace the background with a {{style}} studio backdrop. Create a perfect, clean edge, especially around fine details like hair. Integrate the subject into the new background with realistic lighting, including a subtle rim light for separation and soft, diffused shadows on the ground if applicable. The final composition must be seamless and photorealistic.",
  [Preset.ObjectRemoval]:
    "Remove the {{object to remove}} from the image. Inpaint the removed area seamlessly using a content-aware fill technique. The patch must perfectly match the surrounding textures, lighting, shadows, and perspective. The final image should show no signs of editing.",
  [Preset.ColorizeBW]:
    "Add realistic and natural color to this black-and-white photograph. Prioritize authentic skin tones. For clothing and objects, use colors that are contextually and historically appropriate. The final image should have a balanced, lifelike color palette, avoiding oversaturation. Restore the photo as if it were originally shot in color.",
  [Preset.ProductStage]:
    "Isolate the main product and place it on a clean, seamless studio background (e.g., neutral gray or white). Generate a realistic soft shadow beneath the product to ground it. Use professional studio lighting (e.g., three-point lighting) to enhance the product's form and texture. Keep all edges of the product sharp and clean. Correct any distracting reflections. The result should be a high-quality product shot suitable for e-commerce.",
  [Preset.RemoveBlemishes]:
    "Perform high-end, non-destructive skin retouching. Remove temporary skin blemishes, pimples, and stray hairs. Even out skin tone subtly. CRITICAL: Preserve all natural skin texture, pores, and fine lines to ensure a realistic result. Do not alter the subject's facial features or identity. The effect should be subtle and natural.",
  [Preset.VintageFilm]:
    "Emulate the look of a vintage film photograph (e.g., Kodak Portra 400). Apply a warm color grade with slightly desaturated colors. Add fine, realistic film grain. Reduce contrast by lifting the blacks (faded look). Add a subtle, dark vignette around the edges. The overall mood should be nostalgic and cinematic.",
  [Preset.HairHighlight]:
    'Add subtle, natural-looking hair highlights in a {{color}} tone. The highlights should blend seamlessly with the existing hair, following its natural flow and texture. Ensure there is no "halo" effect or color bleed onto the scalp or skin. The result should look like professional balayage, not artificial streaks.',
  [Preset.TeethWhitening]:
    'Perform a natural teeth whitening enhancement. Reduce yellow stains and increase brightness to a realistic, healthy level. Preserve the natural texture and translucency of the teeth. Avoid an overly white, opaque, or "blinding" result. The edit should be subtle and believable.',
};

export const PRESET_NAMES: Record<Preset, string> = {
  [Preset.Portraitify]: "Portraitify",
  [Preset.DressRecolor]: "Dress Recolor",
  [Preset.BackgroundReplace]: "Background Replace",
  [Preset.ObjectRemoval]: "Object Removal",
  [Preset.ColorizeBW]: "Colorize B&W",
  [Preset.ProductStage]: "Product Stage",
  [Preset.RemoveBlemishes]: "Remove Blemishes",
  [Preset.VintageFilm]: "Vintage Film",
  [Preset.HairHighlight]: "Hair Highlight",
  [Preset.TeethWhitening]: "Teeth Whitening",
};

export const PRESET_DESCRIPTIONS: Record<Preset, string> = {
  [Preset.Portraitify]:
    "A full pro retouch: skin smoothing, eye brightening, color grading, and bokeh.",
  [Preset.DressRecolor]:
    "Change clothing color with photorealistic texture and lighting preservation.",
  [Preset.BackgroundReplace]:
    "Expertly replace the background and integrate the subject with new lighting.",
  [Preset.ObjectRemoval]:
    "Seamlessly remove a specified object using content-aware fill.",
  [Preset.ColorizeBW]:
    "Add lifelike, historically accurate color to black and white photos.",
  [Preset.ProductStage]:
    "Create a professional e-commerce product shot with studio lighting.",
  [Preset.RemoveBlemishes]:
    "High-end, texture-preserving skin retouching for a clean, natural look.",
  [Preset.VintageFilm]:
    "Emulate the nostalgic look of classic film stocks like Kodak Portra.",
  [Preset.HairHighlight]:
    "Add subtle, professionally blended hair highlights (balayage style).",
  [Preset.TeethWhitening]:
    "Enhance smiles with natural, realistic teeth whitening.",
};

// Preset with all options (default + custom)
export interface PresetOption {
  id: string;
  name: string;
  prompt: string;
  description: string;
  isCustom: boolean;
  isDefault?: boolean;
}

// Get all available presets (default + custom)
export const getAllPresets = (): PresetOption[] => {
  const defaultPresets: PresetOption[] = Object.values(Preset).map(
    (preset) => ({
      id: preset,
      name: PRESET_NAMES[preset] || preset, // Fallback to preset ID if name is missing
      prompt: PROMPT_TEMPLATES[preset],
      description: PRESET_DESCRIPTIONS[preset],
      isCustom: false,
      isDefault: true,
    })
  );

  // Apply edited prompts to default presets
  const editedPrompts = getEditedPrompts();
  defaultPresets.forEach((preset) => {
    if (editedPrompts[preset.id]) {
      preset.prompt = editedPrompts[preset.id];
    }
  });

  // Add custom presets, sorted by creation date (newest first)
  const customPresets: PresetOption[] = getCustomPresets()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) // Newest first
    .map((preset) => ({
      id: preset.id,
      name: preset.name,
      prompt: preset.prompt,
      description: preset.description,
      isCustom: true,
    }));

  // Combine all presets: custom presets first (newest first), then default presets
  const allPresets = [...customPresets, ...defaultPresets];

  // Get saved order and apply it
  const savedOrder = getPresetOrder();
  if (savedOrder.length > 0) {
    // Create a map for quick lookup
    const presetMap = new Map(allPresets.map((p) => [p.id, p]));

    // Separate custom and default presets
    const customPresetsOrdered: PresetOption[] = [];
    const defaultPresetsOrdered: PresetOption[] = [];
    const addedIds = new Set<string>();

    // Add presets in saved order
    savedOrder.forEach((id) => {
      const preset = presetMap.get(id);
      if (preset) {
        if (preset.isCustom) {
          customPresetsOrdered.push(preset);
        } else {
          defaultPresetsOrdered.push(preset);
        }
        addedIds.add(id);
      }
    });

    // Add any presets not in saved order
    // New custom presets go first (sorted by creation date), then missing defaults
    const newCustomPresets = allPresets.filter(
      (p) => p.isCustom && !addedIds.has(p.id)
    );
    const newDefaultPresets = allPresets.filter(
      (p) => !p.isCustom && !addedIds.has(p.id)
    );

    // Combine: custom presets (ordered + new) first, then default presets
    return [
      ...customPresetsOrdered,
      ...newCustomPresets,
      ...defaultPresetsOrdered,
      ...newDefaultPresets,
    ];
  }

  // If no saved order, return default order
  return allPresets;
};

// Get prompt for a preset ID (handles both default and custom)
export const getPresetPrompt = (presetId: string): string | null => {
  // Check if it's a default preset
  if (Object.values(Preset).includes(presetId as Preset)) {
    const editedPrompts = getEditedPrompts();
    return (
      editedPrompts[presetId] || PROMPT_TEMPLATES[presetId as Preset] || null
    );
  }

  // Check custom presets
  const customPresets = getCustomPresets();
  const customPreset = customPresets.find((p) => p.id === presetId);
  return customPreset?.prompt || null;
};

// Get name for a preset ID
export const getPresetName = (presetId: string): string | null => {
  // Check if it's a default preset
  if (Object.values(Preset).includes(presetId as Preset)) {
    return PRESET_NAMES[presetId as Preset] || null;
  }

  // Check custom presets
  const customPresets = getCustomPresets();
  const customPreset = customPresets.find((p) => p.id === presetId);
  return customPreset?.name || null;
};

// Get description for a preset ID
export const getPresetDescription = (presetId: string): string | null => {
  // Check if it's a default preset
  if (Object.values(Preset).includes(presetId as Preset)) {
    return PRESET_DESCRIPTIONS[presetId as Preset] || null;
  }

  // Check custom presets
  const customPresets = getCustomPresets();
  const customPreset = customPresets.find((p) => p.id === presetId);
  return customPreset?.description || null;
};
