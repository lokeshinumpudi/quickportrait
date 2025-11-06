import React, { useState, useRef, useEffect } from "react";
import { Preset } from "../types";
import { type PresetOption, getPresetDescription } from "../constants";
import { enhancePromptWithGemini } from "../services/geminiService";
import { showError, showSuccess } from "../utils/toast";

interface EditingPanelProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
  customColor: string;
  onColorChange: (color: string) => void;
  availablePresets: PresetOption[];
  promptText: string;
  onPromptChange: (text: string) => void;
  onApiKeyError?: () => void;
  onOpenPresetSettings?: () => void;
}

const EditingPanel: React.FC<EditingPanelProps> = ({
  selectedPresetId,
  onPresetChange,
  customColor,
  onColorChange,
  availablePresets,
  promptText,
  onPromptChange,
  onApiKeyError,
  onOpenPresetSettings,
}) => {
  const selectedPreset = availablePresets.find(
    (p) => p.id === selectedPresetId
  );
  const showColorPicker =
    selectedPresetId === Preset.DressRecolor ||
    selectedPresetId === Preset.HairHighlight ||
    (selectedPreset?.prompt.includes("{{color}}") ?? false);
  const [hoveredPresetId, setHoveredPresetId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhanceClick = async () => {
    setIsEnhancing(true);
    try {
      const enhancedPrompt = await enhancePromptWithGemini(promptText);
      onPromptChange(enhancedPrompt);
      showSuccess("Prompt enhanced successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to enhance prompt.";
      showError(errorMessage);
      // If API key error, trigger API key manager
      if (
        errorMessage.includes("API key") ||
        errorMessage.includes("invalid") ||
        errorMessage.toLowerCase().includes("api_key")
      ) {
        onApiKeyError?.();
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const checkArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    // Initial check
    const timeoutId = setTimeout(checkArrows, 100); // Delay to allow layout to settle

    const currentRef = scrollContainerRef.current;
    currentRef?.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);

    return () => {
      clearTimeout(timeoutId);
      currentRef?.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, [availablePresets]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="glass p-4 space-y-4">
      {/* Preset Selection - Compact */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-cyan uppercase">
            Choose Preset
          </h2>
          {onOpenPresetSettings && (
            <button
              onClick={onOpenPresetSettings}
              className="flex items-center gap-1.5 bg-lime/20 border border-lime/50 text-lime hover:bg-lime hover:text-dark-bg font-bold py-1.5 px-2.5 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither"
              title="Manage presets"
              aria-label="Open preset settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="hidden sm:inline">Manage</span>
            </button>
          )}
        </div>
        <div className="relative flex items-center">
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 z-10 p-1.5 bg-dark-bg/90 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg text-xl active:scale-90 transition-transform"
            >
              {"<"}
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-2 pb-1 overflow-x-auto scrollbar-hide"
          >
            {availablePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onPresetChange(preset.id)}
                onMouseEnter={() => setHoveredPresetId(preset.id)}
                onMouseLeave={() => setHoveredPresetId(null)}
                className={`px-3 py-1.5 text-sm font-bold uppercase whitespace-nowrap transition-all duration-200 ease-in-out flex-shrink-0 border-2 btn-dither ${
                  selectedPresetId === preset.id
                    ? preset.isCustom
                      ? "bg-lime text-dark-bg border-lime shadow-glow-lime"
                      : "bg-cyan text-dark-bg border-cyan shadow-glow-cyan"
                    : preset.isCustom
                    ? "bg-dark-bg text-lime border-lime/50 hover:border-lime hover:bg-lime/10"
                    : "bg-dark-bg text-cyan border-cyan/50 hover:border-cyan hover:bg-cyan/10"
                }`}
                data-testid={`preset-button-${preset.id}`}
              >
                {preset.name}
                {preset.isCustom && (
                  <span className="ml-1.5 text-xs opacity-70">*</span>
                )}
              </button>
            ))}
          </div>
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 z-10 p-1.5 bg-dark-bg/90 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg text-xl active:scale-90 transition-transform"
            >
              {">"}
            </button>
          )}
        </div>
        <div className="h-5 mt-1.5 px-1 text-sm text-lime/80 transition-opacity duration-200">
          {hoveredPresetId
            ? getPresetDescription(hoveredPresetId) ||
              availablePresets.find((p) => p.id === hoveredPresetId)
                ?.description ||
              ""
            : selectedPreset?.description || ""}
        </div>
      </div>

      {showColorPicker && (
        <div className="flex items-center space-x-3 pt-1">
          <label
            htmlFor="colorPicker"
            className="text-cyan font-bold text-sm uppercase"
          >
            Color:
          </label>
          <div className="relative w-10 h-10 border-2 border-cyan/50 p-0.5">
            <input
              id="colorPicker"
              type="color"
              value={customColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
              data-testid="color-picker"
            />
            <div
              className="w-full h-full pointer-events-none"
              style={{ backgroundColor: customColor }}
            ></div>
          </div>
          <span className="px-2 py-1 bg-dark-bg border border-cyan/30 text-sm font-mono">
            {customColor}
          </span>
        </div>
      )}

      {/* Prompt Section - Compact */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-cyan uppercase">
            Edit Prompt
          </h2>
          <button
            onClick={handleEnhanceClick}
            disabled={isEnhancing}
            className="flex items-center space-x-1.5 bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-1.5 px-2.5 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enhance prompt with AI"
            data-testid="enhance-prompt-button"
          >
            {isEnhancing ? (
              <div
                className="loader"
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid var(--lime)",
                }}
              ></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            <span>Enhance</span>
          </button>
        </div>
        <textarea
          value={promptText}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={3}
          className="w-full p-2.5 bg-dark-bg border-2 border-cyan/50 text-cyan placeholder:text-cyan/40 text-sm focus:outline-none focus:border-cyan focus:shadow-glow-cyan resize-none"
          style={{ backgroundColor: "var(--dark-bg)", color: "var(--cyan)" }}
          placeholder="Describe your edit..."
          aria-label="Edit the prompt for the AI model"
          data-testid="prompt-textarea"
        />
      </div>
    </div>
  );
};

export default EditingPanel;
