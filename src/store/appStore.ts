import { create } from 'zustand';

export type DocumentKind = 'PDF' | 'Word';

export type DocumentVersion = {
  id: string;
  version: number;
  uploadedAt: string;
  fileName?: string;
  comment?: string;
  content: string;
};

export type RegulatoryDocument = {
  id: string;
  title: string;
  code: string;
  type: DocumentKind;
  summary: string;
  keywords: string[];
  categories: string[];
  lastUpdated: string;
  versions: DocumentVersion[];
};

export type AttachmentRecord = {
  id: string;
  documentId: string;
  documentVersion: number;
  attachedAt: string;
  attachedBy: string;
  notes?: string;
};

export type ManagedObject = {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  attachments: AttachmentRecord[];
};

export type ManagementState = {
  documents: RegulatoryDocument[];
  objects: ManagedObject[];
  selectedObjectId: string | null;
  documentSearch: string;
};

export type AddObjectPayload = {
  name: string;
  category: string;
  location: string;
  description: string;
};

export type AddDocumentPayload = {
  title: string;
  code: string;
  type: DocumentKind;
  summary: string;
  keywords: string[];
  fileName?: string;
  fullText: string;
  comment?: string;
};

export type AttachDocumentPayload = {
  objectId: string;
  documentId: string;
  attachedBy: string;
  notes?: string;
};

