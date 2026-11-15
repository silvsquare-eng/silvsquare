// ============================================================
// SilvSquare Field Reps & Radar App
// ============================================================

const SETTINGS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3nOxONI26mhYcT5JYn4kLPK1ALccqO-eJDYet9DiQ-8n8Ya6uvh_WDXtevzAI3MozD1nv6rH_7LYo/pub?gid=2037700393&single=true&output=csv';

const DEFAULT_REPS = [
  { id: 'aljabri', name: 'الجابري', region: 'خميس مشيط وأبها', city: 'خميس مشيط', phone: '966564779087', role: 'مندوب عسير', isManager: false, defaultDistrict: 'خميس مشيط - وسط المدينة', useEasternBase: false },
  { id: 'omar', name: 'عمر', region: 'الخبر والشرقية', city: 'الخبر', phone: '966599297877', role: 'مندوب الشرقية', isManager: false, defaultDistrict: 'الخبر - العزيزية', useEasternBase: true },
  { id: 'busultan', name: 'بو سلطان', region: 'الخبر والشرقية', city: 'الخبر', phone: '966548008247', role: 'مندوب الشرقية', isManager: false, defaultDistrict: 'الخبر - العليا', useEasternBase: true },
  { id: 'buamer', name: 'بو عامر', region: 'الخبر والشرقية', city: 'الخبر', phone: '966546101912', role: 'مندوب الشرقية', isManager: false, defaultDistrict: 'الخبر - العقربية', useEasternBase: true },
  { id: 'buabdullah', name: 'بو عبدالله', region: 'الخبر والشرقية', city: 'الخبر', phone: '966542966582', role: 'مندوب الشرقية', isManager: false, defaultDistrict: 'الخبر - الراكة', useEasternBase: true },
  { id: 'bumohamed', name: 'بو محمد (الإدارة)', region: 'جميع المناطق', city: 'الخبر', phone: '966546602454', role: 'إدارة المبيعات', isManager: true, defaultDistrict: 'الخبر - العزيزية', useEasternBase: true }
];

let REPS = [...DEFAULT_REPS];
let MANAGER_PIN = '2026';
let SYNC_WEBHOOK_URL = localStorage.getItem('SS_CAFE_WEBHOOK_URL') || '';
let pendingManagerRepId = null;

const DISTRICT_COORDS = {
  // خميس مشيط وأبها
  'خميس مشيط - وسط المدينة': { lat: 18.3000, lng: 42.7333, city: 'خميس مشيط', label: 'وسط خميس مشيط' },
  'خميس مشيط - حي الراقي': { lat: 18.3210, lng: 42.7520, city: 'خميس مشيط', label: 'حي الراقي، خميس مشيط' },
  'خميس مشيط - حي شباعة': { lat: 18.3095, lng: 42.7160, city: 'خميس مشيط', label: 'حي شباعة، خميس مشيط' },
  'خميس مشيط - حي حسام': { lat: 18.3160, lng: 42.7390, city: 'خميس مشيط', label: 'حي حسام، خميس مشيط' },
  'خميس مشيط - طريق الملك فهد': { lat: 18.2950, lng: 42.7280, city: 'خميس مشيط', label: 'طريق الملك فهد، خميس مشيط' },
  'خميس مشيط - الخالدية': { lat: 18.2890, lng: 42.7410, city: 'خميس مشيط', label: 'حي الخالدية، خميس مشيط' },
  'أبها - المحالة': { lat: 18.2680, lng: 42.6080, city: 'أبها', label: 'المحالة، أبها' },
  'أبها - المنسك': { lat: 18.2110, lng: 42.5480, city: 'أبها', label: 'حي المنسك، أبها' },
  'أبها - أبها الجديدة': { lat: 18.2130, lng: 42.4870, city: 'أبها', label: 'أبها الجديدة' },
  // الخبر والشرقية
  'الخبر - العزيزية': { lat: 26.1550, lng: 50.1850, city: 'الخبر', label: 'حي العزيزية، الخبر' },
  'الخبر - العليا': { lat: 26.2975, lng: 50.2010, city: 'الخبر', label: 'حي العليا، الخبر' },
  'الخبر - العقربية': { lat: 26.3120, lng: 50.2050, city: 'الخبر', label: 'حي العقربية، الخبر' },
  'الخبر - الكورنيش': { lat: 26.2990, lng: 50.2250, city: 'الخبر', label: 'الكورنيش، الخبر' },
  'الخبر - الراكة': { lat: 26.3750, lng: 50.1980, city: 'الخبر', label: 'حي الراكة، الخبر' },
  'الخبر - الحزام الذهبي': { lat: 26.3050, lng: 50.2120, city: 'الخبر', label: 'الحزام الذهبي، الخبر' },
  'الظهران - الدوحة': { lat: 26.3250, lng: 50.1350, city: 'الظهران', label: 'حي الدوحة، الظهران' },
  'الدمام - الشاطئ': { lat: 26.4530, lng: 50.1180, city: 'الدمام', label: 'حي الشاطئ، الدمام' }
};

