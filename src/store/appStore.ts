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

export type LogLevel = 'info' | 'warn' | 'error';
export type LogEntry = {
  id: string;
  level: LogLevel;
  message: string;
  time: number;
};

export type AppState = {
  objects: SceneObject[];
  selection: SelectionState;
  history: HistoryState;
  ui: UIState;
  logs: LogEntry[];

  setActiveTool: (tool: Tool) => void;
  setSelection: (ids: string[]) => void;
  addObject: (obj: SceneObject) => void;
  log: (level: LogLevel, message: string) => void;
  clearLogs: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  objects: [],
  selection: { selectedIds: [] },
  history: { past: [], future: [] },
  ui: { activeTool: 'select' },
  logs: [],

  setActiveTool: (tool) => set((s) => ({ ui: { ...s.ui, activeTool: tool } })),
  setSelection: (ids) => set(() => ({ selection: { selectedIds: ids } })),
  addObject: (obj) =>
    set((s) => ({
      objects: [...s.objects, obj],
      logs: [
        ...s.logs,
        { id: `${Date.now()}-${Math.random()}`, level: 'info', message: `Added ${obj.type} (${obj.id})`, time: Date.now() },
      ],
    })),
  log: (level, message) =>
    set((s) => ({ logs: [...s.logs, { id: `${Date.now()}-${Math.random()}`, level, message, time: Date.now() }] })),
  clearLogs: () => set(() => ({ logs: [] })),
}));
