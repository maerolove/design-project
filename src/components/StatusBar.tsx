import React from 'react';
import { useAppStore } from '../store/appStore';

export const StatusBar: React.FC = () => {
  const activeTool = useAppStore((s) => s.ui.activeTool);
  const objects = useAppStore((s) => s.objects);

  return (
    <div className="statusbar">
      <span>Ready</span>
      <span>•</span>
      <span>Tool: {activeTool}</span>
      <span>•</span>
      <span>Objects: {objects.length}</span>
    </div>
  );
};