const FALLBACK_POIS = [
  { name: 'بارنز كافيه', category: 'كافيه', city: 'خميس مشيط', area: 'طريق الملك فهد', lat: 18.2965, lng: 42.7295 },
  { name: 'هاف مليون', category: 'كافيه', city: 'خميس مشيط', area: 'حي الراقي', lat: 18.3205, lng: 42.7505 },
  { name: 'عنوان القهوة', category: 'كافيه', city: 'خميس مشيط', area: 'وسط المدينة', lat: 18.3012, lng: 42.7341 },
  { name: 'دوز كافيه', category: 'كافيه', city: 'خميس مشيط', area: 'حي حسام', lat: 18.3150, lng: 42.7380 },
  { name: 'مخبز وحلويات الريف', category: 'مخبز وحلويات', city: 'خميس مشيط', area: 'حي شباعة', lat: 18.3088, lng: 42.7175 },
  { name: 'محمصة رشفة عسير', category: 'كافيه', city: 'أبها', area: 'المحالة', lat: 18.2675, lng: 42.6095 },
  { name: 'كافيه إطلالة أبها', category: 'كافيه', city: 'أبها', area: 'أبها الجديدة', lat: 18.2135, lng: 42.4882 },
  { name: 'هاف مليون (العزيزية)', category: 'كافيه', city: 'الخبر', area: 'العزيزية', lat: 26.1580, lng: 50.1870 },
  { name: 'بارنز كافيه (العزيزية)', category: 'كافيه', city: 'الخبر', area: 'العزيزية', lat: 26.1560, lng: 50.1890 },
  { name: 'سبيشالتي هب كافيه', category: 'كافيه', city: 'الخبر', area: 'العليا', lat: 26.2950, lng: 50.2000 }
];

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

let activeRep = null;
let easternBaseProjects = [];
let cloudManagerVisits = [];
let showEasternArchive = false;
let currentLeadFilter = 'all';
let lastRadarResults = [];

// ============================================================
// Initialization & Google Sheet Reps Sync
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([syncRepsFromGoogleSheet(), loadBaseProjects()]);
  renderRepGate();
  flushSyncQueue();

  const urlParams = new URLSearchParams(window.location.search);
  const urlRep = (urlParams.get('rep') || '').trim().toLowerCase();
  const savedRep = (localStorage.getItem('SS_ACTIVE_REP') || '').trim().toLowerCase();
  const targetRepId = urlRep || savedRep;

  if (targetRepId && REPS.some(r => r.id === targetRepId)) {
    selectRep(targetRepId, false);
  } else {
    openRepSwitcher();
  }
});

async function syncRepsFromGoogleSheet() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(SETTINGS_CSV_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return;

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/);
    const map = new Map(DEFAULT_REPS.map(r => [r.id.toLowerCase(), { ...r }]));

    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const parts = parseCsvLine(line);
      const key = (parts[0] || '').trim();
      const val = (parts[1] || '').trim();
      if (!key || !val) continue;

      if (key === 'cafe.manager_pin') {
        MANAGER_PIN = val;
      } else if (key === 'cafe.webhook_url' && !localStorage.getItem('SS_CAFE_WEBHOOK_URL')) {
        SYNC_WEBHOOK_URL = val;
      } else if (key.startsWith('reps.')) {
        const repId = key.slice(5).trim().toLowerCase();
        if (!repId || repId.includes('.')) continue;
        if (map.has(repId)) {
          map.get(repId).phone = val;
        } else {
          map.set(repId, {
            id: repId,
            name: repId,
            region: 'مندوب مبيعات',
            city: 'السعودية',
            phone: val,
            role: 'مندوب مبيعات',
            isManager: false,
            defaultDistrict: 'gps',
            useEasternBase: false
          });
        }
      }
    }

    REPS = Array.from(map.values());
  } catch {
    // Fallback silently to DEFAULT_REPS
  }
}

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

async function loadBaseProjects() {
  try {
    const res = await fetch('/field/data/projects.json');
    if (res.ok) easternBaseProjects = await res.json();
  } catch (e) {
    console.warn('Could not load base projects JSON:', e);
  }
}

function renderRepGate() {
  const grid = document.getElementById('rep-grid');
  grid.innerHTML = REPS.map(rep => `
    <button class="rep-card" onclick="selectRep('${rep.id}', true)">
      <div class="rep-title">
        <span>${escapeHtml(rep.name)} ${rep.isManager ? '🔒' : ''}</span>
        <i class="fa-solid fa-arrow-left" style="font-size:0.85rem; color:var(--accent);"></i>
      </div>
      <div class="rep-region">${escapeHtml(rep.region)}</div>
      <div class="rep-role">${escapeHtml(rep.role)}</div>
    </button>
  `).join('');
}

