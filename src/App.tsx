import React from 'react';
import { DocumentList } from '@/components/DocumentList';
import { ObjectDetails } from '@/components/ObjectDetails';
import { ObjectList } from '@/components/ObjectList';
import { useManagementStore } from '@/store/appStore';

function App() {
  const totalObjects = useManagementStore((state) => state.objects.length);
  const totalDocuments = useManagementStore((state) => state.documents.length);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">Система управления объектами и нормативными документами</h1>
          <p className="app-subtitle">
            Контролируйте соответствие объектов нормативам, отслеживайте историю привязок и формируйте отчёты в один клик.
          </p>
        </div>
        <div className="app-footer-stats">
          <div className="stat">
            <span className="stat-value">{totalObjects}</span>
            <span className="stat-label">объекта в системе</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalDocuments}</span>
            <span className="stat-label">нормативных документов</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <section className="panel panel-left">
          <DocumentList />
        </section>
        <section className="panel panel-center">
          <ObjectDetails />
        </section>
        <section className="panel panel-right">
          <ObjectList />
        </section>
      </main>
    </div>
  );
}

export default App;
