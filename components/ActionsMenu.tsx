import React, { useState, useRef, useEffect } from "react";

interface ActionsMenuProps {
  onRetry: () => void;
  onUseAgain: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ onRetry, onUseAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        <div className="absolute right-0 top-full mt-2 glass border-2 border-cyan/50 p-2 min-w-[160px] z-50 animate-fade-in">
          <button
            onClick={() => {
              onRetry();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-cyan hover:bg-cyan/20 uppercase transition-colors flex items-center gap-2"
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
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
