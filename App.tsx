import React, { useState, useEffect, useCallback } from "react";
import { Preset } from "./types";
import { getAllPresets, getPresetPrompt, type PresetOption } from "./constants";
import { editImageWithGemini } from "./services/geminiService";
import ImageUploader from "./components/ImageUploader";
import { fileToBase64, dataUrlToFile } from "./utils/fileUtils";
import Header from "./components/Header";
import EditingPanel from "./components/EditingPanel";
import ImageComparator from "./components/ImageComparator";
import LandingPage from "./components/LandingPage";
import ApiKeyManager from "./components/ApiKeyManager";
import ActionsMenu from "./components/ActionsMenu";
import SettingsModal, { SettingsTab } from "./components/SettingsModal";
import GeneralSettings from "./components/settings/GeneralSettings";
import PresetSettings from "./components/settings/PresetSettings";
import AdvancedSettings from "./components/settings/AdvancedSettings";
import { hasApiKey } from "./utils/apiKeyUtils";
import { showError, showSuccess } from "./utils/toast";
import { validateFileSize } from "./utils/fileSizeUtils";

const App: React.FC = () => {
  const [inputImage, setInputImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    Preset.Portraitify
  );
  const [availablePresets, setAvailablePresets] = useState<PresetOption[]>([]);
  const [customColor, setCustomColor] = useState<string>("#39FF14");
  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [view, setView] = useState<"editing" | "results">("editing");
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [settingsDefaultTab, setSettingsDefaultTab] =
    useState<SettingsTab>("api-key");
  const [presetToEdit, setPresetToEdit] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // Load API key on mount if it exists
    if (hasApiKey()) {
      const storedKey = localStorage.getItem("gemini_api_key");
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
    // Load available presets
    setAvailablePresets(getAllPresets());
  }, []);

  // Reload presets when settings modal closes (in case presets were edited)
  useEffect(() => {
    if (!showApiKeyModal) {
      setAvailablePresets(getAllPresets());
    }
  }, [showApiKeyModal]);

  // Cleanup: revoke object URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (inputImage?.url && inputImage.url.startsWith("blob:")) {
        URL.revokeObjectURL(inputImage.url);
      }
    };
  }, [inputImage]);

  useEffect(() => {
    const prompt = getPresetPrompt(selectedPresetId);
    if (!prompt) {
      setPromptText("");
      return;
    }

    let template = prompt;
    const selectedPreset = availablePresets.find(
      (p) => p.id === selectedPresetId
    );

    // Handle color placeholders for specific presets
    if (
      selectedPresetId === Preset.DressRecolor ||
      selectedPresetId === Preset.HairHighlight ||
      (selectedPreset && template.includes("{{color}}"))
    ) {
      template = template.replace("{{color}}", customColor);
    }

    // Handle style placeholder
    if (
      selectedPresetId === Preset.BackgroundReplace ||
      (selectedPreset && template.includes("{{style}}"))
    ) {
      template = template.replace("{{style}}", "soft gradient");
    }

    // Handle object removal placeholder
    if (
      selectedPresetId === Preset.ObjectRemoval ||
      (selectedPreset && template.includes("{{object to remove}}"))
    ) {
      template = template.replace(
        "{{object to remove}}",
        "[SPECIFY OBJECT HERE]"
      );
    }

    setPromptText(template);
  }, [selectedPresetId, customColor, availablePresets]);

  const handleImageUpload = (file: File) => {
    // Validate file size
    const validation = validateFileSize(file);
    if (!validation.valid) {
      showError(validation.error || "File size exceeds the maximum limit.");
      return;
    }

    // Revoke previous object URL to prevent memory leaks
    if (inputImage?.url && inputImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(inputImage.url);
    }

    const url = URL.createObjectURL(file);
    setInputImage({ url, file });
    setOutputUrl(null);
    setView("editing"); // Reset to editing view on new image
  };

  const handleEditClick = useCallback(async () => {
    if (!inputImage) return;

    // Validate prompt is not empty
    if (!promptText.trim()) {
      showError("Please enter a prompt or select a preset.");
      return;
    }

    if (!hasApiKey()) {
      showError(
        "API key required to generate edits. Click the settings icon (⚙️) in the header to add your Gemini API key."
      );
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setOutputUrl(null);
    setView("editing");

    try {
      const base64Image = await fileToBase64(inputImage.file);
      const generatedImage = await editImageWithGemini(
        base64Image,
        inputImage.file.type,
        promptText
      );
      setOutputUrl(generatedImage);
      setView("results");
      showSuccess("Image generated successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      showError(errorMessage);
      // If API key error (invalid or missing), show API key modal
      if (
        errorMessage.includes("API key") ||
        errorMessage.includes("invalid") ||
        errorMessage.toLowerCase().includes("api_key")
      ) {
        setShowApiKeyModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputImage, promptText]);

  const handleUseAsInput = useCallback(async (imageUrl: string) => {
    try {
      const file = await dataUrlToFile(imageUrl, `generated-image.png`);
      handleImageUpload(file); // This already resets view to 'editing'
      showSuccess("Image set as input for editing");
    } catch (err) {
      console.error("Failed to use image as input:", err);
      showError("Failed to use image as input.");
    }
  }, []);

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `quick-portrait-edit.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Image downloaded successfully!");
  };

  if (!inputImage) {
    return <LandingPage onImageUpload={handleImageUpload} />;
  }

  const settingsTabs = [
    {
      id: "api-key" as SettingsTab,
      label: "API Key",
      icon: (
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
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
    },
    {
      id: "presets" as SettingsTab,
      label: "Presets",
      icon: (
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      id: "general" as SettingsTab,
      label: "General",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "advanced" as SettingsTab,
      label: "Advanced",
      icon: (
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
  ];

  const renderSettingsContent = (activeTab: SettingsTab) => {
    switch (activeTab) {
      case "api-key":
        return (
          <ApiKeyManager
            onApiKeySet={(key) => {
              setApiKey(key);
            }}
            onClose={() => setShowApiKeyModal(false)}
          />
        );
      case "general":
        return <GeneralSettings />;
      case "presets":
        return <PresetSettings initialPresetId={presetToEdit} />;
      case "advanced":
        return <AdvancedSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-mono">
      <Header
        onSettingsClick={() => {
          setSettingsDefaultTab("api-key");
          setShowApiKeyModal(true);
        }}
      />

      {/* Settings Modal with Tabs */}
      <SettingsModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          // Clear preset to edit when modal closes
          setPresetToEdit(undefined);
        }}
        tabs={settingsTabs}
        defaultTab={settingsDefaultTab}
      >
        {renderSettingsContent}
      </SettingsModal>

      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        {view === "results" && outputUrl && !isLoading && inputImage ? (
          /* Results View - Desktop Optimized Layout */
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Desktop Only */}
            <div className="hidden lg:flex flex-col gap-4 w-48 flex-shrink-0">
              <button
                onClick={() => setView("editing")}
                className="bg-cyan/20 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-3 px-4 uppercase text-sm transition-all duration-200 active:scale-[0.98] btn-dither flex items-center justify-center gap-2"
                title="Back to editing"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>
              <ActionsMenu
                onRetry={handleEditClick}
                onUseAgain={() => handleUseAsInput(outputUrl)}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              {/* Mobile Back Button */}
              <div className="lg:hidden flex justify-start">
                <button
                  onClick={() => setView("editing")}
                  className="bg-cyan/20 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-2 px-4 uppercase text-sm transition-all duration-200 active:scale-[0.98] btn-dither flex items-center gap-2"
                  title="Back to editing"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>
              </div>

              {/* Image Display - Centered and Responsive */}
              <div className="w-full max-w-5xl mx-auto">
                <ImageComparator
                  originalImageUrl={inputImage.url}
                  resultImageUrl={outputUrl}
                />
              </div>

              {/* Actions Bar - Centered Download Button */}
              <div className="glass p-4 lg:p-6 border-2 border-cyan/30">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Mobile More Menu */}
                  <div className="lg:hidden">
                    <ActionsMenu
                      onRetry={handleEditClick}
                      onUseAgain={() => handleUseAsInput(outputUrl)}
                    />
                  </div>
                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(outputUrl)}
                    className="bg-lime text-dark-bg hover:bg-lime/90 font-bold py-4 px-8 uppercase text-lg transition-all duration-200 active:scale-[0.98] btn-dither flex items-center gap-2 shadow-glow-lime/50 w-full sm:w-auto"
                    title="Download edited image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editing View - Two Column Layout */
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Left Column: Controls & Actions */}
            <div className="flex flex-col space-y-4 w-full lg:w-1/2 lg:max-w-xl">
              {/* Upload Section */}
              <div className="transition-all duration-300">
                <ImageUploader
                  inputImage={inputImage}
                  onImageUpload={handleImageUpload}
                />
              </div>

              {/* Editing View */}
              {view === "editing" && !isLoading && (
                <div className="space-y-4 animate-fade-in">
                  <EditingPanel
                    selectedPresetId={selectedPresetId}
                    onPresetChange={setSelectedPresetId}
                    customColor={customColor}
                    onColorChange={setCustomColor}
                    availablePresets={availablePresets}
                    promptText={promptText}
                    onPromptChange={setPromptText}
                    onApiKeyError={() => {
                      setSettingsDefaultTab("api-key");
                      setShowApiKeyModal(true);
                    }}
                    onOpenPresetSettings={() => {
                      setSettingsDefaultTab("presets");
                      setPresetToEdit(selectedPresetId);
                      setShowApiKeyModal(true);
                    }}
                  />
                  <div className="glass p-4 border-2 border-cyan/30">
                    <button
                      onClick={handleEditClick}
                      disabled={!inputImage || !promptText.trim()}
                      className="w-full text-2xl bg-cyan text-dark-bg font-bold py-4 px-6 uppercase transition-all duration-200 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] btn-dither shadow-glow-cyan hover:shadow-glow-cyan/50 disabled:hover:shadow-none"
                      data-testid="generate-edit-button"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        GENERATE EDIT
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Image Display */}
            <div className="flex flex-col space-y-4 w-full lg:w-1/2 lg:sticky lg:top-4">
              {/* Loading State */}
              {isLoading && (
                <div className="glass border-2 border-cyan/30 p-12 min-h-[500px] flex flex-col items-center justify-center animate-fade-in" data-testid="loading-state">
                  <div className="w-16 h-16 border-4 border-cyan/30 border-t-cyan rounded-full animate-spin"></div>
                  <p className="mt-8 text-2xl uppercase text-cyan font-bold">
                    Generating...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !outputUrl && (
                <div className="glass border-2 border-dashed border-cyan/30 p-12 min-h-[500px] flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="mb-6 opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-cyan/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-cyan/80 text-xl uppercase font-bold mb-2">
                    Ready to Transform
                  </p>
                  <p className="text-cyan/60 text-sm max-w-xs">
                    Your edited image will appear here after generation. Choose
                    a preset or write a custom prompt to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
