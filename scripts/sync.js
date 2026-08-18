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
const SETTINGS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3nOxONI26mhYcT5JYn4kLPK1ALccqO-eJDYet9DiQ-8n8Ya6uvh_WDXtevzAI3MozD1nv6rH_7LYo/pub?gid=2037700393&single=true&output=csv";

async function fetchCSV(url) {
  if (url.includes("رابط_CSV")) return null; // تخطي إذا لم يتم وضع الرابط
  
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
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  // Try parsing value as JSON if it looks like an array or object
  let parsedValue = value;
  try {
    if (value.startsWith('[') || value.startsWith('{')) {
      parsedValue = JSON.parse(value);
    }
  } catch (e) {}
  
  current[keys[keys.length - 1]] = parsedValue;
}

async function syncCatalog(csvData, csvDataEn) {
  if (!csvData) return;
  const records = parse(csvData, { columns: true, skip_empty_lines: true });
  const recordsEn = csvDataEn ? parse(csvDataEn, { columns: true, skip_empty_lines: true }) : [];
  
  // نقوم بتحميل الملف الحالي للحفاظ على التقييمات (Reviews)
  const existingPath = path.join(__dirname, '../src/data/catalog.json');
  let existingCatalog = [];
  try {
    const existingContent = await fs.readFile(existingPath, 'utf8');
    existingCatalog = JSON.parse(existingContent);
  } catch (e) {}

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

  const standardFields = ['id', 'name', 'name_en', 'category', 'category_en', 'description', 'description_en', 'base_price', 'main_image', 'model_3d', 'additional_images', 'skus', ...ignoredColumns];
  
  const catalog = records.map(row => {
    const existing = existingCatalog.find(p => p.id === row.id) || {};
    const enRow = recordsEn.find(p => p.id === row.id) || {};
    
    const options = {};
    const options_en = {};
    const extraImages = [];
    const optionImages = {};
    
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

    // Process English Row Options (Overrides any _en columns in Arabic sheet)
    for (const key of Object.keys(enRow)) {
      if (key.toLowerCase().endsWith(' image') || key.startsWith('image_') || key.startsWith('صورة_')) {
        const val = enRow[key] ? enRow[key].trim() : '';
        if (val !== '') {
          // avoid duplicating images in extraImages if they already exist
          if (!extraImages.includes(val)) extraImages.push(val);
          
          let suffix = key.replace(/^(image_|صورة_)/, '').replace(/ image$/i, '').trim();
          if (isNaN(Number(suffix)) && suffix !== '') {
            optionImages[suffix] = val;
          }
        }
      } else if (!standardFields.includes(key) && key.trim() !== '') {
        const val = enRow[key];
        options_en[key] = val ? val.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
      }
    }
    
    let allAdditionalImages = row.additional_images ? row.additional_images.split(',').map(s => s.trim()).filter(Boolean) : [];
    allAdditionalImages = [...allAdditionalImages, ...extraImages];
    
    return {
      id: row.id,
      name: row.name,
      name_en: enRow.name || row.name_en || row.name,
      category: row.category,
      category_en: enRow.category || row.category_en || row.category,
      description: row.description,
      description_en: enRow.description || row.description_en || row.description,
      base_price: row.base_price || "",
      main_image: row.main_image,
      model_3d: row.model_3d || undefined,
      additional_images: allAdditionalImages,
      options: options,
      options_en: Object.keys(options_en).length > 0 ? options_en : options,
      option_images: optionImages,
      skus: row.skus ? row.skus.split(',').map(s => s.trim()).filter(Boolean) : (row.id ? [row.id] : []),
      rating: existing.rating || 5.0,
      reviews: existing.reviews || []
    };
  });

  await fs.writeFile(existingPath, JSON.stringify(catalog, null, 2));
  console.log('✅ تم تحديث catalog.json بنجاح!');
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
    if (catalogCsv) {
      await syncCatalog(catalogCsv, catalogEnCsv);
    } else {
      console.log('⚠️ تم تخطي الكتالوج، يرجى وضع رابط CATALOG_CSV_URL في السكريبت.');
    }
    
    console.log('🎉 اكتمل التحديث!');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء السحب:', error.message);
  }
}

main();
