import React, { useState, useEffect } from "react";
import {
  getMaxFileSizeMB,
  setMaxFileSizeMB,
  resetMaxFileSizeMB,
} from "../../utils/fileSizeUtils";
import { showSuccess, showError } from "../../utils/toast";

const GeneralSettings: React.FC = () => {
  const [maxFileSizeMB, setMaxFileSizeMBInput] = useState<number>(10);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  useEffect(() => {
    const limit = getMaxFileSizeMB();
    setMaxFileSizeMBInput(limit);
    setCurrentLimit(limit);
  }, []);

  const handleSave = () => {
    try {
      setMaxFileSizeMB(maxFileSizeMB);
      setCurrentLimit(maxFileSizeMB);
      setIsEditing(false);
      showSuccess(`Maximum file size set to ${maxFileSizeMB}MB`);
    } catch (err) {
      showError("Failed to save file size limit. Please try again.");
    }
  };

  const handleReset = () => {
    resetMaxFileSizeMB();
    setMaxFileSizeMBInput(10);
    setCurrentLimit(10);
    setIsEditing(false);
    showSuccess("File size limit reset to default (10MB)");
  };

  const handleChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      setMaxFileSizeMBInput(numValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Size Limit Setting */}
      <div className="glass border border-cyan/30 p-6 space-y-4">
        <div>
          <h4 className="text-cyan text-lg font-bold uppercase mb-2">
            Max File Size
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="maxFileSize"
              className="text-cyan/80 text-sm font-bold uppercase whitespace-nowrap"
            >
              Size (MB):
            </label>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                id="maxFileSize"
                type="number"
                min="1"
                max="100"
                step="1"
                value={maxFileSizeMB}
                onChange={(e) => {
                  handleChange(e.target.value);
                  setIsEditing(true);
                }}
                className="w-24 bg-dark-bg border border-cyan/30 text-cyan placeholder:text-cyan/40 px-3 py-2 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 font-mono text-sm"
                style={{
                  backgroundColor: "var(--dark-bg)",
                  color: "var(--cyan)",
                }}
              />
              <span className="text-cyan/70 text-sm">MB</span>
              <span className="text-lime/70 text-xs italic min-w-[80px]">
                {maxFileSizeMB !== currentLimit && "(not saved)"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={
                !isEditing ||
                maxFileSizeMB < 1 ||
                maxFileSizeMB > 100 ||
                maxFileSizeMB === currentLimit
              }
              className="flex-1 bg-cyan text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Save
            </button>
            <div className="w-full sm:w-auto">
              {currentLimit !== 10 ? (
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-lime/20 border border-lime text-lime hover:bg-lime hover:text-dark-bg font-bold py-2 px-4 uppercase transition duration-200 active:scale-[0.98] btn-dither min-h-[44px]"
                >
                  Reset
                </button>
              ) : (
                <div className="w-full sm:w-auto min-h-[44px]" />
              )}
            </div>
          </div>

          <p className="text-cyan/50 text-xs pt-2 border-t border-cyan/20">
            Current: {currentLimit}MB • Stored locally
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