function openRepSwitcher() {
  document.getElementById('rep-gate').style.display = 'flex';
  document.getElementById('app-main').style.display = 'none';
  document.getElementById('desktop-nav').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  document.getElementById('header-actions').style.display = 'none';
  document.getElementById('header-rep-label').textContent = 'اختر المندوب';
}

function selectRep(repId, updateUrl = true) {
  const rep = REPS.find(r => r.id === repId);
  if (!rep) return;

  // Manager PIN gate
  if (rep.isManager && sessionStorage.getItem('SS_MANAGER_UNLOCKED') !== '1') {
    pendingManagerRepId = rep.id;
    document.getElementById('manager-pin-input').value = '';
    document.getElementById('pin-modal').classList.add('open');
    setTimeout(() => document.getElementById('manager-pin-input').focus(), 100);
    return;
  }

  activeRep = rep;
  localStorage.setItem('SS_ACTIVE_REP', rep.id);

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('rep', rep.id);
    window.history.replaceState({}, '', url.toString());
  }

  document.getElementById('rep-gate').style.display = 'none';
  document.getElementById('app-main').style.display = 'block';
  document.getElementById('desktop-nav').style.display = '';
  document.getElementById('bottom-nav').style.display = '';
  document.getElementById('header-actions').style.display = 'flex';

  document.getElementById('header-rep-label').textContent = `${rep.name} • ${rep.region}`;
  document.getElementById('header-catalog-link').href = `https://catalog.silvsquare.com/catalog?rep=${encodeURIComponent(rep.id)}`;
  document.getElementById('radar-region-badge').textContent = rep.region;

  const districtSelect = document.getElementById('radar-district');
  if (districtSelect && rep.defaultDistrict) {
    districtSelect.value = rep.defaultDistrict;
  }

  showEasternArchive = rep.useEasternBase;
  const archiveBtn = document.getElementById('toggle-archive-btn');
  archiveBtn.style.display = rep.useEasternBase ? 'none' : 'inline-flex';
  updateArchiveBtnLabel();

  const repFilter = document.getElementById('leads-rep-filter');
  const managerPanel = document.getElementById('manager-sync-panel');
  if (rep.isManager) {
    repFilter.style.display = 'block';
    repFilter.innerHTML = `<option value="all">كل المناديب</option>` +
      REPS.filter(r => !r.isManager).map(r => `<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)} (${escapeHtml(r.region)})</option>`).join('');
    managerPanel.style.display = 'block';
    document.getElementById('webhook-url-input').value = SYNC_WEBHOOK_URL;
    if (SYNC_WEBHOOK_URL) pullManagerCloudVisits();
  } else {
    repFilter.style.display = 'none';
    repFilter.value = 'all';
    managerPanel.style.display = 'none';
  }

  document.getElementById('direct-rep-url').value =
    `${window.location.origin}${window.location.pathname}?rep=${encodeURIComponent(rep.id)}`;

  document.getElementById('radar-results-wrap').style.display = 'none';
  document.getElementById('radar-error').style.display = 'none';

  renderLeads();
  renderStats();
  switchView('radar');
}

function closePinModal() {
  document.getElementById('pin-modal').classList.remove('open');
  pendingManagerRepId = null;
}

function submitManagerPin(e) {
  e.preventDefault();
  const entered = document.getElementById('manager-pin-input').value.trim();
  if (entered === String(MANAGER_PIN)) {
    sessionStorage.setItem('SS_MANAGER_UNLOCKED', '1');
    const target = pendingManagerRepId || 'bumohamed';
    closePinModal();
    selectRep(target, true);
  } else {
    showToast('رمز PIN غير صحيح');
  }
}

function updateArchiveBtnLabel() {
  const btn = document.getElementById('toggle-archive-btn');
  if (!btn) return;
  btn.innerHTML = showEasternArchive
    ? '<i class="fa-solid fa-eye-slash"></i> إخفاء أرشيف الشرقية'
    : '<i class="fa-solid fa-database"></i> أرشيف الشرقية (496)';
}

function toggleKhobarArchive() {
  showEasternArchive = !showEasternArchive;
  updateArchiveBtnLabel();
  renderLeads();
}

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`view-${viewName}`).classList.add('active');
  document.querySelectorAll('.nav-tab, .bnav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  if (viewName === 'stats') renderStats();
  if (viewName === 'leads') renderLeads();
}

// ============================================================
// Per-Rep Isolated Storage & Cloud Sync
// ============================================================

function getCustomLeadsKey() { return `SS_REP_LEADS_${activeRep.id}`; }
function getVisitsOverrideKey() { return `SS_REP_VISITS_${activeRep.id}`; }

