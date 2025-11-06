import React, { useState, useEffect } from "react";
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  hasApiKey,
} from "../utils/apiKeyUtils";
import { showError, showSuccess } from "../utils/toast";

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
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
      // Close modal after successful save
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
    <div className="space-y-5 pb-2">
      {/* Privacy & Security - Simplified */}
      <div className="glass border border-lime/50 bg-lime/5 p-4">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-lime flex-shrink-0 mt-0.5"
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
          <div className="flex-1 min-w-0">
            <h4 className="text-lime text-sm font-bold uppercase mb-2">
              Privacy & Security
            </h4>
            <p className="text-cyan/70 text-xs leading-relaxed">
              Your API key is stored in browser{" "}
              <code className="bg-dark-bg/50 px-1 py-0.5 rounded text-cyan font-mono">
                localStorage
              </code>{" "}
              and never sent to our servers. API calls go directly from your
              browser to Google.
            </p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {storedKeyExists && getApiKey() && (
        <div className="glass border border-cyan/30 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-cyan text-sm font-bold uppercase">
              API Key Configured
            </p>
            <span className="text-xs bg-lime/20 text-lime px-2 py-0.5 rounded border border-lime/30">
              Stored Locally
            </span>
          </div>
          <p className="text-cyan/60 text-xs mt-2 font-mono break-all">
            {getApiKey()?.substring(0, 8)}...
            {getApiKey()?.substring((getApiKey()?.length || 0) - 4)}
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="glass border border-cyan/30 p-5 space-y-4">
        <div>
          <label
            htmlFor="apiKey"
            className="block text-cyan/80 text-sm font-bold uppercase mb-2"
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
            className="w-full bg-white border border-cyan/30 text-dark-bg placeholder:text-gray-400 px-4 py-3 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            data-testid="api-key-input"
          />
          <div className="min-h-[20px] mt-1">
            {error && <p className="text-lime text-xs">{error}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan text-dark-bg font-bold py-3 px-4 uppercase text-sm transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
            data-testid="api-key-save-button"
          >
            {storedKeyExists ? "Update API Key" : "Save API Key"}
          </button>
          {storedKeyExists && (
            <button
              onClick={handleRemove}
              className="sm:w-auto bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-3 px-4 uppercase text-sm transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
              data-testid="api-key-remove-button"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Link Section */}
      <div className="glass border border-cyan/30 p-4">
        <p className="text-cyan/70 text-xs mb-2">Need an API key?</p>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lime hover:underline text-xs font-mono break-all inline-block"
        >
          Get your free API key from Google AI Studio →
        </a>
      </div>
    </div>
  );
};

export default ApiKeyManager;
