import { jsPDF } from 'jspdf';
import { AttachmentRecord, ManagedObject, RegulatoryDocument } from '@/store/appStore';
import { formatDate, formatDateTime } from './format';

type AttachmentView = {
  document: RegulatoryDocument;
  attachment: AttachmentRecord;
};

const sanitizeFileName = (value: string) =>
  value
    .replace(/[\\/:*?"<>|]+/g, '')
    .trim()
    .replace(/\s+/g, '_') || 'report';

const ensurePageSpace = (pdf: jsPDF, currentY: number, minSpace: number) => {
  if (currentY + minSpace > pdf.internal.pageSize.getHeight() - 40) {
    pdf.addPage();
    return 60;
  }

  return currentY;
};

export const exportObjectReportToPdf = (
  objectItem: ManagedObject,
  currentAttachments: AttachmentView[],
  history: AttachmentView[],
) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const marginX = 48;
  const maxWidth = pdf.internal.pageSize.getWidth() - marginX * 2;
  let cursorY = 64;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(objectItem.name, marginX, cursorY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  cursorY += 22;
  pdf.text(`Категория: ${objectItem.category}`, marginX, cursorY);
  cursorY += 16;
  pdf.text(`Местоположение: ${objectItem.location}`, marginX, cursorY);
  cursorY += 16;
  pdf.text(`Описание:`, marginX, cursorY);
  cursorY += 14;
  const descriptionLines = pdf.splitTextToSize(objectItem.description, maxWidth);
  pdf.text(descriptionLines, marginX, cursorY);
  cursorY += descriptionLines.length * 14 + 12;

  pdf.text(`Создан: ${formatDate(objectItem.createdAt)} • Последнее обновление: ${formatDateTime(objectItem.updatedAt)}`, marginX, cursorY);
  cursorY += 24;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Текущие нормативные документы', marginX, cursorY);
  cursorY += 18;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);

  if (currentAttachments.length === 0) {
    pdf.text('К объекту не привязано ни одного документа.', marginX, cursorY);
    cursorY += 18;
  } else {
    currentAttachments.forEach((item, index) => {
      cursorY = ensurePageSpace(pdf, cursorY, 54);
      const header = `${index + 1}. ${item.document.title} (${item.document.code}, версия ${item.attachment.documentVersion})`;
      const headerLines = pdf.splitTextToSize(header, maxWidth);
      pdf.text(headerLines, marginX, cursorY);
      cursorY += headerLines.length * 14;

      const attachmentInfo = `Привязан: ${formatDateTime(item.attachment.attachedAt)}, ответственный: ${item.attachment.attachedBy}`;
      const infoLines = pdf.splitTextToSize(attachmentInfo, maxWidth);
      pdf.text(infoLines, marginX, cursorY);
      cursorY += infoLines.length * 14;

      if (item.attachment.notes) {
        const notesLines = pdf.splitTextToSize(`Комментарий: ${item.attachment.notes}`, maxWidth);
        pdf.text(notesLines, marginX, cursorY);
        cursorY += notesLines.length * 14;
      }

      const summaryLines = pdf.splitTextToSize(`Краткое содержание: ${item.document.summary}`, maxWidth);
      pdf.text(summaryLines, marginX, cursorY);
      cursorY += summaryLines.length * 14 + 10;
    });
  }

  cursorY = ensurePageSpace(pdf, cursorY, 60);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('История привязок', marginX, cursorY);
  cursorY += 18;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);

  if (history.length === 0) {
    pdf.text('История пока пуста.', marginX, cursorY);
  } else {
    history.forEach((item) => {
      cursorY = ensurePageSpace(pdf, cursorY, 48);
      const historyHeader = `${formatDateTime(item.attachment.attachedAt)} — ${item.document.title} (${item.document.code}, версия ${item.attachment.documentVersion})`;
      const historyLines = pdf.splitTextToSize(historyHeader, maxWidth);
      pdf.text(historyLines, marginX, cursorY);
      cursorY += historyLines.length * 14;

      const responsibleLine = `Ответственный: ${item.attachment.attachedBy}`;
      pdf.text(responsibleLine, marginX, cursorY);
      cursorY += 14;

      if (item.attachment.notes) {
        const notesLines = pdf.splitTextToSize(`Комментарий: ${item.attachment.notes}`, maxWidth);
        pdf.text(notesLines, marginX, cursorY);
        cursorY += notesLines.length * 14;
      }
    });
  }

  pdf.save(`${sanitizeFileName(objectItem.name)}.pdf`);
};

export const exportObjectReportToWord = (
  objectItem: ManagedObject,
  currentAttachments: AttachmentView[],
  history: AttachmentView[],
) => {
  const tableRows = currentAttachments
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.document.title}</td>
          <td>${item.document.code}</td>
          <td>${item.attachment.documentVersion}</td>
          <td>${formatDateTime(item.attachment.attachedAt)}</td>
          <td>${item.attachment.attachedBy}</td>
          <td>${item.attachment.notes ?? ''}</td>
        </tr>
      `,
    )
    .join('');

  const historyRows = history
    .map(
      (item) => `
        <tr>
          <td>${formatDateTime(item.attachment.attachedAt)}</td>
          <td>${item.document.title}</td>
          <td>${item.attachment.documentVersion}</td>
          <td>${item.attachment.attachedBy}</td>
          <td>${item.attachment.notes ?? ''}</td>
        </tr>
      `,
    )
    .join('');

  const html = `<!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <title>Отчёт по объекту</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1f2937; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin-top: 24px; margin-bottom: 8px; }
          p { margin: 4px 0; }
          table { border-collapse: collapse; width: 100%; margin-top: 8px; }
          th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
          th { background: #f3f4f6; }
          .meta { font-size: 12px; color: #4b5563; }
        </style>
      </head>
      <body>
        <h1>${objectItem.name}</h1>
        <p class="meta">Категория: ${objectItem.category} • ${objectItem.location}</p>
        <p>${objectItem.description}</p>
        <p class="meta">Создан: ${formatDate(objectItem.createdAt)} • Последнее обновление: ${formatDateTime(objectItem.updatedAt)}</p>

        <h2>Текущие нормативные документы</h2>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Наименование</th>
              <th>Обозначение</th>
              <th>Версия</th>
              <th>Дата привязки</th>
              <th>Ответственный</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="7">Нет активных привязанных документов</td></tr>'}
          </tbody>
        </table>

        <h2>История привязок</h2>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Документ</th>
              <th>Версия</th>
              <th>Ответственный</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows || '<tr><td colspan="5">История пока отсутствует</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFileName(objectItem.name)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
