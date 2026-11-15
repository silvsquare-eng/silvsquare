import fs from 'fs/promises';
import https from 'https';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// الإعدادات: ضع روابط CSV الخاصة بجوجل شيت هنا
// ==========================================
const CATALOG_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3nOxONI26mhYcT5JYn4kLPK1ALccqO-eJDYet9DiQ-8n8Ya6uvh_WDXtevzAI3MozD1nv6rH_7LYo/pub?gid=1624564332&single=true&output=csv"; 
const CATALOG_EN_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3nOxONI26mhYcT5JYn4kLPK1ALccqO-eJDYet9DiQ-8n8Ya6uvh_WDXtevzAI3MozD1nv6rH_7LYo/pub?gid=2001&single=true&output=csv";
// ضع هنا رابط CSV المنشور لتبويب الكتالوج الثاني في Google Sheets (ملف -> مشاركة -> النشر على الويب -> اختر التبويب الثاني بصيغة CSV)
const CATALOG_2_CSV_URL = "رابط_CSV_للكتالوج_الثاني";
// ضع هنا رابط CSV المنشور لترجمة الكتالوج الثاني بالإنجليزية من Google Sheets (اختياري)
const CATALOG_2_EN_CSV_URL = "رابط_CSV_للكتالوج_الثاني_انجليزي";
const SETTINGS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3nOxONI26mhYcT5JYn4kLPK1ALccqO-eJDYet9DiQ-8n8Ya6uvh_WDXtevzAI3MozD1nv6rH_7LYo/pub?gid=2037700393&single=true&output=csv";

