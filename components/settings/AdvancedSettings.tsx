import React from "react";

const AdvancedSettings: React.FC = () => {
  return (
    <div className="space-y-6 min-h-[400px]">
      {/* About */}
      <div className="glass border border-cyan/30 p-6">
        <h3 className="text-cyan text-lg font-bold uppercase mb-3">
          About Quick Portrait
        </h3>
        <div className="space-y-2 text-xs text-cyan/70">
          <p>
            Quick Portrait is a privacy-first AI-powered image editing tool. All
            processing happens in your browser using your own API keys.
          </p>
          <p className="pt-2">
            <strong className="text-cyan">Version:</strong> 1.0.0
          </p>
          <p>
            <strong className="text-cyan">Author:</strong> Lokesh Inumpudi
          </p>
          <p>
            <strong className="text-cyan">Powered by:</strong> Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
