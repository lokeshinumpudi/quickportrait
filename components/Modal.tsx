import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "default" | "large" | "xlarge";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
}) => {
  const sizeClasses = {
    default: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl",
  };
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
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
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div
        className={`relative z-10 glass border-2 border-cyan/50 shadow-glow-cyan w-full ${sizeClasses[size]} h-[90vh] flex flex-col animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
        data-testid={title === "Settings" ? "settings-modal" : undefined}
      >
        {/* Header - Sticky */}
        {title && (
          <div className="flex-shrink-0 glass border-b border-cyan/30 p-4 flex items-center justify-between sticky top-0 z-10 bg-dark-bg/95 backdrop-blur-sm">
            <h2 className="text-cyan text-2xl font-bold uppercase tracking-wider">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-cyan/80 hover:text-cyan transition-colors p-1"
              aria-label="Close modal"
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
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
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
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Modal;
