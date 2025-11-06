import React, { useState, useEffect } from "react";
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  hasApiKey,
} from "../utils/apiKeyUtils";
import { showError, showSuccess } from "../utils/toast";

interface ApiKeyManagerProps {
  onApiKeySet: (key: string) => void;
  onClose?: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  onApiKeySet,
  onClose,
}) => {
  const [apiKey, setApiKeyInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const storedKeyExists = hasApiKey();

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKeyInput(storedKey);
    }
  }, []);

  const handleSave = () => {
    setError(null);
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError("Please enter your Gemini API key");
      return;
    }

    if (trimmedKey.length < 20) {
      setError("API key seems too short. Please check your key.");
      return;
    }

    try {
      setApiKey(trimmedKey);
      onApiKeySet(trimmedKey);
      setError(null);
      showSuccess("API key saved successfully!");
      if (onClose) {
        onClose();
      }
    } catch (err) {
      const errorMsg = "Failed to save API key. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKeyInput("");
    onApiKeySet("");
    showSuccess("API key removed successfully!");
  };

  return (
    <div className="space-y-3">
      {/* Privacy Info - Compact */}
      <div className="glass border border-cyan/30 p-3">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-lime flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-cyan/70 text-xs leading-relaxed">
            Your API key is stored in browser localStorage and never sent to our
            servers. API calls go directly from your browser to Google.
          </p>
        </div>
      </div>

      {/* Status - Compact */}
      {storedKeyExists && getApiKey() && (
        <div className="glass border border-cyan/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-cyan text-xs font-bold uppercase">
                API Key Configured
              </span>
              <span className="text-xs bg-lime/20 text-lime px-2 py-0.5 rounded border border-lime/30">
                Stored Locally
              </span>
            </div>
            <span className="text-cyan/60 text-xs font-mono">
              {getApiKey()?.substring(0, 8)}...
              {getApiKey()?.substring((getApiKey()?.length || 0) - 4)}
            </span>
          </div>
        </div>
      )}

      {/* Input Section - Compact */}
      <div className="glass border border-cyan/30 p-3 space-y-3">
        <div>
          <label
            htmlFor="apiKey"
            className="block text-cyan text-xs font-bold uppercase mb-1.5"
          >
            Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKeyInput(e.target.value);
              setError(null);
            }}
            placeholder="Enter your API key"
            className="w-full bg-white border border-cyan/30 text-dark-bg placeholder:text-gray-400 px-3 py-2 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            data-testid="api-key-input"
          />
          {error && <p className="text-lime text-xs mt-1">{error}</p>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan text-dark-bg font-bold py-2 px-4 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither"
            data-testid="api-key-save-button"
          >
            {storedKeyExists ? "Update" : "Save"}
          </button>
          {storedKeyExists && (
            <button
              onClick={handleRemove}
              className="bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-2 px-4 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither"
              data-testid="api-key-remove-button"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Link - Compact */}
      <div className="glass border border-cyan/30 p-2">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lime hover:underline text-xs font-mono"
        >
          Need an API key? Get one from Google AI Studio →
        </a>
      </div>
    </div>
  );
};

export default ApiKeyManager;
