import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getMaxFileSizeMB } from "../utils/fileSizeUtils";

interface ImageUploaderProps {
  inputImage: { url: string; file: File } | null;
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  inputImage,
  onImageUpload,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageUpload(event.target.files[0]);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = "";
  };

  const triggerFileInput = () => document.getElementById("fileInput")?.click();

  return (
    <div className="glass p-4 border-2 border-cyan/20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-cyan uppercase">
          Upload Image
        </h2>
        <span className="text-cyan/60 text-xs bg-dark-bg/50 px-2 py-0.5 rounded border border-cyan/20">
          Max {getMaxFileSizeMB()}MB
        </span>
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
        data-testid="file-input"
      />
      {inputImage ? (
        <div className="flex items-center space-x-3">
          <div
            className="relative w-20 h-20 flex-shrink-0 cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            aria-label="Click to view full image"
          >
            <img
              src={inputImage.url}
              alt="Uploaded thumbnail"
              className="w-full h-full object-cover border-2 border-cyan/50 group-hover:border-cyan transition-colors pointer-events-none"
            />
            <div className="absolute inset-0 bg-dark-bg/0 group-hover:bg-dark-bg/20 transition-colors flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-cyan font-medium text-sm truncate">
              {inputImage.file.name}
            </p>
            <p className="text-cyan/70 text-xs">Click thumbnail to view</p>
          </div>
          <button
            onClick={triggerFileInput}
            className="bg-cyan/20 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-1.5 px-3 uppercase text-xs transition duration-200 active:scale-[0.98] btn-dither whitespace-nowrap"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={triggerFileInput}
          className="w-full bg-lime/80 text-dark-bg hover:bg-lime text-lg font-bold py-2.5 px-4 uppercase transition duration-200 ease-in-out active:scale-[0.98] btn-dither"
        >
          Select an Image from Disk
        </button>
      )}

      {isModalOpen &&
        inputImage &&
        createPortal(
        <div
            className="fixed inset-0 bg-dark-bg/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-dark-bg/80" />

            {/* Image Container */}
            <div className="relative z-10 max-w-[95vw] max-h-[95vh] flex items-center justify-center">
          <img
            src={inputImage.url}
            alt="Uploaded full"
                className="max-w-full max-h-[95vh] object-contain border-4 border-cyan shadow-glow-cyan rounded-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on image
          />
          <button
            onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-cyan hover:text-white text-5xl font-bold w-12 h-12 flex items-center justify-center transition-colors z-20 bg-dark-bg/80 rounded-full hover:bg-dark-bg border-2 border-cyan/50 hover:border-cyan"
            aria-label="Close image preview"
          >
            &times;
          </button>
        </div>

            <style>{`
              @keyframes fade-in {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              .animate-fade-in {
                animation: fade-in 0.2s ease-out;
              }
            `}</style>
          </div>,
          document.body
      )}
    </div>
  );
};

export default ImageUploader;
