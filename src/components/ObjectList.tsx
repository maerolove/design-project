import React, { FormEvent, useMemo, useState } from 'react';
import { AddObjectPayload, ManagedObject, useManagementStore } from '@/store/appStore';
import { formatDate } from '@/utils/format';

const initialForm: AddObjectPayload = {
  name: '',
  category: '',
  location: '',
  description: '',
};

const getUniqueDocumentCount = (objectItem: ManagedObject) => new Set(objectItem.attachments.map((item) => item.documentId)).size;

export const ObjectList: React.FC = () => {
  const objects = useManagementStore((state) => state.objects);
  const selectedObjectId = useManagementStore((state) => state.selectedObjectId);
  const selectObject = useManagementStore((state) => state.selectObject);
  const addObject = useManagementStore((state) => state.addObject);

  const [showForm, setShowForm] = useState(objects.length === 0);
  const [formState, setFormState] = useState(() => ({ ...initialForm }));

  const sortedObjects = useMemo(
    () =>
      objects
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name, 'ru')),
    [objects],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.category.trim() || !formState.location.trim() || !formState.description.trim()) {
      return;
    }

    addObject({
      name: formState.name.trim(),
      category: formState.category.trim(),
      location: formState.location.trim(),
      description: formState.description.trim(),
    });

    setFormState({ ...initialForm });
    setShowForm(false);
  };

  return (
    <div className="panel-content">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Объекты</h2>
          <p className="panel-subtitle">Выберите объект для просмотра карточки и истории документов</p>
        </div>
        <button type="button" className="button button-secondary" onClick={() => setShowForm((value) => !value)}>
          {showForm ? 'Скрыть форму' : 'Новый объект'}
        </button>
      </div>

      {showForm && (
        <form className="card" onSubmit={handleSubmit}>
          <h3 className="card-title">Добавить объект</h3>
          <label className="field">
            <span className="field-label">Название*</span>
            <input
              type="text"
              className="input"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Например, Производственный корпус №4"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Тип / категория*</span>
            <input
              type="text"
              className="input"
              value={formState.category}
              onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Производство, жилой фонд, офис и т.д."
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Местоположение*</span>
            <input
              type="text"
              className="input"
              value={formState.location}
              onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Адрес или площадка"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Описание*</span>
            <textarea
              className="textarea"
              rows={4}
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Основные характеристики и требования безопасности"
              required
            />
          </label>
          <div className="form-actions">
            <button type="button" className="button button-ghost" onClick={() => setShowForm(false)}>
              Отмена
            </button>
            <button type="submit" className="button button-primary">
              Сохранить
            </button>
          </div>
        </form>
      )}

      <div className="object-list">
        {sortedObjects.map((objectItem) => {
          const attachmentsCount = objectItem.attachments.length;
          const uniqueDocs = getUniqueDocumentCount(objectItem);

          return (
            <article
              key={objectItem.id}
              className={`card object-card${selectedObjectId === objectItem.id ? ' object-card-active' : ''}`}
            >
              <button type="button" className="object-card-button" onClick={() => selectObject(objectItem.id)}>
                <div className="object-card-header">
                  <h3 className="object-title">{objectItem.name}</h3>
                  <span className="badge">{objectItem.category}</span>
                </div>
                <p className="object-location">{objectItem.location}</p>
                <p className="object-description">{objectItem.description}</p>
                <div className="object-meta">
                  <span>
                    Документов: <strong>{uniqueDocs}</strong>
                  </span>
                  <span>
                    История привязок: <strong>{attachmentsCount}</strong>
                  </span>
                </div>
                <div className="object-updated">Обновлено {formatDate(objectItem.updatedAt)}</div>
              </button>
            </article>
          );
        })}
        {sortedObjects.length === 0 && (
          <div className="empty-state">
            <p>Добавьте ваш первый объект, чтобы начать работу с системой.</p>
          </div>
        )}
      </div>
    </div>
  );
};