function getRepCustomLeads() {
  try { return JSON.parse(localStorage.getItem(getCustomLeadsKey()) || '[]'); } catch { return []; }
}
function saveRepCustomLeads(list) {
  localStorage.setItem(getCustomLeadsKey(), JSON.stringify(list));
}
function getRepVisitOverrides() {
  try { return JSON.parse(localStorage.getItem(getVisitsOverrideKey()) || '{}'); } catch { return {}; }
}
function saveRepVisitOverrides(map) {
  localStorage.setItem(getVisitsOverrideKey(), JSON.stringify(map));
}

function getVisibleProjects() {
  const custom = getRepCustomLeads();
  const overrides = getRepVisitOverrides();

  let base = [];
  if (showEasternArchive) {
    base = easternBaseProjects.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category || 'كافيه',
      area: p.area || '',
      address: p.address || '',
      phone: p.phone || '',
      lat: p.lat,
      lng: p.lng,
      maps_url: p.maps_url || buildMapsUrl(p.name, p.lat, p.lng),
      isVisited: Boolean(p.isVisited),
      visitedBy: p.visitedBy || '',
      visitStatus: p.visitStatus || (p.isVisited ? 'completed' : ''),
      visitNotes: p.visitNotes || '',
      visitDate: p.visitDate || '',
      source: 'archive'
    }));
  }

  const extraCloud = activeRep.isManager ? cloudManagerVisits : [];
  const mergedMap = new Map();
  for (const item of [...base, ...extraCloud, ...custom]) {
    const ov = overrides[item.id];
    mergedMap.set(item.id, ov ? { ...item, ...ov } : item);
  }
  return Array.from(mergedMap.values());
}

function saveWebhookUrl() {
  const url = document.getElementById('webhook-url-input').value.trim();
  SYNC_WEBHOOK_URL = url;
  localStorage.setItem('SS_CAFE_WEBHOOK_URL', url);
  showToast(url ? 'تم حفظ رابط المزامنة' : 'تم مسح رابط المزامنة');
  if (url) pullManagerCloudVisits();
}

