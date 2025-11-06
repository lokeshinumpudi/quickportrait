import React, { useState, useCallback } from "react";

interface LandingPageProps {
  onImageUpload: (file: File) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageUpload(event.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("landingFileInput")?.click();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          onImageUpload(file);
        }
      }
    },
    [onImageUpload]
  );

  const FeatureIcon: React.FC<{
    type: "presets" | "prompts" | "instant" | "private";
  }> = ({ type }) => {
    const icons = {
      presets: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="7" height="7" strokeLinecap="round" />
          <rect x="14" y="3" width="7" height="7" strokeLinecap="round" />
          <rect x="3" y="14" width="7" height="7" strokeLinecap="round" />
          <rect x="14" y="14" width="7" height="7" strokeLinecap="round" />
        </svg>
      ),
      prompts: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      instant: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      private: (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            strokeLinecap="round"
          />
          <path
            d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      ),
    };
    return icons[type];
  };

  const features: Array<{
    icon: "presets" | "prompts" | "instant" | "private";
    title: string;
  }> = [
    { icon: "presets", title: "10+ Presets" },
    { icon: "prompts", title: "Custom Prompts" },
    { icon: "instant", title: "Instant Results" },
    { icon: "private", title: "Private & Secure" },
  ];

  return (
    <div
      className="h-screen flex flex-col items-center justify-center p-3 md:p-4 text-center relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 20% 20%, rgba(0, 255, 255, 0.05), transparent 40%),
                     radial-gradient(ellipse at 80% 20%, rgba(57, 255, 20, 0.05), transparent 40%),
                     radial-gradient(ellipse at 50% 95%, rgba(0, 255, 255, 0.04), transparent 50%),
                     var(--dark-bg)`,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-30">
        <div
          className="absolute inset-0 cyberpunk-grid"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Drag Overlay - Visual Feedback */}
      {isDragging && (
        <div className="absolute inset-0 z-20 bg-cyan/10 border-4 border-dashed border-cyan/50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-6 text-cyan mx-auto">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-cyan text-2xl md:text-3xl font-bold uppercase tracking-wider">
              Drop Image Here
            </p>
          </div>
        </div>
      )}

      {/* Subtle Orb Effects */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div
          className="absolute top-[15%] left-[10%] w-64 h-64 bg-cyan/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-lime/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "15s", animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Content - Minimal, Clean Design */}
      <div className="max-w-5xl z-10 w-full flex flex-col items-center justify-center flex-1">
        {/* Hero Section - Minimal with Subtle Animations */}
        <div className="mb-10 md:mb-12 text-center">
          <div className="relative inline-block mb-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-cyan tracking-widest uppercase relative z-10 cyberpunk-title-glow">
              QUICK PORTRAIT
            </h1>
            {/* Animated glow effects */}
            <div className="absolute inset-0 blur-2xl opacity-20 bg-cyan/50 -z-10 cyberpunk-pulse"></div>
            <div className="absolute inset-0 blur-xl opacity-10 bg-lime/30 -z-10 cyberpunk-pulse-delayed"></div>
          </div>
          <p className="text-cyan/80 text-xl md:text-2xl lg:text-3xl font-light uppercase tracking-wider mb-4 cyberpunk-subtitle">
            AI-POWERED PHOTO EDITING
          </p>
          <p className="text-cyan/50 text-sm md:text-base uppercase tracking-wide">
            Transform photos in seconds • 100% Private • No Sign-up Required
          </p>
        </div>

        {/* Features - Clean with Labels */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-10 md:mb-12 flex-wrap">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group">
              <div className="w-10 h-10 md:w-12 md:h-12 text-cyan/70 group-hover:text-cyan transition-colors duration-300">
                <FeatureIcon type={feature.icon} />
              </div>
              <span className="text-cyan/60 text-xs md:text-sm uppercase tracking-wide group-hover:text-cyan transition-colors">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Section - Focused */}
        <div className="mb-6">
          <button
            onClick={triggerFileInput}
            className="relative bg-lime text-dark-bg text-xl md:text-3xl lg:text-4xl font-bold py-5 md:py-6 px-10 md:px-16 uppercase transition-all duration-300 ease-in-out active:scale-[0.98] btn-dither shadow-glow-lime hover:scale-105 transform z-10 group overflow-hidden"
          >
            {/* Animated shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10">START EDITING</span>
          </button>
          <p className="text-cyan/40 text-xs md:text-sm mt-3 uppercase tracking-wide">
            Click to upload or drag & drop
          </p>
        </div>
      </div>

      <input
        type="file"
        id="landingFileInput"
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      <footer className="absolute bottom-3 md:bottom-5 text-cyan/40 text-[9px] md:text-[10px] z-10">
        Powered by Gemini AI
      </footer>

      {/* Subtle Cyberpunk Animation Styles */}
      <style>{`
        @keyframes cyberpunk-grid-drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes cyberpunk-pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.02);
          }
        }

        @keyframes cyberpunk-pulse-delayed {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.03);
          }
        }

        @keyframes cyberpunk-title-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
                         0 0 40px rgba(0, 255, 255, 0.1);
          }
          50% {
            text-shadow: 0 0 30px rgba(0, 255, 255, 0.4),
                         0 0 60px rgba(0, 255, 255, 0.15),
                         0 0 80px rgba(57, 255, 20, 0.1);
          }
        }

        @keyframes cyberpunk-subtitle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.9;
          }
        }

        .cyberpunk-grid {
          animation: cyberpunk-grid-drift 20s linear infinite;
        }

        .cyberpunk-pulse {
          animation: cyberpunk-pulse 4s ease-in-out infinite;
        }

        .cyberpunk-pulse-delayed {
          animation: cyberpunk-pulse-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .cyberpunk-title-glow {
          animation: cyberpunk-title-glow 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .cyberpunk-subtitle {
          animation: cyberpunk-subtitle 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
