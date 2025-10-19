import React from 'react';
import { useAppStore } from '../store/appStore';
import { createCubeObject, snapToGrid } from '../scene/factories';

export const Toolbar: React.FC = () => {
  const activeTool = useAppStore((s) => s.ui.activeTool);
  const setActiveTool = useAppStore((s) => s.setActiveTool);
  const addObject = useAppStore((s) => s.addObject);
  const setSelection = useAppStore((s) => s.setSelection);

  const Button: React.FC<{
    label: string;
    active?: boolean;
    onClick?: () => void;
  }> = ({ label, active, onClick }) => (
    <button className={active ? 'active' : undefined} onClick={onClick} title={label}>
      {label}
    </button>
  );

  const onAddCube = () => {
    const answer = window.prompt('Enter cube dimensions (width,height,depth) in meters', '1,1,1');
    let w = 1,
      h = 1,
      d = 1;
    if (answer) {
      const parts = answer.split(',').map((p) => parseFloat(p.trim()));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n) && n > 0)) {
        [w, h, d] = parts;
      }
    }
    w = snapToGrid(w);
    h = snapToGrid(h);
    d = snapToGrid(d);
    const obj = createCubeObject({ dims: { width: w, height: h, depth: d } });
    addObject(obj, { pushHistory: true });
    setSelection([obj.id]);
    setActiveTool('move');
  };

  const onAddWall = () => setActiveTool('addWall');

  return (
    <div className="toolbar">
      <Button label="Add Cube" onClick={onAddCube} />
      <Button label="Add Wall" active={activeTool === 'addWall'} onClick={onAddWall} />
      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #e2e2e6' }} />
      <Button label="Select" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
      <Button label="Move" active={activeTool === 'move'} onClick={() => setActiveTool('move')} />
      <Button label="Rotate" active={activeTool === 'rotate'} onClick={() => setActiveTool('rotate')} />
      <Button label="Scale" active={activeTool === 'scale'} onClick={() => setActiveTool('scale')} />
    </div>
  );
};
