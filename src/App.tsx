import React from 'react';
import { Toolbar } from './components/Toolbar';
import { Viewport } from './components/Viewport';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TopBar } from './components/TopBar';
import { StatusBar } from './components/StatusBar';

function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <Toolbar />
      <Viewport />
      <PropertiesPanel />
      <StatusBar />
    </div>
  );
}

export default App;
