/**
 * Google Apps Script — مزامنة زيارات مناديب المربع الفضي
 *
 * خطوات التفعيل (دقيقتين فقط):
 * 1. افتح Google Sheet الخاص بالشركة -> الإضافات (Extensions) -> Apps Script.
 * 2. الصق هذا الكود مكان الكود الموجود واحفظ (Ctrl+S).
 * 3. اضغط Deploy -> New deployment -> Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. انسخ رابط الـ Web App والصقه في:
 *    - شيت الإعدادات بمفتاح: cafe.webhook_url
 *    - أو داخل لوحة الإدارة في تطبيق المناديب.
 */

const SHEET_NAME = 'زيارات_المناديب';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'التاريخ',
      'معرف المندوب',
      'اسم المندوب',
      'معرف العميل',
      'اسم المحل',
      'النشاط',
      'المنطقة',
      'الجوال',
      'حالة الزيارة',
      'ملاحظات',
      'lat',
      'lng'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      payload.visitDate || new Date().toLocaleString('ar-SA'),
      payload.repId || '',
      payload.repName || '',
      payload.leadId || '',
      payload.leadName || '',
      payload.category || '',
      payload.area || '',
      payload.phone || '',
      payload.visitStatus || '',
      payload.visitNotes || '',
      payload.lat || '',
      payload.lng || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, visits: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const visits = rows.slice(1).map(r => ({
      visitDate: r[0],
      repId: r[1],
      repName: r[2],
      id: r[3],
      name: r[4],
      category: r[5],
      area: r[6],
      phone: String(r[7] || ''),
      visitStatus: r[8],
      visitNotes: r[9],
      lat: r[10],
      lng: r[11],
      isVisited: true,
      visitedBy: r[2] || r[1]
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, visits }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
