import React, { useMemo } from 'react';
import { useManagementStore } from '@/store/appStore';
import { formatDate, formatDateTime } from '@/utils/format';
import { exportObjectReportToPdf, exportObjectReportToWord } from '@/utils/exporters';

export const ObjectDetails: React.FC = () => {
  const selectedObjectId = useManagementStore((state) => state.selectedObjectId);
  const objectItem = useManagementStore((state) => state.objects.find((objectValue) => objectValue.id === state.selectedObjectId));
  const documents = useManagementStore((state) => state.documents);

  const { currentAttachments, history } = useMemo(() => {
    if (!objectItem) {
      return { currentAttachments: [], history: [] } as const;
    }

    const documentMap = new Map(documents.map((documentItem) => [documentItem.id, documentItem]));

    const latestByDocument = new Map<string, typeof objectItem.attachments[number]>();

    objectItem.attachments.forEach((attachment) => {
      const existing = latestByDocument.get(attachment.documentId);
      if (!existing || attachment.attachedAt > existing.attachedAt) {
        latestByDocument.set(attachment.documentId, attachment);
      }
    });

    const current = Array.from(latestByDocument.values())
      .map((attachment) => {
        const documentItem = documentMap.get(attachment.documentId);
        if (!documentItem) {
          return null;
        }
        return { attachment, document: documentItem };
      })
      .filter((value): value is { attachment: typeof objectItem.attachments[number]; document: (typeof documents)[number] } => Boolean(value))
      .sort((a, b) => b.attachment.attachedAt.localeCompare(a.attachment.attachedAt));

    const historyList = objectItem.attachments
      .slice()
      .sort((a, b) => b.attachedAt.localeCompare(a.attachedAt))
      .map((attachment) => {
        const documentItem = documentMap.get(attachment.documentId);
        if (!documentItem) {
          return null;
        }
        return { attachment, document: documentItem };
      })
      .filter((value): value is { attachment: typeof objectItem.attachments[number]; document: (typeof documents)[number] } => Boolean(value));

    return {
      currentAttachments: current,
      history: historyList,
    } as const;
  }, [documents, objectItem]);

  if (!objectItem || !selectedObjectId) {
    return (
      <div className="panel-content panel-empty">
        <div className="empty-state">
          <h2>Выберите объект справа</h2>
          <p>Карточка объекта и история привязок появятся в этой панели.</p>
        </div>
      </div>
    );
  }

  const handleExportPdf = () => {
    exportObjectReportToPdf(objectItem, currentAttachments, history);
  };

  const handleExportWord = () => {
    exportObjectReportToWord(objectItem, currentAttachments, history);
  };

  return (
    <div className="panel-content object-details">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">{objectItem.name}</h2>
          <p className="panel-subtitle">
            {objectItem.category} • {objectItem.location}
          </p>
        </div>
        <div className="action-buttons">
          <button type="button" className="button button-secondary" onClick={handleExportWord}>
            Экспорт в Word
          </button>
          <button type="button" className="button button-primary" onClick={handleExportPdf}>
            Экспорт в PDF
          </button>
        </div>
      </div>

      <section className="card details-card">
        <h3 className="card-title">Общая информация</h3>
        <div className="details-grid">
          <div>
            <span className="detail-label">Категория</span>
            <p className="detail-value">{objectItem.category}</p>
          </div>
          <div>
            <span className="detail-label">Местоположение</span>
            <p className="detail-value">{objectItem.location}</p>
          </div>
          <div>
            <span className="detail-label">Создан</span>
            <p className="detail-value">{formatDate(objectItem.createdAt)}</p>
          </div>
          <div>
            <span className="detail-label">Последнее обновление</span>
            <p className="detail-value">{formatDateTime(objectItem.updatedAt)}</p>
          </div>
        </div>
        <p className="detail-description">{objectItem.description}</p>
      </section>

      <section className="card details-card">
        <div className="section-header">
          <h3 className="card-title">Активные нормативы ({currentAttachments.length})</h3>
        </div>
        {currentAttachments.length === 0 ? (
          <p className="empty-hint">Нет привязанных документов.</p>
        ) : (
          <ul className="attachment-list">
            {currentAttachments.map((item) => (
              <li key={item.attachment.id} className="attachment-card">
                <div className="attachment-header">
                  <div>
                    <h4 className="attachment-title">{item.document.title}</h4>
                    <p className="attachment-meta">
                      {item.document.code} • версия {item.attachment.documentVersion} • добавлено {formatDateTime(item.attachment.attachedAt)}
                    </p>
                  </div>
                  <span className={`badge badge-${item.document.type.toLowerCase()}`}>{item.document.type}</span>
                </div>
                <p className="attachment-summary">{item.document.summary}</p>
                {!!item.document.keywords.length && (
                  <ul className="keyword-list">
                    {item.document.keywords.map((keyword) => (
                      <li key={keyword} className="keyword-item">
                        {keyword}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="attachment-footer">
                  <span>
                    Ответственный: <strong>{item.attachment.attachedBy}</strong>
                  </span>
                  {item.attachment.notes && <span>Комментарий: {item.attachment.notes}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card details-card">
        <div className="section-header">
          <h3 className="card-title">История привязок ({history.length})</h3>
        </div>
        {history.length === 0 ? (
          <p className="empty-hint">История пока пуста.</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.attachment.id} className="history-item">
                <div className="history-time">{formatDateTime(item.attachment.attachedAt)}</div>
                <div className="history-content">
                  <h4>{item.document.title}</h4>
                  <p>
                    {item.document.code} • версия {item.attachment.documentVersion} • Ответственный: {item.attachment.attachedBy}
                    {item.attachment.notes ? ` • ${item.attachment.notes}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