async function sendVisitToCloud(payload) {
  if (!SYNC_WEBHOOK_URL) return;
  try {
    await fetch(SYNC_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    const queue = JSON.parse(localStorage.getItem('SS_SYNC_QUEUE') || '[]');
    queue.push(payload);
    localStorage.setItem('SS_SYNC_QUEUE', JSON.stringify(queue));
  }
}

async function flushSyncQueue() {
  if (!SYNC_WEBHOOK_URL) return;
  const queue = JSON.parse(localStorage.getItem('SS_SYNC_QUEUE') || '[]');
  if (!queue.length) return;
  const remaining = [];
  for (const item of queue) {
    try {
      await fetch(SYNC_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch {
      remaining.push(item);
    }
  }
  localStorage.setItem('SS_SYNC_QUEUE', JSON.stringify(remaining));
}

async function pullManagerCloudVisits() {
  if (!SYNC_WEBHOOK_URL) {
    showToast('أضف رابط Google Apps Script أولاً');
    return;
  }
  try {
    const res = await fetch(SYNC_WEBHOOK_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.ok && Array.isArray(data.visits)) {
      cloudManagerVisits = data.visits.map((v, i) => ({
        id: v.id || `CLOUD-${i}`,
        name: v.name || 'عميل',
        category: v.category || 'كافيه',
        area: v.area || '',
        address: v.area || '',
        phone: v.phone || '',
        lat: v.lat ? Number(v.lat) : undefined,
        lng: v.lng ? Number(v.lng) : undefined,
        isVisited: true,
        visitedBy: v.visitedBy || v.repName || v.repId || '',
        visitStatus: v.visitStatus || 'completed',
        visitNotes: v.visitNotes || '',
        visitDate: v.visitDate || ''
      }));
      renderLeads();
      renderStats();
      showToast(`تم تحديث ${cloudManagerVisits.length} زيارة من قوقل شيت`);
    }
  } catch {
    showToast('تعذر جلب البيانات من قوقل شيت');
  }
}

// ============================================================
// Radar & Google Maps Fallback Search
// ============================================================

async function openGoogleMapsSearch() {
  const selection = document.getElementById('radar-district').value;
  try {
    let lat, lng;
    if (selection === 'gps') {
      const pos = await getCurrentPositionPromise();
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } else {
      const preset = DISTRICT_COORDS[selection];
      lat = preset.lat;
      lng = preset.lng;
    }
    window.open(`https://www.google.com/maps/search/كافيهات+ومطاعم/@${lat},${lng},15z`, '_blank', 'noopener');
  } catch (err) {
    showToast(err.message || 'اختر الحي لفتح خرائط قوقل');
  }
}

async function startRadarScan() {
  const selection = document.getElementById('radar-district').value;
  const radius = parseInt(document.getElementById('radar-radius').value, 10) || 3000;
  const incCafe = document.getElementById('chk-cafe').checked;
  const incFood = document.getElementById('chk-food').checked;
  const incBakery = document.getElementById('chk-bakery').checked;

  if (!incCafe && !incFood && !incBakery) {
    showToast('اختر نشاطاً واحداً على الأقل للمسح');
    return;
  }

  const loadingEl = document.getElementById('radar-loading');
  const loadingText = document.getElementById('radar-loading-text');
  const errorEl = document.getElementById('radar-error');
  const resultsWrap = document.getElementById('radar-results-wrap');
  const scanBtn = document.getElementById('radar-scan-btn');

  errorEl.style.display = 'none';
  resultsWrap.style.display = 'none';
  loadingEl.style.display = 'block';
  scanBtn.disabled = true;

  try {
    let lat, lng, areaLabel, cityLabel;

    if (selection === 'gps') {
      loadingText.textContent = 'جاري تحديد موقعك الحالي بدقة (GPS)...';
      const pos = await getCurrentPositionPromise();
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      loadingText.textContent = 'تم تحديد الموقع، جاري التعرف على الحي والبحث عن المحلات...';
      const geo = await reverseGeocode(lat, lng);
      cityLabel = geo.city || activeRep.city || 'موقعك';
      areaLabel = geo.label || 'موقعي الحالي (GPS)';
    } else {
      const preset = DISTRICT_COORDS[selection];
      if (!preset) throw new Error('المنطقة المختارة غير معروفة');
      lat = preset.lat;
      lng = preset.lng;
      cityLabel = preset.city;
      areaLabel = preset.label;
    }

    loadingText.textContent = `جاري مسح ${areaLabel} (نطاق ${(radius / 1000).toFixed(1)} كم)...`;
    const places = await queryRadarPlaces(lat, lng, radius, cityLabel, areaLabel, incCafe, incFood, incBakery);

    lastRadarResults = places;
    renderRadarResults(places, areaLabel);
  } catch (err) {
    errorEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(err.message || 'تعذر إتمام المسح')}`;
    errorEl.style.display = 'block';
  } finally {
    loadingEl.style.display = 'none';
    scanBtn.disabled = false;
  }
}

function getCurrentPositionPromise() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('المتصفح لا يدعم تحديد الموقع (GPS). اختر الحي يدوياً من القائمة.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => {
        if (err.code === 1) {
          reject(new Error('تم رفض صلاحية الموقع. فعّل GPS للمتصفح أو اختر الحي يدوياً من القائمة.'));
        } else {
          reject(new Error('تعذر التقاط إشارة GPS حالياً. اختر الحي يدوياً من القائمة أعلاه.'));
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
}

async function reverseGeocode(lat, lng) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return {};
    const data = await res.json();
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.state || addr.county || '';
    const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.road || '';
    const label = [suburb, city].filter(Boolean).join('، ') || data.display_name || '';
    return { city, label };
  } catch {
    return {};
  }
}

async function queryRadarPlaces(lat, lng, radius, cityLabel, areaLabel, incCafe, incFood, incBakery) {
  const existingNames = new Set(getVisibleProjects().map(p => normalizeName(p.name)));
  const clauses = [];

  if (incCafe) {
    clauses.push(`node["amenity"="cafe"](around:${radius},${lat},${lng});`);
    clauses.push(`way["amenity"="cafe"](around:${radius},${lat},${lng});`);
    clauses.push(`node["shop"="coffee"](around:${radius},${lat},${lng});`);
  }
  if (incFood) {
    clauses.push(`node["amenity"~"restaurant|fast_food"](around:${radius},${lat},${lng});`);
    clauses.push(`way["amenity"~"restaurant|fast_food"](around:${radius},${lat},${lng});`);
  }
  if (incBakery) {
    clauses.push(`node["shop"~"bakery|pastry|confectionery"](around:${radius},${lat},${lng});`);
    clauses.push(`way["shop"~"bakery|pastry|confectionery"](around:${radius},${lat},${lng});`);
  }

  const query = `[out:json][timeout:12];(${clauses.join('')});out center 60;`;
  let elements = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 11000);
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.elements)) {
          elements = json.elements;
          break;
        }
      }
    } catch {
      // Try next mirror
    }
  }

  const found = [];
  const seen = new Set(existingNames);

  if (elements) {
    for (const el of elements) {
      const tags = el.tags || {};
      const name = (tags['name:ar'] || tags.name || tags['name:en'] || '').trim();
      if (!name) continue;
      const norm = normalizeName(name);
      if (seen.has(norm)) continue;

      const pLat = el.lat || (el.center && el.center.lat);
      const pLng = el.lon || (el.center && el.center.lon);
      if (!pLat || !pLng) continue;

      let category = 'كافيه';
      if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') category = 'مطعم';
      if (tags.shop && /bakery|pastry|confectionery/.test(tags.shop)) category = 'مخبز وحلويات';

      const street = tags['addr:street'] || tags['addr:suburb'] || '';
      const address = street ? `${street}، ${cityLabel}` : areaLabel;
      const phone = normalizePhone(tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '');
      const distKm = haversineKm(lat, lng, pLat, pLng);

      seen.add(norm);
      found.push({
        id: `RADAR-${Date.now()}-${found.length}`,
        name,
        category,
        area: areaLabel,
        address,
        phone,
        lat: pLat,
        lng: pLng,
        distKm,
        maps_url: buildMapsUrl(name, pLat, pLng)
      });
    }
  } else {
    document.getElementById('radar-error').innerHTML =
      '<i class="fa-solid fa-wifi"></i> تعذر الاتصال بخادم الخرائط المباشر، تم عرض القائمة الاحتياطية القريبة.';
    document.getElementById('radar-error').style.display = 'block';

    for (const item of FALLBACK_POIS) {
      const distKm = haversineKm(lat, lng, item.lat, item.lng);
      if (distKm * 1000 <= Math.max(radius, 8000) && !seen.has(normalizeName(item.name))) {
        seen.add(normalizeName(item.name));
        found.push({
          id: `RADAR-FB-${found.length}`,
          name: item.name,
          category: item.category,
          area: `${item.area}، ${item.city}`,
          address: `${item.area}، ${item.city}`,
          phone: '',
          lat: item.lat,
          lng: item.lng,
          distKm,
          maps_url: buildMapsUrl(item.name, item.lat, item.lng)
        });
      }
    }
  }

  found.sort((a, b) => a.distKm - b.distKm);
  return found;
}

function renderRadarResults(places, areaLabel) {
  const wrap = document.getElementById('radar-results-wrap');
  const grid = document.getElementById('radar-results-grid');
  document.getElementById('radar-count').textContent = places.length;
  document.getElementById('radar-area-label').textContent = areaLabel;

  if (places.length === 0) {
    grid.innerHTML = `<div class="panel" style="grid-column:1/-1; text-align:center; color:var(--muted);">
      ما تم العثور على محلات جديدة غير مسجلة ضمن هذا النطاق. جرّب تكبير النطاق أو اضغط <strong>بحث في خرائط قوقل</strong>.
    </div>`;
  } else {
    grid.innerHTML = places.map((p, idx) => `
      <article class="lead-card">
        <div>
          <div class="lead-top">
            <div>
              <div class="lead-name">${escapeHtml(p.name)}</div>
              <div class="lead-meta">
                <span><i class="fa-solid fa-tag"></i> ${escapeHtml(p.category)}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.address)}</span>
              </div>
            </div>
            <span class="badge badge-dist">${formatDistance(p.distKm)}</span>
          </div>
        </div>
        <div class="lead-actions">
          <a href="${p.maps_url}" target="_blank" rel="noopener" class="act-btn">
            <i class="fa-solid fa-diamond-turn-right"></i> خرائط قوقل
          </a>
          ${p.phone ? `<a href="tel:${p.phone}" class="act-btn"><i class="fa-solid fa-phone"></i> اتصال</a>` : ''}
          <button class="act-btn visit" onclick="addSingleRadarLead(${idx})">
            <i class="fa-solid fa-plus"></i> حفظ لعملائي
          </button>
        </div>
      </article>
    `).join('');
  }

  wrap.style.display = 'block';
}

function addSingleRadarLead(idx) {
  const item = lastRadarResults[idx];
  if (!item) return;
  const list = getRepCustomLeads();
  if (list.some(l => normalizeName(l.name) === normalizeName(item.name))) {
    showToast('المحل محفوظ مسبقاً في قائمتك');
    return;
  }
  list.unshift({ ...item, isVisited: false, visitedBy: '', visitStatus: '', visitNotes: '', visitDate: '' });
  saveRepCustomLeads(list);
  renderLeads();
  showToast(`تم حفظ "${item.name}" في قائمتك`);
}

function addAllRadarToLeads() {
  if (!lastRadarResults.length) return;
  const list = getRepCustomLeads();
  const existing = new Set(list.map(l => normalizeName(l.name)));
  let added = 0;

  for (const item of lastRadarResults) {
    if (!existing.has(normalizeName(item.name))) {
      list.unshift({ ...item, isVisited: false, visitedBy: '', visitStatus: '', visitNotes: '', visitDate: '' });
      existing.add(normalizeName(item.name));
      added++;
    }
  }
  saveRepCustomLeads(list);
  renderLeads();
  showToast(added > 0 ? `تم حفظ ${added} محل في قائمتك` : 'كل النتائج محفوظة مسبقاً');
}

// ============================================================
// Leads, Nearest Unvisited Routing & Visits
// ============================================================

async function navigateToNearestUnvisited() {
  const unvisited = getVisibleProjects().filter(p => !p.isVisited && p.lat && p.lng);
  if (unvisited.length === 0) {
    showToast('ما فيه عملاء غير مزارين بإحداثيات حالياً — استخدم الرادار أولاً');
    return;
  }

  try {
    showToast('جاري تحديد موقعك لحساب أقرب عميل...');
    const pos = await getCurrentPositionPromise();
    const { latitude, longitude } = pos.coords;

    let nearest = unvisited[0];
    let minKm = haversineKm(latitude, longitude, Number(nearest.lat), Number(nearest.lng));

    for (const p of unvisited.slice(1)) {
      const km = haversineKm(latitude, longitude, Number(p.lat), Number(p.lng));
      if (km < minKm) {
        minKm = km;
        nearest = p;
      }
    }

    showToast(`أقرب عميل: ${nearest.name} (${formatDistance(minKm)})`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}`, '_blank', 'noopener');
  } catch (err) {
    showToast(err.message || 'تعذر تحديد GPS');
  }
}

