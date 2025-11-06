import React, { useState, useEffect, useRef } from "react";
import {
  getCustomPresets,
  saveCustomPreset,
  deleteCustomPreset,
  getEditedPrompts,
  saveEditedPrompt,
  resetEditedPrompt,
  generatePresetId,
  savePresetOrder,
  type CustomPreset,
} from "../../utils/presetUtils";
import { Preset } from "../../types";
import {
  PROMPT_TEMPLATES,
  PRESET_DESCRIPTIONS,
  PRESET_NAMES,
  PRESET_OPTIONS,
  getAllPresets,
  type PresetOption,
} from "../../constants";
import { showSuccess, showError } from "../../utils/toast";

interface PresetEditorProps {
  presetId: string;
  presetName: string;
  prompt: string;
  description: string;
  isCustom: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const PresetEditor: React.FC<PresetEditorProps> = ({
  presetId,
  presetName,
  prompt: initialPrompt,
  description: initialDescription,
  isCustom,
  onSave,
  onCancel,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [description, setDescription] = useState(initialDescription);
  const [name, setName] = useState(presetName);

  const handleSave = () => {
    if (!prompt.trim()) {
      showError("Prompt cannot be empty");
      return;
    }

    if (isCustom) {
      // Generate a new ID if this is a new preset (presetId might be temporary)
      // Check if preset already exists
      const existingPresets = getCustomPresets();
      const existingPreset = existingPresets.find((p) => p.id === presetId);

      let finalId = presetId;
      // If preset doesn't exist, generate a new ID based on the name
      if (!existingPreset) {
        finalId = generatePresetId(name.trim() || "Custom Preset");
      }

      const customPreset: CustomPreset = {
        id: finalId,
        name: name.trim() || "Custom Preset",
        prompt: prompt.trim(),
        description: description.trim() || "Custom preset",
        createdAt: existingPreset?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      saveCustomPreset(customPreset);
      showSuccess("Custom preset saved!");
    } else {
      saveEditedPrompt(presetId, prompt.trim());
      showSuccess("Prompt updated!");
    }
    onSave();
  };

  const handleReset = () => {
    if (isCustom) {
      deleteCustomPreset(presetId);
      showSuccess("Custom preset deleted!");
    } else {
      resetEditedPrompt(presetId);
      setPrompt(initialPrompt);
      setDescription(initialDescription);
      showSuccess("Prompt reset to default!");
    }
    onSave();
  };

  // Check if preset uses placeholders
  const hasColorPlaceholder = prompt.includes("{{color}}");
  const hasStylePlaceholder = prompt.includes("{{style}}");
  const hasObjectPlaceholder = prompt.includes("{{object to remove}}");

  return (
    <div className="space-y-4">
      {/* Preset Name for Custom, Quick Info for Built-in */}
      {isCustom ? (
        <div>
          <label className="block text-cyan/80 text-sm font-bold uppercase mb-2">
            Preset Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dark-bg border border-cyan/30 text-cyan placeholder:text-cyan/40 px-4 py-2 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono"
            style={{
              backgroundColor: "var(--dark-bg)",
              color: "var(--cyan)",
            }}
            placeholder="Enter preset name"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Placeholder Info for Built-in Presets */}
          {(hasColorPlaceholder ||
            hasStylePlaceholder ||
            hasObjectPlaceholder) && (
            <div className="bg-cyan/10 border border-cyan/30 p-3 rounded">
              <p className="text-xs text-cyan/70 uppercase font-bold mb-2">
                Placeholder Variables
              </p>
              <div className="flex flex-wrap gap-2">
                {hasColorPlaceholder && (
                  <span className="inline-flex items-center gap-1 bg-dark-bg/50 border border-cyan/30 px-2 py-1 rounded text-xs text-cyan">
                    <code className="text-cyan">{"{{color}}"}</code>
                    <span className="text-cyan/60">Color picker</span>
                  </span>
                )}
                {hasStylePlaceholder && (
                  <span className="inline-flex items-center gap-1 bg-dark-bg/50 border border-cyan/30 px-2 py-1 rounded text-xs text-cyan">
                    <code className="text-cyan">{"{{style}}"}</code>
                    <span className="text-cyan/60">Style option</span>
                  </span>
                )}
                {hasObjectPlaceholder && (
                  <span className="inline-flex items-center gap-1 bg-dark-bg/50 border border-cyan/30 px-2 py-1 rounded text-xs text-cyan">
                    <code className="text-cyan">{"{{object to remove}}"}</code>
                    <span className="text-cyan/60">Object name</span>
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Quick Actions for Built-in Presets */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(prompt);
                showSuccess("Prompt copied to clipboard!");
              }}
              className="flex-1 bg-cyan/20 border border-cyan/50 text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-2 px-3 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither flex items-center justify-center gap-2"
              title="Copy prompt to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Prompt
            </button>
            {prompt !== initialPrompt && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(initialPrompt);
                  showSuccess("Original prompt copied to clipboard!");
                }}
                className="flex-1 bg-cyan/20 border border-cyan/50 text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-2 px-3 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither flex items-center justify-center gap-2"
                title="Copy original default prompt"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Original
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-cyan/80 text-sm font-bold uppercase mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-dark-bg border border-cyan/30 text-cyan placeholder:text-cyan/40 px-4 py-2 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--dark-bg)", color: "var(--cyan)" }}
          placeholder="Brief description of what this preset does"
          disabled={!isCustom}
        />
        {!isCustom && (
          <p className="text-xs text-cyan/50 mt-1">
            Description is fixed for built-in presets
          </p>
        )}
      </div>

      <div>
        <label className="block text-cyan/80 text-sm font-bold uppercase mb-2">
          Prompt Template
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full bg-dark-bg border border-cyan/30 text-cyan placeholder:text-cyan/40 px-4 py-3 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono text-sm resize-y min-h-[144px]"
          style={{ backgroundColor: "var(--dark-bg)", color: "var(--cyan)" }}
          placeholder="Enter your prompt here..."
        />
        {/* Show placeholder help only if prompt contains placeholders */}
        {(hasColorPlaceholder ||
          hasStylePlaceholder ||
          hasObjectPlaceholder) && (
          <p className="text-xs text-cyan/50 mt-2">
            Placeholders are automatically replaced:{" "}
            {hasColorPlaceholder && (
              <>
                <code className="bg-dark-bg/50 px-1 py-0.5 rounded text-cyan">
                  {"{{color}}"}
                </code>{" "}
                uses the color picker
                {hasStylePlaceholder || hasObjectPlaceholder ? ", " : "."}
              </>
            )}
            {hasStylePlaceholder && (
              <>
                <code className="bg-dark-bg/50 px-1 py-0.5 rounded text-cyan">
                  {"{{style}}"}
                </code>{" "}
                defaults to "soft gradient"{hasObjectPlaceholder ? ", " : "."}
              </>
            )}
            {hasObjectPlaceholder && (
              <>
                <code className="bg-dark-bg/50 px-1 py-0.5 rounded text-cyan">
                  {"{{object to remove}}"}
                </code>{" "}
                can be edited manually in the prompt.
              </>
            )}
          </p>
        )}
      </div>

      {/* Reserve space for conditional buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          className="flex-1 min-w-[120px] bg-cyan text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
        >
          Save Changes
        </button>
        {/* Always reserve space for delete/reset button */}
        <div className="flex-1 min-w-[120px]">
          {isCustom ? (
            <button
              onClick={handleReset}
              className="w-full bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
            >
              Delete Preset
            </button>
          ) : prompt !== initialPrompt ? (
            <button
              onClick={handleReset}
              className="w-full bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
            >
              Reset to Default
            </button>
          ) : (
            <div className="w-full min-h-[44px]" />
          )}
        </div>
        <button
          onClick={onCancel}
          className="flex-1 min-w-[120px] bg-cyan/20 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface PresetSettingsProps {
  initialPresetId?: string;
}

const PresetSettings: React.FC<PresetSettingsProps> = ({ initialPresetId }) => {
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>(
    {}
  );
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [showNewPreset, setShowNewPreset] = useState(false);
  const [allPresets, setAllPresets] = useState<PresetOption[]>([]);
  const [draggedPresetId, setDraggedPresetId] = useState<string | null>(null);
  const [dragOverPresetId, setDragOverPresetId] = useState<string | null>(null);
  const [hasJustDragged, setHasJustDragged] = useState<boolean>(false);
  const justDraggedRef = useRef<boolean>(false);

  const loadPresets = () => {
    setCustomPresets(getCustomPresets());
    setEditedPrompts(getEditedPrompts());
    const presets = getAllPresets();
    // Ensure all presets have names (fallback to ID if name is missing)
    const presetsWithNames = presets.map((preset) => ({
      ...preset,
      name: preset.name || preset.id,
    }));
    setAllPresets(presetsWithNames);
  };

  useEffect(() => {
    loadPresets();
  }, []);

  // Set initial preset to edit if provided
  useEffect(() => {
    if (initialPresetId && allPresets.length > 0) {
      // Verify the preset exists
      const presetExists = allPresets.some((p) => p.id === initialPresetId);
      if (presetExists) {
        setEditingPreset(initialPresetId);
      }
    }
  }, [initialPresetId, allPresets]);

  const handleEdit = (presetId: string) => {
    setEditingPreset(presetId);
    setShowNewPreset(false);
  };

  const handleNewPreset = () => {
    // Generate a temporary ID that will be replaced when saved
    const tempId = generatePresetId("New Preset");
    // Don't save to localStorage yet - only save when user clicks "Save Changes"
    setEditingPreset(tempId);
    setShowNewPreset(true);
  };

  const handleSaveComplete = () => {
    loadPresets();
    setEditingPreset(null);
    setShowNewPreset(false);
  };

  const handleCancel = () => {
    setEditingPreset(null);
    setShowNewPreset(false);
    // Don't reload presets if canceling a new preset that was never saved
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    presetId: string
  ) => {
    setDraggedPresetId(presetId);
    justDraggedRef.current = true; // Mark that drag has started
    setHasJustDragged(true); // Mark that we're dragging
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", presetId);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Keep the drag flag set - handleDrop will clear it if drop was successful
    // If drag was cancelled (no drop), clear it after a delay
    if (!draggedPresetId) {
      // Drag was cancelled, clear flags after delay
      setTimeout(() => {
        setHasJustDragged(false);
        justDraggedRef.current = false;
      }, 300);
    }
    // If drag succeeded, handleDrop will clear the flags
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    presetId: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedPresetId && draggedPresetId !== presetId) {
      setDragOverPresetId(presetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverPresetId(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetPresetId: string
  ) => {
    e.preventDefault();
    setDragOverPresetId(null);

    if (!draggedPresetId || draggedPresetId === targetPresetId) {
      // Clear drag state even if drop was invalid
      setDraggedPresetId(null);
      setHasJustDragged(false);
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 300);
      return;
    }

    // Reorder presets
    const currentOrder = allPresets.map((p) => p.id);
    const draggedIndex = currentOrder.indexOf(draggedPresetId);
    const targetIndex = currentOrder.indexOf(targetPresetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      // Clear drag state if indices are invalid
      setDraggedPresetId(null);
      setHasJustDragged(false);
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 300);
      return;
    }

    // Create new order array
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedPresetId);

    // Save the new order
    savePresetOrder(newOrder);

    // Clear drag state immediately before reloading
    const wasDragging = draggedPresetId;
    setDraggedPresetId(null);
    setDragOverPresetId(null);

    // Reload presets to reflect new order
    loadPresets();

    // Keep drag prevention active for a bit longer to prevent accidental clicks
    if (wasDragging) {
      setTimeout(() => {
        setHasJustDragged(false);
        justDraggedRef.current = false;
      }, 500); // Longer delay to ensure click doesn't fire
    }

    showSuccess("Preset order updated!");
  };

  const getPresetInfo = (presetId: string) => {
    // First check if it's a custom preset (prioritize custom presets)
    // Custom preset IDs start with "custom-" prefix
    const custom = customPresets.find((p) => p.id === presetId);
    if (custom) {
      return {
        name: custom.name,
        prompt: custom.prompt,
        description: custom.description,
        isCustom: true,
      };
    }

    // Check if it's a new unsaved preset (temporary preset being created)
    if (showNewPreset && editingPreset === presetId) {
      return {
        name: "New Preset",
        prompt: "Enter your custom prompt here...",
        description: "Custom preset description",
        isCustom: true,
      };
    }

    // Then check if it's a default preset (only if not found in custom presets)
    if (PRESET_OPTIONS.includes(presetId as Preset)) {
      return {
        name: PRESET_NAMES[presetId as Preset] || presetId,
        prompt: editedPrompts[presetId] || PROMPT_TEMPLATES[presetId as Preset],
        description: PRESET_DESCRIPTIONS[presetId as Preset],
        isCustom: false,
      };
    }

    return null;
  };

  const editingPresetInfo = editingPreset ? getPresetInfo(editingPreset) : null;

  return (
    <div className="space-y-3 md:space-y-6 min-h-[400px]">
      <div>
        <h3 className="text-cyan text-lg md:text-xl font-bold uppercase mb-1.5 md:mb-2">
          Preset Management
        </h3>
        <p className="text-cyan/70 text-xs md:text-sm mb-3 md:mb-4">
          Customize default preset prompts or create your own custom presets.
          All changes are saved locally in your browser and persist across
          sessions.
        </p>
      </div>

      {/* Use consistent container height to prevent layout shifts */}
      <div className="relative min-h-[400px] md:min-h-[500px]">
        <div
          className={`transition-opacity duration-200 ${
            editingPresetInfo
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {editingPresetInfo && (
            <div className="glass border-2 border-cyan/50 p-3 md:p-6">
              <h4 className="text-cyan text-lg font-bold uppercase mb-2">
                {editingPresetInfo.isCustom
                  ? "Edit Custom Preset"
                  : "Edit Preset Prompt"}
              </h4>
              {editingPresetInfo.name && (
                <p className="text-cyan/70 text-sm mb-4">
                  Preset:{" "}
                  <span className="font-bold">{editingPresetInfo.name}</span>
                </p>
              )}
              <PresetEditor
                presetId={editingPreset}
                presetName={editingPresetInfo.name}
                prompt={editingPresetInfo.prompt}
                description={editingPresetInfo.description}
                isCustom={editingPresetInfo.isCustom}
                onSave={handleSaveComplete}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
        <div
          className={`transition-opacity duration-200 ${
            !editingPresetInfo
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {!editingPresetInfo && (
            <>
              {/* All Presets - Draggable List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-cyan text-lg font-bold uppercase">
                      All Presets
                    </h4>
                    <p className="text-xs text-cyan/50 mt-1">
                      Drag to reorder • Click to edit
                    </p>
                  </div>
                  <button
                    onClick={handleNewPreset}
                    className="bg-lime text-dark-bg font-bold py-2 px-4 uppercase text-sm transition duration-200 active:scale-[0.98] btn-dither flex items-center gap-2 min-h-[40px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Preset
                  </button>
                </div>
                <div className="space-y-2">
                  {allPresets.map((preset) => {
                    const isEdited = !!editedPrompts[preset.id];
                    const isCustom = preset.isCustom;
                    return (
                      <div
                        key={preset.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, preset.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, preset.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, preset.id)}
                        onClick={(e) => {
                          // Prevent any clicks on the container after drag operations
                          if (hasJustDragged || justDraggedRef.current) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                        className={`glass border p-4 hover:border-cyan/50 transition-all cursor-move relative group ${
                          draggedPresetId === preset.id
                            ? "opacity-50"
                            : dragOverPresetId === preset.id
                            ? "scale-[1.02] border-lime shadow-glow-lime"
                            : isCustom
                            ? "border-lime/30 hover:border-lime/50"
                            : "border-cyan/30 hover:border-cyan/50"
                        }`}
                        title="Drag to reorder, click to edit"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Drag Handle Icon */}
                            <span
                              className="flex flex-col gap-1 cursor-grab active:cursor-grabbing transition-opacity flex-shrink-0 mt-1"
                              style={{
                                opacity:
                                  draggedPresetId === preset.id ? 0.3 : 0.7,
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              title="Drag to reorder"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-3"
                                fill="currentColor"
                                viewBox="0 0 8 20"
                              >
                                <circle cx="2" cy="4" r="1.2" />
                                <circle cx="6" cy="4" r="1.2" />
                                <circle cx="2" cy="10" r="1.2" />
                                <circle cx="6" cy="10" r="1.2" />
                                <circle cx="2" cy="16" r="1.2" />
                                <circle cx="6" cy="16" r="1.2" />
                              </svg>
                            </span>
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={(e) => {
                                // Prevent click if we just finished dragging
                                if (
                                  hasJustDragged ||
                                  justDraggedRef.current ||
                                  draggedPresetId !== null
                                ) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                e.stopPropagation();
                                handleEdit(preset.id);
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <h5
                                  className={`font-bold uppercase ${
                                    isCustom ? "text-lime" : "text-cyan"
                                  }`}
                                >
                                  {preset.name || preset.id}
                                </h5>
                                {isCustom && (
                                  <span className="text-xs bg-lime/20 text-lime px-2 py-0.5 rounded border border-lime/30">
                                    Custom
                                  </span>
                                )}
                                {!isCustom && isEdited && (
                                  <span className="text-xs bg-lime/20 text-lime px-2 py-0.5 rounded border border-lime/30">
                                    Modified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-cyan/70 truncate">
                                {preset.description}
                              </p>
                              <p className="text-xs text-cyan/50 mt-2 line-clamp-2">
                                {isCustom
                                  ? preset.prompt
                                  : editedPrompts[preset.id] ||
                                    PROMPT_TEMPLATES[preset.id as Preset]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete "${preset.name}"? This action cannot be undone.`
                                    )
                                  ) {
                                    deleteCustomPreset(preset.id);
                                    // Close editor if this preset was being edited
                                    if (editingPreset === preset.id) {
                                      setEditingPreset(null);
                                      setShowNewPreset(false);
                                    }
                                    // Reload presets to update the list
                                    loadPresets();
                                    showSuccess("Preset deleted!");
                                  }
                                }}
                                className="border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-dark-bg font-bold py-2 px-3 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither flex items-center justify-center"
                                title="Delete preset"
                                aria-label="Delete preset"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(preset.id);
                              }}
                              className={`border font-bold py-2 px-3 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither ${
                                isCustom
                                  ? "bg-lime/20 border-lime text-lime hover:bg-lime hover:text-dark-bg"
                                  : "bg-cyan/20 border-cyan text-cyan hover:bg-cyan hover:text-dark-bg"
                              }`}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetSettings;
