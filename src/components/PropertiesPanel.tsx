import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { radToDeg, degToRad, snapToGrid } from '../scene/factories';

export const PropertiesPanel: React.FC = () => {
  const selection = useAppStore((s) => s.selection);
  const objects = useAppStore((s) => s.objects);
  const updateObject = useAppStore((s) => s.updateObject);
  const uiSnap = useAppStore((s) => s.ui.snap);

  const selected = useMemo(() => objects.find((o) => o.id === selection.selectedIds[0]), [objects, selection.selectedIds]);

  const NumberField: React.FC<{ label: string; value: number; step?: number; onChange: (v: number) => void }> = ({ label, value, step = 0.1, onChange }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ width: 100, color: '#374151' }}>{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        step={step}
        style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e2e6', borderRadius: 6 }}
      />
    </label>
  );

  return (
    <div className="properties">
      <div className="section-title">Properties</div>
      <div className="content">
        {selection.selectedIds.length === 0 || !selected ? (
          <div>
            Nothing selected
            <div style={{ height: 12 }} />
            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>Snapping</div>
            <NumberField label="Translate (m)" value={uiSnap.translate} step={0.05} onChange={(v) => useAppStore.setState((s) => ({ ui: { ...s.ui, snap: { ...s.ui.snap, translate: Math.max(0, v || 0) } } }))} />
            <NumberField label="Rotate (deg)" value={uiSnap.rotate} step={1} onChange={(v) => useAppStore.setState((s) => ({ ui: { ...s.ui, snap: { ...s.ui.snap, rotate: Math.max(0, v || 0) } } }))} />
            <NumberField label="Scale" value={uiSnap.scale} step={0.05} onChange={(v) => useAppStore.setState((s) => ({ ui: { ...s.ui, snap: { ...s.ui.snap, scale: Math.max(0, v || 0) } } }))} />
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>{selected.name ?? selected.type}</div>
            <div style={{ fontWeight: 600, color: '#374151', marginTop: 12, marginBottom: 6 }}>Transform</div>
            <NumberField
              label="Position X"
              value={selected.position.x}
              onChange={(v) => updateObject(selected.id, { position: { ...selected.position, x: snapToGrid(v) } }, { pushHistory: true })}
            />
            <NumberField
              label="Position Y"
              value={selected.position.y}
              onChange={(v) => updateObject(selected.id, { position: { ...selected.position, y: snapToGrid(v) } }, { pushHistory: true })}
            />
            <NumberField
              label="Position Z"
              value={selected.position.z}
              onChange={(v) => updateObject(selected.id, { position: { ...selected.position, z: snapToGrid(v) } }, { pushHistory: true })}
            />

            <NumberField
              label="Rotation X (deg)"
              value={radToDeg(selected.rotation.x)}
              step={1}
              onChange={(v) => updateObject(selected.id, { rotation: { ...selected.rotation, x: degToRad(v) } }, { pushHistory: true })}
            />
            <NumberField
              label="Rotation Y (deg)"
              value={radToDeg(selected.rotation.y)}
              step={1}
              onChange={(v) => updateObject(selected.id, { rotation: { ...selected.rotation, y: degToRad(v) } }, { pushHistory: true })}
            />
            <NumberField
              label="Rotation Z (deg)"
              value={radToDeg(selected.rotation.z)}
              step={1}
              onChange={(v) => updateObject(selected.id, { rotation: { ...selected.rotation, z: degToRad(v) } }, { pushHistory: true })}
            />

            <NumberField
              label="Scale X"
              value={selected.scale.x}
              step={0.05}
              onChange={(v) => updateObject(selected.id, { scale: { ...selected.scale, x: v || 0 } }, { pushHistory: true })}
            />
            <NumberField
              label="Scale Y"
              value={selected.scale.y}
              step={0.05}
              onChange={(v) => updateObject(selected.id, { scale: { ...selected.scale, y: v || 0 } }, { pushHistory: true })}
            />
            <NumberField
              label="Scale Z"
              value={selected.scale.z}
              step={0.05}
              onChange={(v) => updateObject(selected.id, { scale: { ...selected.scale, z: v || 0 } }, { pushHistory: true })}
            />

            {selected.type === 'wall' && (
              <>
                <div style={{ fontWeight: 600, color: '#374151', marginTop: 12, marginBottom: 6 }}>Wall</div>
                <NumberField
                  label="Thickness (m)"
                  value={selected.wall.thickness}
                  step={0.05}
                  onChange={(v) =>
                    updateObject(
                      selected.id,
                      { wall: { ...selected.wall, thickness: snapToGrid(Math.max(0.01, v || 0)) } as any },
                      { pushHistory: true }
                    )
                  }
                />
                <NumberField
                  label="Height (m)"
                  value={selected.wall.height}
                  step={0.05}
                  onChange={(v) => updateObject(selected.id, { wall: { ...selected.wall, height: snapToGrid(Math.max(0.01, v || 0)) } as any }, { pushHistory: true })}
                />
              </>
            )}

            {selected.type === 'cube' && (
              <>
                <div style={{ fontWeight: 600, color: '#374151', marginTop: 12, marginBottom: 6 }}>Cube</div>
                <NumberField
                  label="Width (m)"
                  value={selected.dims.width}
                  step={0.05}
                  onChange={(v) => updateObject(selected.id, { dims: { ...selected.dims, width: snapToGrid(Math.max(0.01, v || 0)) } as any }, { pushHistory: true })}
                />
                <NumberField
                  label="Height (m)"
                  value={selected.dims.height}
                  step={0.05}
                  onChange={(v) => updateObject(selected.id, { dims: { ...selected.dims, height: snapToGrid(Math.max(0.01, v || 0)) } as any }, { pushHistory: true })}
                />
                <NumberField
                  label="Depth (m)"
                  value={selected.dims.depth}
                  step={0.05}
                  onChange={(v) => updateObject(selected.id, { dims: { ...selected.dims, depth: snapToGrid(Math.max(0.01, v || 0)) } as any }, { pushHistory: true })}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