export type ManagementActions = {
  setDocumentSearch: (value: string) => void;
  selectObject: (objectId: string) => void;
  addObject: (payload: AddObjectPayload) => void;
  addDocument: (payload: AddDocumentPayload) => void;
  attachDocument: (payload: AttachDocumentPayload) => void;
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? (crypto.randomUUID as () => string)()
    : Math.random().toString(36).slice(2, 10);

const nowIso = () => new Date().toISOString();

const buildVersion = (overrides: Partial<DocumentVersion> = {}): DocumentVersion => ({
  id: createId(),
  version: overrides.version ?? 1,
  uploadedAt: overrides.uploadedAt ?? nowIso(),
  fileName: overrides.fileName,
  comment: overrides.comment,
  content: overrides.content ?? '',
});

const createDocument = (doc: Omit<RegulatoryDocument, 'id' | 'versions' | 'lastUpdated'> & { versions: DocumentVersion[] }): RegulatoryDocument => {
  const versions = doc.versions.length ? doc.versions : [buildVersion({ content: doc.summary })];
  const lastUpdated = versions.reduce((latest, version) => (version.uploadedAt > latest ? version.uploadedAt : latest), versions[0].uploadedAt);
  return {
    id: createId(),
    title: doc.title,
    code: doc.code,
    type: doc.type,
    summary: doc.summary,
    keywords: doc.keywords,
    categories: doc.categories,
    versions,
    lastUpdated,
  };
};

const sampleDocuments: RegulatoryDocument[] = [
  createDocument({
    title: 'СП 118.13330.2012 «Общественные здания и сооружения»',
    code: 'СП 118.13330.2012',
    type: 'PDF',
    summary:
      'Актуализированная редакция СНиП 31-06-2009, описывает требования к планировочным решениям, путям эвакуации и инженерным системам общественных зданий.',
    keywords: ['пожарная безопасность', 'общественные здания', 'эвакуация'],
    categories: ['Пожарная безопасность', 'Архитектура'],
    versions: [
      buildVersion({
        version: 1,
        uploadedAt: '2023-05-18T09:40:00.000Z',
        fileName: 'sp118_public_buildings_v1.pdf',
        comment: 'Первичная загрузка документа',
        content:
          'Настоящий свод правил устанавливает требования к проектированию общественных зданий, включая эвакуационные пути, инженерные системы и требования устойчивости при пожаре.',
      }),
      buildVersion({
        version: 2,
        uploadedAt: '2024-02-04T12:15:00.000Z',
        fileName: 'sp118_public_buildings_v2.pdf',
        comment: 'Обновлена глава о системах пожаротушения.',
        content:
          'Изменения по автоматизированным системам пожаротушения и эвакуации, дополнены требования по интеграции с системами диспетчеризации и уведомления.',
      }),
    ],
  }),
  createDocument({
    title: 'ГОСТ Р 22.9.05-95. Безопасность в чрезвычайных ситуациях. Планы эвакуации',
    code: 'ГОСТ Р 22.9.05-95',
    type: 'Word',
    summary:
      'Стандарт регламентирует структуру планов эвакуации и требования к содержанию инструкций по действиям персонала при авариях.',
    keywords: ['чрезвычайные ситуации', 'планы эвакуации', 'ГОСТ'],
    categories: ['Безопасность', 'Документация'],
    versions: [
      buildVersion({
        version: 1,
        uploadedAt: '2022-11-01T08:20:00.000Z',
        fileName: 'gost_r_22_9_05.docx',
        comment: 'Загружено отделом ГО и ЧС',
        content:
          'ГОСТ описывает состав планов эвакуации, требования к символике, текстовым инструкциям и порядку обновления документации при изменениях на объекте.',
      }),
    ],
  }),
  createDocument({
    title: 'Федеральный закон № 384-ФЗ «Технический регламент о безопасности зданий и сооружений»',
    code: 'ФЗ №384',
    type: 'PDF',
    summary:
      'Основополагающий документ, устанавливающий обязательные требования к безопасности зданий на всех стадиях жизненного цикла.',
    keywords: ['технический регламент', 'безопасность', 'здания и сооружения'],
    categories: ['Нормативные акты'],
    versions: [
      buildVersion({
        version: 1,
        uploadedAt: '2021-09-14T10:05:00.000Z',
        fileName: 'fz_384_regulation.pdf',
        content:
          'Федеральный закон определяет требования к механической, пожарной, санитарной и экологической безопасности зданий, а также к энергоэффективности и эксплуатации.',
      }),
    ],
  }),
];

const pickDocumentByCode = (code: string) => sampleDocuments.find((doc) => doc.code === code);

const sampleObjects: ManagedObject[] = [
  {
    id: createId(),
    name: 'Диспетчерский пункт ЦОД «Энерго»',
    category: 'Инженерная инфраструктура',
    location: 'Москва, ул. Промышленная, 12',
    description:
      'Центр обработки данных с круглосуточным мониторингом жизненно важных инженерных систем. Требует строгого соблюдения регламентов по пожарной безопасности и эвакуации.',
    createdAt: '2023-05-20T09:15:00.000Z',
    updatedAt: '2024-02-04T12:20:00.000Z',
    attachments: [
      {
        id: createId(),
        documentId: pickDocumentByCode('СП 118.13330.2012')!.id,
        documentVersion: 1,
        attachedAt: '2023-06-01T09:00:00.000Z',
        attachedBy: 'Алексей Павлов',
        notes: 'Первичный аудит объекта после ввода в эксплуатацию',
      },
      {
        id: createId(),
        documentId: pickDocumentByCode('СП 118.13330.2012')!.id,
        documentVersion: 2,
        attachedAt: '2024-02-04T12:12:00.000Z',
        attachedBy: 'Мария Латышева',
        notes: 'Обновление требований по пожаротушению и оповещению',
      },
      {
        id: createId(),
        documentId: pickDocumentByCode('ФЗ №384')!.id,
        documentVersion: 1,
        attachedAt: '2023-12-12T16:40:00.000Z',
        attachedBy: 'ИБ Контроль',
        notes: 'Проверка соблюдения базовых требований безопасности объекта',
      },
    ],
  },
  {
    id: createId(),
    name: 'Общежитие №7 НИУ «Строитель»',
    category: 'Жилой фонд',
    location: 'Санкт-Петербург, наб. Реки Карповка, 8',
    description:
      'Десятиэтажное здание общежития на 320 мест. В приоритете требования по эвакуации и противопожарной защите.',
    createdAt: '2022-02-11T10:25:00.000Z',
    updatedAt: '2023-10-18T14:30:00.000Z',
    attachments: [
      {
        id: createId(),
        documentId: pickDocumentByCode('ГОСТ Р 22.9.05-95')!.id,
        documentVersion: 1,
        attachedAt: '2023-10-18T14:20:00.000Z',
        attachedBy: 'Дежурная часть',
        notes: 'Актуализация маршрутов эвакуации после ремонта',
      },
    ],
  },
  {
    id: createId(),
    name: 'Производственный корпус №3 «ПолимерПром»',
    category: 'Производство',
    location: 'Нижний Новгород, промышленная зона «Южная»',
    description:
      'Линия по выпуску полимерных покрытий. Есть зоны повышенной пожарной опасности и требования по автоматическим системам тушения.',
    createdAt: '2021-08-08T08:10:00.000Z',
    updatedAt: '2024-01-12T09:05:00.000Z',
    attachments: [
      {
        id: createId(),
        documentId: pickDocumentByCode('ФЗ №384')!.id,
        documentVersion: 1,
        attachedAt: '2024-01-12T09:00:00.000Z',
        attachedBy: 'Технадзор',
        notes: 'Подтверждение соответствия требованиям эксплуатации',
      },
    ],
  },
];

const initialState: ManagementState = {
  documents: sampleDocuments,
  objects: sampleObjects,
  selectedObjectId: sampleObjects[0]?.id ?? null,
  documentSearch: '',
};

export const useManagementStore = create<ManagementState & ManagementActions>((set, get) => ({
  ...initialState,
  setDocumentSearch: (value) => set({ documentSearch: value }),
  selectObject: (objectId) => set({ selectedObjectId: objectId }),
  addObject: (payload) => {
    const timestamp = nowIso();
    const newObject: ManagedObject = {
      id: createId(),
      name: payload.name,
      category: payload.category,
      location: payload.location,
      description: payload.description,
      createdAt: timestamp,
      updatedAt: timestamp,
      attachments: [],
    };

    set((state) => ({
      objects: [...state.objects, newObject],
      selectedObjectId: newObject.id,
    }));
  },
  addDocument: (payload) => {
    const timestamp = nowIso();
    const versions: DocumentVersion[] = [
      {
        id: createId(),
        version: 1,
        uploadedAt: timestamp,
        fileName: payload.fileName,
        comment: payload.comment,
        content: payload.fullText || payload.summary,
      },
    ];

    const newDocument: RegulatoryDocument = {
      id: createId(),
      title: payload.title,
      code: payload.code,
      type: payload.type,
      summary: payload.summary,
      keywords: payload.keywords,
      categories: [],
      versions,
      lastUpdated: timestamp,
    };

    set((state) => ({
      documents: [newDocument, ...state.documents],
    }));
  },
  attachDocument: ({ objectId, documentId, attachedBy, notes }) => {
    const state = get();
    const targetObjectIndex = state.objects.findIndex((obj) => obj.id === objectId);
    const document = state.documents.find((doc) => doc.id === documentId);

    if (targetObjectIndex === -1 || !document) {
      return;
    }

    const latestVersion = document.versions.reduce((acc, version) => (version.version > acc.version ? version : acc), document.versions[0]);
    const timestamp = nowIso();

    const attachment: AttachmentRecord = {
      id: createId(),
      documentId,
      documentVersion: latestVersion.version,
      attachedAt: timestamp,
      attachedBy,
      notes,
    };

    set((current) => ({
      objects: current.objects.map((obj, index) => {
        if (index !== targetObjectIndex) {
          return obj;
        }

        return {
          ...obj,
          attachments: [...obj.attachments, attachment],
          updatedAt: timestamp,
        };
      }),
    }));
  },
}));
