import { create } from 'zustand';

export type Tool = 'select' | 'move' | 'rotate' | 'scale';

export type SceneObject = {
  id: string;
  type: 'cube' | 'wall' | string;
  name?: string;
  // Future: transform, material, metadata
};

export type SelectionState = {
  selectedIds: string[];
};

export type HistoryState = {
  // Simple history stubs for future implementation
  past: unknown[];
  future: unknown[];
};

export type UIState = {
  activeTool: Tool;
};

export type AppState = {
  objects: SceneObject[];
  selection: SelectionState;
  history: HistoryState;
  ui: UIState;

  setActiveTool: (tool: Tool) => void;
  setSelection: (ids: string[]) => void;
  addObject: (obj: SceneObject) => void;
};

export const useAppStore = create<AppState>((set) => ({
  objects: [],
  selection: { selectedIds: [] },
  history: { past: [], future: [] },
  ui: { activeTool: 'select' },

  setActiveTool: (tool) => set((s) => ({ ui: { ...s.ui, activeTool: tool } })),
  setSelection: (ids) => set(() => ({ selection: { selectedIds: ids } })),
  addObject: (obj) => set((s) => ({ objects: [...s.objects, obj] })),
}));
