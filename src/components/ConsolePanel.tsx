import React from 'react';
import { useAppStore } from '@/store/appStore';

export const ConsolePanel: React.FC = () => {
  const logs = useAppStore((s) => s.logs);
  const clearLogs = useAppStore((s) => s.clearLogs);

  return (
    <div className="console-panel">
      <div className="console-header">
        <span>Console</span>
        <button onClick={clearLogs} aria-label="Clear console">
          Clear
        </button>
      </div>
      <div className="console-body">
        {logs.length === 0 ? (
          <div className="console-empty">No messages</div>
        ) : (
          logs.map((l) => (
            <div key={l.id} className={`console-line ${l.level}`}>
              <span className="time">{new Date(l.time).toLocaleTimeString()}</span>
              <span className="level">[{l.level.toUpperCase()}]</span>
              <span className="msg">{l.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