async function fetchCSV(url) {
  if (!url || url.includes("رابط_CSV")) return null; // تخطي إذا لم يتم وضع الرابط
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        return resolve(fetchCSV(res.headers.location));
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function setNested(obj, pathStr, value) {
  const keys = pathStr.split('.').map(k => k.trim()).filter(Boolean);
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  const cleanValue = typeof value === 'string' ? value.trim() : value;
  // Try parsing value as JSON if it looks like an array or object
  let parsedValue = cleanValue;
  try {
    if (typeof cleanValue === 'string' && (cleanValue.startsWith('[') || cleanValue.startsWith('{'))) {
      parsedValue = JSON.parse(cleanValue);
    }
  } catch (e) {}
  
  current[keys[keys.length - 1]] = parsedValue;
}

async function readJsonArray(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function isCatalog2Row(row) {
  const val = (row['الكتالوج'] ?? row['catalog'] ?? '').toString().trim().toLowerCase();
  return val === '2' || val === 'private' || val === 'خاص';
}

function mapRecordsToProducts(records, recordsEn, existingById, standardFields) {
  return records.map(row => {
    const existing = existingById.get(row.id) || {};
    const enRow = recordsEn.find(p => p.id_en === row.id || p.id === row.id) || {};
    
    const options = {};
    const options_en = {};
    const extraImages = [];
    const optionImages = {};
    const linkedOptions = {};
    
    // Process Arabic / Default Row
    for (const key of Object.keys(row)) {
      if (key.startsWith('image_') || key.startsWith('صورة_')) {
        const val = row[key] ? row[key].trim() : '';
        if (val !== '') {
          extraImages.push(val);
          const suffix = key.replace(/^(image_|صورة_)/, '').trim();
          if (isNaN(Number(suffix)) && suffix !== '') {
            optionImages[suffix] = val;
          }
        }
      } else if (!standardFields.includes(key) && key.trim() !== '') {
        const val = row[key];
        const parsedVals = val ? val.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
        if (key.endsWith('_en')) {
          options_en[key.replace('_en', '')] = parsedVals;
        } else {
          options[key] = parsedVals;
        }
      }
    }

    for (const key of Object.keys(enRow)) {
      const cleanKey = key.replace(/_en$/i, ''); // Strip _en suffix for easier matching
      const lowerKey = cleanKey.toLowerCase();
      if (lowerKey.match(/_image-?$/) || lowerKey.match(/ image-?$/) || lowerKey.startsWith('image_') || lowerKey.startsWith('صورة_')) {
        const val = enRow[key] ? enRow[key].trim() : '';
        if (val !== '') {
          // avoid duplicating images in extraImages if they already exist
          if (!extraImages.includes(val)) extraImages.push(val);
          
          let suffix = cleanKey.replace(/^(image_|صورة_)/i, '').replace(/(_image| image)-?$/i, '').trim();
          if (isNaN(Number(suffix)) && suffix !== '') {
            optionImages[suffix] = val;
          }
        }
      } else if (!standardFields.includes(cleanKey) && cleanKey !== 'id' && key.trim() !== '') {
        const val = enRow[key];
        options_en[cleanKey] = val ? val.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
      }
    }
    
    let allAdditionalImages = row.additional_images ? row.additional_images.split(',').map(s => s.trim()).filter(Boolean) : [];
    allAdditionalImages = [...allAdditionalImages, ...extraImages];
    
    // Parse Linked Options
    const rawLink = row['ربط'] || row['link'] || enRow['link'] || enRow['ربط'];
    if (rawLink) {
      const lines = rawLink.split(/[\n|]/);
      for (const line of lines) {
        // Split by comma (English or Arabic), colon, or equals sign
        const parts = line.split(/[,،=:]/);
        if (parts.length >= 2) {
          const condition = parts[0].trim();
          const result = parts[1].trim();
          if (condition && result) {
            linkedOptions[condition] = result;
          }
        }
      }
    }
    
    return {
      id: row.id,
      name: row.name,
      name_en: enRow.name_en || enRow.name || row.name_en || row.name,
      category: row.category,
      category_en: enRow.category_en || enRow.category || row.category_en || row.category,
      description: row.description,
      description_en: enRow.description_en || enRow.description || row.description_en || row.description,
      base_price: row.base_price || "",
      main_image: row.main_image,
      model_3d: row.model_3d || undefined,
      additional_images: allAdditionalImages,
      options: options,
      options_en: Object.keys(options_en).length > 0 ? options_en : options,
      option_images: optionImages,
      linked_options: linkedOptions,
      skus: row.skus ? row.skus.split(',').map(s => s.trim()).filter(Boolean) : (row.id ? [row.id] : []),
      rating: existing.rating || 5.0,
      reviews: existing.reviews || []
    };
  });
}

async function syncCatalog(csvData, csvDataEn, csvData2, csvData2En) {
  if (!csvData && !csvData2) return;

  const catalog1Path = path.join(__dirname, '../src/data/catalog.json');
  const catalog2Path = path.join(__dirname, '../src/data/catalog2.json');

  // نقوم بتحميل الملفات الحالية للحفاظ على التقييمات (Reviews)
  const existingCatalog1 = await readJsonArray(catalog1Path);
  const existingCatalog2 = await readJsonArray(catalog2Path);
  const existingById = new Map();
  for (const item of [...existingCatalog1, ...existingCatalog2]) {
    if (item?.id) existingById.set(item.id, item);
  }

  // قراءة الإعدادات لمعرفة الأعمدة المستبعدة (ignored_columns)
  const settingsPath = path.join(__dirname, '../src/data/settings.json');
  let ignoredColumns = [];
  try {
    const settingsContent = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(settingsContent);
    if (settings.catalog && settings.catalog.ignored_columns) {
      ignoredColumns = settings.catalog.ignored_columns.split(',').map(s => s.trim()).filter(Boolean);
    }
  } catch (e) {}

  const standardFields = [
    'id', 'name', 'name_en', 'category', 'category_en',
    'description', 'description_en', 'base_price', 'main_image',
    'model_3d', 'additional_images', 'skus', 'ربط', 'link',
    'الكتالوج', 'catalog',
    ...ignoredColumns
  ];

  let mainIds = new Set();
  let routedTo2Items = [];

  if (csvData) {
    const records = parse(csvData, { columns: true, skip_empty_lines: true });
    const recordsEn = csvDataEn ? parse(csvDataEn, { columns: true, skip_empty_lines: true }) : [];

    const mainRecords = [];
    const routedTo2Records = [];

    for (const row of records) {
      if (isCatalog2Row(row)) {
        routedTo2Records.push(row);
      } else {
        mainRecords.push(row);
        if (row.id) mainIds.add(row.id);
      }
    }

    const catalog1 = mapRecordsToProducts(mainRecords, recordsEn, existingById, standardFields);
    await fs.writeFile(catalog1Path, JSON.stringify(catalog1, null, 2));
    console.log('✅ تم تحديث catalog.json بنجاح!');

    routedTo2Items = mapRecordsToProducts(routedTo2Records, recordsEn, existingById, standardFields);
  }

  // مزامنة الكتالوج الثاني (إما من تبويب Google Sheets الثاني أو من عمود الكتالوج)
  if (csvData2) {
    const records2 = parse(csvData2, { columns: true, skip_empty_lines: true });
    const records2En = csvData2En ? parse(csvData2En, { columns: true, skip_empty_lines: true }) : [];
    const tab2Items = mapRecordsToProducts(records2, records2En, existingById, standardFields);

    const combinedMap = new Map();
    for (const item of [...tab2Items, ...routedTo2Items]) {
      if (item?.id) combinedMap.set(item.id, item);
    }
    const catalog2 = Array.from(combinedMap.values());
    await fs.writeFile(catalog2Path, JSON.stringify(catalog2, null, 2));
    console.log('✅ تم تحديث catalog2.json بنجاح!');
  } else if (routedTo2Items.length > 0) {
    const routedIds = new Set(routedTo2Items.map(p => p.id).filter(Boolean));
    const preservedExisting2 = existingCatalog2.filter(
      p => p?.id && !mainIds.has(p.id) && !routedIds.has(p.id)
    );
    const catalog2 = [...preservedExisting2, ...routedTo2Items];
    await fs.writeFile(catalog2Path, JSON.stringify(catalog2, null, 2));
    console.log('✅ تم تحديث catalog2.json بنجاح (توجيه من عمود الكتالوج مع الحفاظ على المنتجات الحالية)!');
  } else {
    console.log('⚠️ تم تخطي سحب الكتالوج الثاني (لم يتم وضع رابط CATALOG_2_CSV_URL)، وتم الحفاظ على catalog2.json الحالي.');
  }
}

async function syncSettings(csvData) {
  if (!csvData) return;
  const records = parse(csvData, { columns: true, skip_empty_lines: true });
  
  const settings = {};
  records.forEach(row => {
    if (row.key && row.value !== undefined) {
      setNested(settings, row.key, row.value);
    }
  });

  const settingsPath = path.join(__dirname, '../src/data/settings.json');
  
  // لو فيه إعدادات مفقودة في الشيت، ندمجها مع الموجود عشان ما يخرب الموقع
  let existingSettings = {};
  try {
    existingSettings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
  } catch (e) {}

  const merged = { ...existingSettings, ...settings };
  
  await fs.writeFile(settingsPath, JSON.stringify(merged, null, 2));
  console.log('✅ تم تحديث settings.json بنجاح!');
}

async function main() {
  console.log('🔄 جاري سحب البيانات من Google Sheets...');
  
  try {
    const dataDir = path.join(__dirname, '../src/data');
    await fs.mkdir(dataDir, { recursive: true });

    const settingsCsv = await fetchCSV(SETTINGS_CSV_URL);
    if (settingsCsv) {
      await syncSettings(settingsCsv);
    } else {
      console.log('⚠️ تم تخطي الإعدادات، يرجى وضع رابط SETTINGS_CSV_URL في السكريبت.');
    }

    const catalogCsv = await fetchCSV(CATALOG_CSV_URL);
    const catalogEnCsv = await fetchCSV(CATALOG_EN_CSV_URL);
    const catalog2Csv = await fetchCSV(CATALOG_2_CSV_URL);
    const catalog2EnCsv = await fetchCSV(CATALOG_2_EN_CSV_URL);

    if (catalogCsv || catalog2Csv) {
      await syncCatalog(catalogCsv, catalogEnCsv, catalog2Csv, catalog2EnCsv);
    } else {
      console.log('⚠️ تم تخطي الكتالوج، يرجى وضع رابط CATALOG_CSV_URL في السكريبت.');
    }
    
    console.log('🎉 اكتمل التحديث!');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء السحب:', error.message);
  }
}

main();
