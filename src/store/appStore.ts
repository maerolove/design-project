import { create } from 'zustand';

export type Tool = 'select' | 'move' | 'rotate' | 'scale' | 'addWall';

export type Vec3 = { x: number; y: number; z: number };

export type CubeObject = {
  id: string;
  type: 'cube';
  name?: string;
  position: Vec3;
  rotation: Vec3; // radians
  scale: Vec3;
  dims: { width: number; height: number; depth: number };
};

export type WallObject = {
  id: string;
  type: 'wall';
  name?: string;
  position: Vec3;
  rotation: Vec3; // radians
  scale: Vec3;
  wall: { thickness: number; height: number; length: number };
};

export type SceneObject = CubeObject | WallObject;

export type SelectionState = {
  selectedIds: string[];
};

export type HistorySnapshot = {
  objects: SceneObject[];
  selection: SelectionState;
};

export type HistoryState = {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
};

export type UIState = {
  activeTool: Tool;
  snap: {
    translate: number; // meters
    rotate: number; // degrees
    scale: number; // unitless
  };
};

export type AppState = {
  objects: SceneObject[];
  selection: SelectionState;
  history: HistoryState;
  ui: UIState;

  setActiveTool: (tool: Tool) => void;
  setSelection: (ids: string[], additive?: boolean) => void;
  addObject: (obj: SceneObject, options?: { pushHistory?: boolean }) => void;
  updateObject: (id: string, update: Partial<CubeObject & WallObject>, options?: { pushHistory?: boolean }) => void;
  removeObject: (id: string, options?: { pushHistory?: boolean }) => void;

  pushHistorySnapshot: () => void;
  undo: () => void;
  redo: () => void;
};

const cloneSnapshot = (s: Pick<AppState, 'objects' | 'selection'>): HistorySnapshot => ({
  // Deep-ish clone sufficient for our simple data structures
  objects: s.objects.map((o) => JSON.parse(JSON.stringify(o)) as SceneObject),
  selection: { selectedIds: [...s.selection.selectedIds] },
});

export const useAppStore = create<AppState>((set, get) => ({
  objects: [],
  selection: { selectedIds: [] },
  history: { past: [], future: [] },
  ui: {
    activeTool: 'select',
    snap: { translate: 0.1, rotate: 15, scale: 0.1 },
  },

  setActiveTool: (tool) => set((s) => ({ ui: { ...s.ui, activeTool: tool } })),

  setSelection: (ids, additive) =>
    set((s) => {
      const next = additive ? Array.from(new Set([...s.selection.selectedIds, ...ids])) : ids;
      return { selection: { selectedIds: next } };
    }),

  addObject: (obj, options) =>
    set((s) => {
      const push = options?.pushHistory ?? true;
      const newState = { objects: [...s.objects, obj] } as Partial<AppState>;
      if (push) {
        const snap = cloneSnapshot({ objects: s.objects, selection: s.selection });
        return { ...newState, history: { past: [...s.history.past, snap], future: [] } } as Partial<AppState> as AppState;
      }
      return newState as AppState;
    }),

  updateObject: (id, update, options) =>
    set((s) => {
      const push = options?.pushHistory ?? false;
      const idx = s.objects.findIndex((o) => o.id === id);
      if (idx === -1) return {} as AppState;
      const nextObjects = s.objects.map((o, i) => (i === idx ? ({ ...o, ...update } as SceneObject) : o));
      if (push) {
        const snap = cloneSnapshot({ objects: s.objects, selection: s.selection });
        return { objects: nextObjects, history: { past: [...s.history.past, snap], future: [] } } as Partial<AppState> as AppState;
      }
      return { objects: nextObjects } as Partial<AppState> as AppState;
    }),

  removeObject: (id, options) =>
    set((s) => {
      const push = options?.pushHistory ?? true;
      const nextObjects = s.objects.filter((o) => o.id !== id);
      const nextSelection = { selectedIds: s.selection.selectedIds.filter((sid) => sid !== id) };
      if (push) {
        const snap = cloneSnapshot({ objects: s.objects, selection: s.selection });
        return { objects: nextObjects, selection: nextSelection, history: { past: [...s.history.past, snap], future: [] } } as Partial<AppState> as AppState;
      }
      return { objects: nextObjects, selection: nextSelection } as Partial<AppState> as AppState;
    }),

  pushHistorySnapshot: () =>
    set((s) => ({ history: { past: [...s.history.past, cloneSnapshot({ objects: s.objects, selection: s.selection })], future: [] } })),

  undo: () =>
    set((s) => {
      if (s.history.past.length === 0) return {} as AppState;
      const prev = s.history.past[s.history.past.length - 1];
      const newPast = s.history.past.slice(0, -1);
      const futureSnap = cloneSnapshot({ objects: s.objects, selection: s.selection });
      return { objects: prev.objects, selection: prev.selection, history: { past: newPast, future: [futureSnap, ...s.history.future] } } as Partial<AppState> as AppState;
    }),

  redo: () =>
    set((s) => {
      if (s.history.future.length === 0) return {} as AppState;
      const next = s.history.future[0];
      const newFuture = s.history.future.slice(1);
      const pastSnap = cloneSnapshot({ objects: s.objects, selection: s.selection });
      return { objects: next.objects, selection: next.selection, history: { past: [...s.history.past, pastSnap], future: newFuture } } as Partial<AppState> as AppState;
    }),
}));
