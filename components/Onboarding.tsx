import React, { useEffect } from "react";

const ONBOARDING_STORAGE_KEY = "qp_onboarding_completed";

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
};

/**
 * Mark onboarding as completed
 */
export const markOnboardingCompleted = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
};

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const handleComplete = () => {
    markOnboardingCompleted();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleComplete();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm animate-fade-in pointer-events-none" />

      {/* Modal Content */}
      <div
        className="relative z-10 glass border-2 border-cyan/50 shadow-glow-cyan w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        data-testid="onboarding-modal"
      >
        {/* Header */}
        <div className="glass border-b border-cyan/30 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-cyan text-2xl font-bold uppercase tracking-wider">
              Welcome to Quick Portrait
            </h2>
            <button
              onClick={handleComplete}
              className="text-cyan/80 hover:text-cyan transition-colors p-1"
              aria-label="Close onboarding"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-cyan/90 text-lg">
            Transform your photos with AI-powered editing. No Photoshop
            required.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lime text-xl">✓</span>
              <p className="text-cyan/80">
                <strong className="text-cyan">No Sign-up</strong> - Start
                editing immediately
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lime text-xl">✓</span>
              <p className="text-cyan/80">
                <strong className="text-cyan">Your API Key</strong> - You
                control your Gemini API key
              </p>
            </div>
          </div>

          <div className="glass border border-cyan/30 p-4 rounded mt-4">
            <p className="text-cyan/90 text-sm font-semibold mb-2">
              🔒 Privacy First
            </p>
            <p className="text-cyan/70 text-xs leading-relaxed">
              Your API keys and photos{" "}
              <strong className="text-cyan">never enter our servers</strong>.
              Everything stays in your browser and goes directly to Google's
              Gemini API.
            </p>
          </div>

          <div className="glass border border-lime/30 p-4 rounded mt-4">
            <p className="text-lime/90 text-sm">
              <strong className="text-lime">Get started:</strong> Upload a
              photo, add your API key in settings, and start transforming!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={handleComplete}
            className="w-full px-6 py-3 btn-dither border-2 border-lime text-lime hover:border-lime/80 transition-colors uppercase font-bold"
            data-testid="onboarding-get-started-button"
          >
            Get Started
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
