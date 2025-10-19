import React, { useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { Toolbar } from '@/components/Toolbar';
import { Viewport } from '@/components/Viewport';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { TopBar } from '@/components/TopBar';
import { StatusBar } from '@/components/StatusBar';
import { ConsolePanel } from '@/components/ConsolePanel';
import { useAppStore } from '@/store/appStore';

function App() {
  const log = useAppStore((s) => s.log);

  useEffect(() => {
    log('info', 'Editor initialized');
  }, [log]);

  return (
    <div className="app-shell">
      <TopBar />
      <div className="main">
        <SplitPane split="horizontal" minSize={80} defaultSize="80%" allowResize>
          <SplitPane split="vertical" minSize={56} defaultSize={64} allowResize>
            <Toolbar />
            <SplitPane split="vertical" primary="second" minSize={240} defaultSize={320} allowResize>
              <Viewport />
              <PropertiesPanel />
            </SplitPane>
          </SplitPane>
          <ConsolePanel />
        </SplitPane>
      </div>
      <StatusBar />
    </div>
  );
}

export default App;
