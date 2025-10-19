import React from 'react';
import { useAppStore } from '../store/appStore';

export const Toolbar: React.FC = () => {
  const activeTool = useAppStore((s) => s.ui.activeTool);
  const setActiveTool = useAppStore((s) => s.setActiveTool);

  const Button: React.FC<{
    label: string;
    active?: boolean;
    onClick?: () => void;
  }> = ({ label, active, onClick }) => (
    <button className={active ? 'active' : undefined} onClick={onClick} title={label}>
      {label}
    </button>
  );

  return (
    <div className="toolbar">
      <Button label="Add Cube" />
      <Button label="Add Wall" />
      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #e2e2e6' }} />
      <Button label="Select" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
      <Button label="Move" active={activeTool === 'move'} onClick={() => setActiveTool('move')} />
      <Button label="Rotate" active={activeTool === 'rotate'} onClick={() => setActiveTool('rotate')} />
      <Button label="Scale" active={activeTool === 'scale'} onClick={() => setActiveTool('scale')} />
    </div>
  );
};
