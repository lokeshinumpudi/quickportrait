import React, { useState, useRef, useEffect } from "react";
import {
  copyImageToClipboard,
  getShareUrl,
  shareImage,
} from "../utils/shareUtils";
import { showSuccess, showError } from "../utils/toast";
import { trackEvent, AnalyticsEvents } from "../utils/analytics";

interface ActionsMenuProps {
  onRetry: () => void;
  onUseAgain: () => void;
  resultImageUrl?: string;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  onRetry,
  onUseAgain,
  resultImageUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const appUrl = window.location.origin;

  const handleShare = async (platform: "twitter" | "linkedin" | "facebook") => {
    if (!resultImageUrl) return;
    const shareUrl = getShareUrl(platform, resultImageUrl, appUrl);
    window.open(shareUrl, "_blank", "width=600,height=400");
    setIsOpen(false);
    trackEvent(AnalyticsEvents.SHARE_CLICKED, { platform });
  };

  const handleNativeShare = async () => {
    if (!resultImageUrl) return;
    try {
      await shareImage(resultImageUrl);
      showSuccess("Shared successfully!");
      setIsOpen(false);
      trackEvent(AnalyticsEvents.SHARE_CLICKED, { platform: "native" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to share";
      if (!errorMessage.includes("copied")) {
        showError(errorMessage);
      } else {
        showSuccess("Image URL copied to clipboard!");
      }
    }
  };

  const handleCopyImage = async () => {
    if (!resultImageUrl) return;
    try {
      await copyImageToClipboard(resultImageUrl);
      showSuccess("Image copied to clipboard!");
      setIsOpen(false);
      trackEvent(AnalyticsEvents.SHARE_CLICKED, { platform: "clipboard" });
    } catch (error) {
      showError("Failed to copy image. Try downloading instead.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan/20 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg font-bold py-2 px-3 uppercase text-sm transition-all duration-200 active:scale-[0.98] btn-dither flex items-center gap-1.5"
        title="More actions"
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
        More
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 glass border-2 border-cyan/50 p-2 min-w-[180px] z-50 animate-fade-in">
          <button
            onClick={() => {
              onRetry();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
            data-testid="action-retry"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </button>
          <button
            onClick={() => {
              onUseAgain();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
            data-testid="action-use-again"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Use Again
          </button>

          {resultImageUrl && (
            <>
              <div className="border-t border-cyan/20 my-2"></div>
              <div className="text-xs text-cyan/50 uppercase px-4 py-1 mb-1">
                Share
              </div>
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
                  data-testid="action-share-native"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share...
                </button>
              )}
              <button
                onClick={() => handleShare("twitter")}
                className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
                data-testid="action-share-twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
                data-testid="action-share-linkedin"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
              <button
                onClick={handleCopyImage}
                className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
                data-testid="action-copy-image"
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
                Copy Image
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
