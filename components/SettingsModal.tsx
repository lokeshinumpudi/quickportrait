import React, { useState } from "react";
import Modal from "./Modal";

export type SettingsTab = "api-key" | "general" | "presets" | "advanced";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon?: React.ReactNode;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabConfig[];
  children: (activeTab: SettingsTab) => React.ReactNode;
  defaultTab?: SettingsTab;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tabs,
  children,
  defaultTab,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    defaultTab || tabs[0]?.id || "api-key"
  );

  // Reset to default tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab || tabs[0]?.id || "api-key");
    }
  }, [isOpen, defaultTab, tabs]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="large">
      <div className="flex flex-col md:flex-row gap-0 h-full min-h-0">
        {/* Sidebar Tabs - Fixed */}
        <div className="w-full md:w-56 flex-shrink-0 border-b md:border-b-0 bg-dark-bg/50 md:bg-transparent relative md:border-r md:border-cyan/30">
          {/* Vertical border extends full height */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-cyan/30 md:hidden"></div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible scrollbar-hide p-2 md:p-4 md:sticky md:top-0 relative z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase transition-all duration-200
                  whitespace-nowrap min-h-[44px] w-full relative
                  ${
                    activeTab === tab.id
                      ? "bg-cyan text-dark-bg border-2 border-cyan"
                      : "bg-dark-bg/50 text-cyan/70 border-2 border-cyan/30 hover:border-cyan/50 hover:text-cyan hover:bg-cyan/10"
                  }
                  btn-dither
                  active:scale-[0.98]
                `}
                style={{
                  boxShadow:
                    activeTab === tab.id
                      ? "0 0 15px rgba(0, 255, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.2)"
                      : undefined,
                }}
                data-testid={`settings-tab-${tab.id}`}
              >
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto scrollbar-hide min-h-0" 
          style={{ 
            WebkitOverflowScrolling: 'touch' as const, 
            touchAction: 'pan-y' as const 
          }}
        >
          <div className="animate-fade-in p-3 md:p-6">{children(activeTab)}</div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </Modal>
  );
};

export default SettingsModal;
