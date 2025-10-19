import React from 'react';
import { useAppStore } from '../store/appStore';

export const PropertiesPanel: React.FC = () => {
  const selection = useAppStore((s) => s.selection);
  const objects = useAppStore((s) => s.objects);

  return (
    <div className="properties">
      <div className="section-title">Properties</div>
      <div className="content">
        {selection.selectedIds.length === 0 ? (
          <div>Nothing selected</div>
        ) : (
          <div>
            Selected IDs: {selection.selectedIds.join(', ')}
            <br />
            Total objects: {objects.length}
          </div>
        )}
      </div>
    </div>
  );
};
