import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="topbar">
      <span className="title">3D Editor Scaffold</span>
      <span style={{ color: '#6b7280', fontSize: 12 }}>Vite + React + TypeScript + three.js</span>
    </div>
  );
};
