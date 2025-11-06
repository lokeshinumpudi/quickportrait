import React from 'react';

interface LogPanelProps {
  error: string | null;
}

const LogPanel: React.FC<LogPanelProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="glass border-2 border-lime text-lime px-4 py-3 bg-lime/20" role="alert">
      <strong className="font-bold uppercase">Error_&gt; </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default LogPanel;