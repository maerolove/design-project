import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AddDocumentPayload,
  AttachDocumentPayload,
  DocumentKind,
  RegulatoryDocument,
  useManagementStore,
} from '@/store/appStore';
import { formatDate, formatDateTime } from '@/utils/format';

const toSearchable = (document: RegulatoryDocument) =>
  [
    document.title,
    document.code,
    document.summary,
    document.keywords.join(' '),
    document.categories.join(' '),
    document.versions.map((version) => version.content).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const matchesSearch = (document: RegulatoryDocument, search: string) => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const haystack = toSearchable(document);

  return normalizedSearch
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

const initialAttachment = {
  attachedBy: 'Специалист по соответствию',
  notes: '',
};

type UploadState = {
  title: string;
  code: string;
  summary: string;
  keywords: string;
  type: DocumentKind;
  file?: File;
  comment: string;
};

const initialUploadState: UploadState = {
  title: '',
  code: '',
  summary: '',
  keywords: '',
  type: 'PDF',
  comment: '',
};

export const DocumentList: React.FC = () => {
  const documents = useManagementStore((state) => state.documents);
  const documentSearch = useManagementStore((state) => state.documentSearch);
  const setDocumentSearch = useManagementStore((state) => state.setDocumentSearch);
  const selectedObjectId = useManagementStore((state) => state.selectedObjectId);
  const selectedObjectName = useManagementStore((state) => {
    const selected = state.objects.find((objectItem) => objectItem.id === state.selectedObjectId);
    return selected?.name ?? null;
  });
  const attachDocument = useManagementStore((state) => state.attachDocument);
  const addDocument = useManagementStore((state) => state.addDocument);

  const [attachmentTarget, setAttachmentTarget] = useState<string | null>(null);
  const [attachmentForm, setAttachmentForm] = useState(() => ({ ...initialAttachment }));
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadState, setUploadState] = useState(() => ({ ...initialUploadState }));
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocuments = useMemo(
    () => documents.filter((documentItem) => matchesSearch(documentItem, documentSearch)),
    [documents, documentSearch],
  );

  useEffect(() => {
    setAttachmentTarget(null);
    setAttachmentForm({ ...initialAttachment });
  }, [selectedObjectId]);

  const toggleUploadForm = () => {
    setShowUploadForm((value) => {
      if (value) {
        setUploadState({ ...initialUploadState });
      }
      return !value;
    });
  };

  const handleAttachClick = (documentId: string) => {
    if (!selectedObjectId) {
      return;
    }

    if (attachmentTarget === documentId) {
      setAttachmentTarget(null);
      setAttachmentForm({ ...initialAttachment });
      return;
    }

    setAttachmentTarget(documentId);
    setAttachmentForm({ ...initialAttachment });
  };

  const handleAttachmentSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!attachmentTarget || !selectedObjectId) {
      return;
    }

    const payload: AttachDocumentPayload = {
      objectId: selectedObjectId,
      documentId: attachmentTarget,
      attachedBy: attachmentForm.attachedBy.trim() || 'Не указан',
      notes: attachmentForm.notes.trim() || undefined,
    };

    attachDocument(payload);
    setAttachmentTarget(null);
    setAttachmentForm({ ...initialAttachment });
  };

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uploadState.title.trim() || !uploadState.code.trim() || !uploadState.summary.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      let fileContent = '';

      if (uploadState.file) {
        try {
          fileContent = await uploadState.file.text();
        } catch (error) {
          console.warn('Не удалось прочитать файл, используется только текстовое описание', error);
        }
      }

      const payload: AddDocumentPayload = {
        title: uploadState.title.trim(),
        code: uploadState.code.trim(),
        summary: uploadState.summary.trim(),
        type: uploadState.type,
        keywords: uploadState.keywords
          .split(',')
          .map((word) => word.trim())
          .filter(Boolean),
        fileName: uploadState.file?.name,
        fullText: [uploadState.summary, fileContent].filter(Boolean).join('\n'),
        comment: uploadState.comment.trim() || undefined,
      };

      addDocument(payload);
      setUploadState({ ...initialUploadState });
      setShowUploadForm(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="panel-content">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Нормативные документы</h2>
          <p className="panel-subtitle">Поиск и загрузка нормативов для привязки к объектам</p>
        </div>
        <button type="button" className="button button-secondary" onClick={toggleUploadForm}>
          {showUploadForm ? 'Скрыть загрузку' : 'Загрузить документ'}
        </button>
      </div>

      <div className="panel-section">
        <label className="field">
          <span className="field-label">Поиск по ключевым словам или тексту</span>
          <input
            value={documentSearch}
            onChange={(event) => setDocumentSearch(event.target.value)}
            placeholder="Введите ключевые слова, название или фрагмент текста"
            className="input"
            type="search"
          />
        </label>
        <p className="panel-meta">
          Найдено документов: <strong>{filteredDocuments.length}</strong>
        </p>
      </div>

      {showUploadForm && (
        <form className="card upload-form" onSubmit={handleUploadSubmit}>
          <h3 className="card-title">Новый нормативный документ</h3>
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Название*</span>
              <input
                type="text"
                className="input"
                value={uploadState.title}
                onChange={(event) => setUploadState((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Обозначение / номер*</span>
              <input
                type="text"
                className="input"
                value={uploadState.code}
                onChange={(event) => setUploadState((prev) => ({ ...prev, code: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Тип документа*</span>
              <select
                className="input"
                value={uploadState.type}
                onChange={(event) => setUploadState((prev) => ({ ...prev, type: event.target.value as DocumentKind }))}
                required
              >
                <option value="PDF">PDF</option>
                <option value="Word">Word</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">Ключевые слова</span>
              <input
                type="text"
                className="input"
                value={uploadState.keywords}
                placeholder="Например: пожарная безопасность, эвакуация"
                onChange={(event) => setUploadState((prev) => ({ ...prev, keywords: event.target.value }))}
              />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Краткое описание / выдержки*</span>
            <textarea
              className="textarea"
              rows={4}
              required
              value={uploadState.summary}
              onChange={(event) => setUploadState((prev) => ({ ...prev, summary: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Комментарий к версии</span>
            <input
              type="text"
              className="input"
              value={uploadState.comment}
              onChange={(event) => setUploadState((prev) => ({ ...prev, comment: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Файл (PDF или Word)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                setUploadState((prev) => ({ ...prev, file }));
              }}
            />
            <span className="field-hint">
              Файл используется для хранения и полнотекстового поиска. Если он не содержит извлекаемого текста, добавьте выдержки в описание выше.
            </span>
          </label>
          <div className="form-actions">
            <button type="button" className="button button-ghost" onClick={() => setShowUploadForm(false)}>
              Отмена
            </button>
            <button type="submit" className="button button-primary" disabled={isUploading}>
              {isUploading ? 'Сохраняем…' : 'Сохранить документ'}
            </button>
          </div>
        </form>
      )}

      <div className="document-list">
        {filteredDocuments.map((documentItem) => {
          const latestVersion = documentItem.versions.reduce(
            (current, candidate) => (candidate.version > current.version ? candidate : current),
            documentItem.versions[0],
          );

          const isOpen = attachmentTarget === documentItem.id;

          return (
            <article key={documentItem.id} className={`card document-card${isOpen ? ' document-card-active' : ''}`}>
              <div className="document-card-header">
                <div>
                  <h3 className="document-title">{documentItem.title}</h3>
                  <p className="document-meta">
                    {documentItem.code} • версия {latestVersion.version} • последнее обновление {formatDate(documentItem.lastUpdated)}
                  </p>
                </div>
                <span className={`badge badge-${documentItem.type.toLowerCase()}`}>{documentItem.type}</span>
              </div>
              <p className="document-summary">{documentItem.summary}</p>
              {!!documentItem.keywords.length && (
                <ul className="keyword-list">
                  {documentItem.keywords.map((keyword) => (
                    <li key={keyword} className="keyword-item">
                      {keyword}
                    </li>
                  ))}
                </ul>
              )}
              <details className="versions-list">
                <summary>История версий ({documentItem.versions.length})</summary>
                <ul>
                  {documentItem.versions
                    .slice()
                    .sort((a, b) => b.version - a.version)
                    .map((version) => (
                      <li key={version.id}>
                        <span className="version-title">Версия {version.version}</span>
                        <span className="version-meta">от {formatDateTime(version.uploadedAt)}</span>
                        {version.comment && <span className="version-comment">— {version.comment}</span>}
                      </li>
                    ))}
                </ul>
              </details>
              <div className="document-card-footer">
                <div className="document-attachment-hint">
                  {selectedObjectName ? (
                    <>
                      Привязать к: <strong>{selectedObjectName}</strong>
                    </>
                  ) : (
                    'Выберите объект, чтобы привязать документ'
                  )}
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => handleAttachClick(documentItem.id)}
                  disabled={!selectedObjectId}
                >
                  {isOpen ? 'Отменить' : 'Привязать'}
                </button>
              </div>

              {isOpen && (
                <form className="inline-form" onSubmit={handleAttachmentSubmit}>
                  <div className="form-grid">
                    <label className="field">
                      <span className="field-label">Ответственный</span>
                      <input
                        type="text"
                        className="input"
                        value={attachmentForm.attachedBy}
                        onChange={(event) =>
                          setAttachmentForm((prev) => ({ ...prev, attachedBy: event.target.value }))
                        }
                        placeholder="ФИО или подразделение"
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Комментарий</span>
                      <input
                        type="text"
                        className="input"
                        value={attachmentForm.notes}
                        onChange={(event) => setAttachmentForm((prev) => ({ ...prev, notes: event.target.value }))}
                        placeholder="Например, цель проверки"
                      />
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="button button-ghost" onClick={() => setAttachmentTarget(null)}>
                      Отмена
                    </button>
                    <button type="submit" className="button button-primary">
                      Подтвердить привязку
                    </button>
                  </div>
                </form>
              )}
            </article>
          );
        })}
        {filteredDocuments.length === 0 && (
          <div className="empty-state">
            <p>По заданным условиям документов не найдено. Попробуйте изменить ключевые слова или добавить новый документ.</p>
          </div>
        )}
      </div>
    </div>
  );
};
