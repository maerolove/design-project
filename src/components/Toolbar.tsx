import React from 'react';
import { useAppStore } from '@/store/appStore';

export const Toolbar: React.FC = () => {
  const activeTool = useAppStore((s) => s.ui.activeTool);
  const setActiveTool = useAppStore((s) => s.setActiveTool);
  const addObject = useAppStore((s) => s.addObject);
  const log = useAppStore((s) => s.log);

  const Button: React.FC<{
    label: string;
    active?: boolean;
    onClick?: () => void;
  }> = ({ label, active, onClick }) => (
    <button className={active ? 'active' : undefined} onClick={onClick} title={label}>
      {label}
    </button>
  );

  const handleAddCube = () => {
    const id = Math.random().toString(36).slice(2, 8);
    addObject({ id, type: 'cube', name: `Cube ${id}` });
  };

  return (
    <div className="toolbar">
      <Button label="Add Cube" onClick={handleAddCube} />
      <Button label="Add Wall" onClick={() => log('warn', 'Add Wall: not implemented yet')} />
      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #e2e2e6' }} />
      <Button label="Select" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
      <Button label="Move" active={activeTool === 'move'} onClick={() => setActiveTool('move')} />
      <Button label="Rotate" active={activeTool === 'rotate'} onClick={() => setActiveTool('rotate')} />
      <Button label="Scale" active={activeTool === 'scale'} onClick={() => setActiveTool('scale')} />
    </div>
  );
};