function setLeadFilter(filter) {
  currentLeadFilter = filter;
  document.querySelectorAll('.f-pill').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  renderLeads();
}

function renderLeads() {
  if (!activeRep) return;
  const all = getVisibleProjects();
  document.getElementById('leads-count-badge').textContent = all.length;

  const q = (document.getElementById('leads-search').value || '').trim().toLowerCase();
  const repFilterVal = document.getElementById('leads-rep-filter').value || 'all';

  const filtered = all.filter(item => {
    if (currentLeadFilter === 'unvisited' && item.isVisited) return false;
    if (currentLeadFilter === 'visited' && !item.isVisited) return false;
    if (currentLeadFilter === 'revisit' && item.visitStatus !== 'revisit') return false;
    if (activeRep.isManager && repFilterVal !== 'all' && (item.visitedBy || '') !== repFilterVal) return false;

    if (q) {
      const hay = `${item.name} ${item.area} ${item.address} ${item.phone} ${item.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const grid = document.getElementById('leads-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="panel" style="grid-column:1/-1; text-align:center; color:var(--muted); padding:2rem 1rem;">
      لا توجد نتائج مطابقة. استخدم <strong>الرادار</strong> لاكتشاف محلات منطقتك أو أضف عميل جديد.
    </div>`;
    return;
  }

  grid.innerHTML = filtered.slice(0, 80).map(item => {
    const statusBadge = item.visitStatus === 'revisit'
      ? '<span class="badge badge-revisit">⏳ إعادة زيارة</span>'
      : item.isVisited
        ? '<span class="badge badge-visited">✅ تمت الزيارة</span>'
        : '<span class="badge badge-new">جديد</span>';

    const waUrl = buildWhatsAppPitchUrl(item);

    return `
      <article class="lead-card">
        <div>
          <div class="lead-top">
            <div>
              <div class="lead-name">${escapeHtml(item.name)}</div>
              <div class="lead-meta">
                <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.area || item.address)}</span>
                ${item.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHtml(item.phone)}</span>` : ''}
                ${item.visitedBy ? `<span><i class="fa-solid fa-user"></i> ${escapeHtml(item.visitedBy)}</span>` : ''}
              </div>
            </div>
            ${statusBadge}
          </div>
          ${item.visitNotes ? `<p style="font-size:0.78rem; color:#fbd38d; margin-top:0.45rem;">📝 ${escapeHtml(item.visitNotes)}</p>` : ''}
        </div>

        <div class="lead-actions">
          ${item.phone ? `<a href="tel:${escapeHtml(item.phone)}" class="act-btn"><i class="fa-solid fa-phone"></i> اتصال</a>` : ''}
          ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener" class="act-btn wa"><i class="fa-brands fa-whatsapp"></i> واتساب</a>` : ''}
          <a href="${item.maps_url || buildMapsUrl(item.name, item.lat, item.lng)}" target="_blank" rel="noopener" class="act-btn">
            <i class="fa-solid fa-map-pin"></i> الموقع
          </a>
          <button class="act-btn visit" onclick="openVisitModal('${escapeHtml(item.id)}')">
            <i class="fa-solid fa-clipboard-check"></i> زيارة
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function openVisitModal(id) {
  const item = getVisibleProjects().find(p => p.id === id);
  if (!item) return;
  document.getElementById('visit-lead-id').value = item.id;
  document.getElementById('visit-modal-title').textContent = `توثيق زيارة: ${item.name}`;
  document.getElementById('visit-status').value = item.visitStatus || 'has_phone';
  document.getElementById('visit-phone').value = item.phone || '';
  document.getElementById('visit-notes').value = item.visitNotes || '';
  document.getElementById('visit-modal').classList.add('open');
}

function closeVisitModal() {
  document.getElementById('visit-modal').classList.remove('open');
}

function saveVisit(e) {
  e.preventDefault();
  const id = document.getElementById('visit-lead-id').value;
  const item = getVisibleProjects().find(p => p.id === id) || {};
  const visitStatus = document.getElementById('visit-status').value;
  const phone = normalizePhone(document.getElementById('visit-phone').value);
  const visitNotes = document.getElementById('visit-notes').value.trim();
  const visitDate = new Date().toLocaleString('ar-SA');

  const patch = {
    isVisited: true,
    visitedBy: activeRep.name,
    visitStatus,
    phone,
    visitNotes,
    visitDate
  };

  const custom = getRepCustomLeads();
  const idx = custom.findIndex(c => c.id === id);
  if (idx !== -1) {
    custom[idx] = { ...custom[idx], ...patch };
    saveRepCustomLeads(custom);
  } else {
    const overrides = getRepVisitOverrides();
    overrides[id] = patch;
    saveRepVisitOverrides(overrides);
  }

  // Send to Google Sheet if webhook configured
  sendVisitToCloud({
    visitDate,
    repId: activeRep.id,
    repName: activeRep.name,
    leadId: id,
    leadName: item.name || '',
    category: item.category || '',
    area: item.area || item.address || '',
    phone,
    visitStatus,
    visitNotes,
    lat: item.lat || '',
    lng: item.lng || ''
  });

  closeVisitModal();
  renderLeads();
  renderStats();
  showToast('تم حفظ الزيارة بنجاح');
}

function openAddLeadModal() {
  document.getElementById('new-lead-name').value = '';
  document.getElementById('new-lead-area').value = activeRep ? `${activeRep.city} - ` : '';
  document.getElementById('new-lead-phone').value = '';
  document.getElementById('add-lead-modal').classList.add('open');
}

function closeAddLeadModal() {
  document.getElementById('add-lead-modal').classList.remove('open');
}

function saveNewLead(e) {
  e.preventDefault();
  const name = document.getElementById('new-lead-name').value.trim();
  const category = document.getElementById('new-lead-cat').value;
  const area = document.getElementById('new-lead-area').value.trim();
  const phone = normalizePhone(document.getElementById('new-lead-phone').value);
  if (!name) return;

  const list = getRepCustomLeads();
  list.unshift({
    id: `LEAD-${Date.now()}`,
    name,
    category,
    area,
    address: area,
    phone,
    maps_url: buildMapsUrl(`${name} ${area}`),
    isVisited: false,
    visitedBy: '',
    visitStatus: '',
    visitNotes: ''
  });
  saveRepCustomLeads(list);
  closeAddLeadModal();
  renderLeads();
  renderStats();
  showToast('تمت إضافة العميل لقائمتك');
}

// ============================================================
// Stats & Export
// ============================================================

function renderStats() {
  if (!activeRep) return;
  const list = getVisibleProjects();
  const total = list.length;
  const visited = list.filter(p => p.isVisited).length;
  const revisit = list.filter(p => p.visitStatus === 'revisit').length;
  const withPhone = list.filter(p => Boolean(p.phone)).length;

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-box"><div class="stat-val">${total}</div><div class="stat-lbl">إجمالي العملاء</div></div>
    <div class="stat-box"><div class="stat-val">${visited}</div><div class="stat-lbl">زيارات منجزة</div></div>
    <div class="stat-box"><div class="stat-val">${revisit}</div><div class="stat-lbl">مطلوب إعادة زيارة</div></div>
    <div class="stat-box"><div class="stat-val">${withPhone}</div><div class="stat-lbl">أرقام جوال مسجلة</div></div>
  `;
}

function exportRepCSV() {
  const list = getVisibleProjects();
  const rows = [['الاسم', 'النشاط', 'المنطقة', 'الجوال', 'الحالة', 'المندوب', 'ملاحظات']];
  for (const p of list) {
    rows.push([
      p.name,
      p.category,
      p.area || p.address,
      p.phone || '',
      p.isVisited ? (p.visitStatus || 'تمت الزيارة') : 'جديد',
      p.visitedBy || activeRep.name,
      p.visitNotes || ''
    ]);
  }
  const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `silvsquare_${activeRep.id}_leads.csv`;
  a.click();
}

function copyDirectUrl() {
  const input = document.getElementById('direct-rep-url');
  input.select();
  navigator.clipboard?.writeText(input.value);
  showToast('تم نسخ رابط المندوب المباشر');
}

// ============================================================
// Helpers
// ============================================================

function buildWhatsAppPitchUrl(item) {
  const digits = String(item.phone || '').replace(/\D/g, '');
  if (!digits) return '';
  const intl = digits.startsWith('05') ? `966${digits.slice(1)}` : (digits.startsWith('966') ? digits : digits);
  const catalogUrl = `https://catalog.silvsquare.com/catalog?rep=${encodeURIComponent(activeRep.id)}`;
  const msg = `السلام عليكم، معكم ${activeRep.name} من مصنع المربع الفضي للتعبئة والتغليف. يسعدنا تجهيز تغليف ${item.name} (أكواب، بوكسات، أكياس). هذا رابط الكاتالوج: ${catalogUrl}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
}

function buildMapsUrl(query, lat, lng) {
  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} م` : `${km.toFixed(1)} كم`;
}

function normalizeName(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizePhone(s) {
  return String(s || '').replace(/[^\d+]/g, '');
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}
