import settingsData from '../data/settings.json';

export interface SiteConfig {
  brand: any;
  links: any;
  hero: any;
  stats: any[];
  whatsappMessage: string;
  seo: any;
  catalog: any;
  ui?: Record<string, string>;
  ui_en?: Record<string, string>;
  reps?: Record<string, string>;
}

export const SITE_CONFIG = settingsData as unknown as SiteConfig;

export const SECTION_IDS = {
  hero: 'hero',
  clients: 'clients',
  services: 'services',
  packages: 'packages',
  process: 'process',
  cases: 'cases',
  stats: 'stats',
  faq: 'faq',
  cta: 'cta',
} as const;

export type SectionId = keyof typeof SECTION_IDS;

export const normalizeSaudiPhone = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.startsWith('05') && cleaned.length === 10) {
    cleaned = '966' + cleaned.substring(1);
  } else if (cleaned.startsWith('5') && cleaned.length === 9) {
    cleaned = '966' + cleaned;
  }
  return cleaned;
};

export const getRepFromUrlOrStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    let rep =
      params.get('rep') ||
      params.get('phone') ||
      params.get('wa') ||
      params.get('num') ||
      params.get('id');

    // Support bare query strings like ?busultan or ?0548008247
    if (!rep && window.location.search.length > 1) {
      for (const [key, val] of params.entries()) {
        if (!val && key.trim()) {
          rep = key.trim();
          break;
        }
      }
    }

    if (rep && rep.trim()) {
      const cleanRep = rep.trim();
      localStorage.setItem('sales_rep', cleanRep);
      return cleanRep;
    }

    return localStorage.getItem('sales_rep');
  } catch {
    return null;
  }
};

export const getRepNumber = (repId?: string | null): string => {
  const config = SITE_CONFIG as any;
  const resolvedId = (repId && repId.trim()) ? repId.trim() : getRepFromUrlOrStorage();

  if (resolvedId) {
    const lowerId = resolvedId.toLowerCase();

    // 1. Check reps map (case-insensitive & trimmed keys)
    if (config.reps && typeof config.reps === 'object') {
      for (const [key, val] of Object.entries(config.reps)) {
        if (key.trim().toLowerCase() === lowerId && typeof val === 'string' && val.trim()) {
          return normalizeSaudiPhone(val.trim());
        }
      }

      // 2. Check if resolvedId matches a rep's phone number suffix/digits
      const normalizedInput = normalizeSaudiPhone(resolvedId);
      if (normalizedInput.length >= 9) {
        for (const val of Object.values(config.reps)) {
          if (typeof val === 'string') {
            const normVal = normalizeSaudiPhone(val.trim());
            if (normVal === normalizedInput || normVal.endsWith(normalizedInput)) {
              return normVal;
            }
          }
        }
      }
    }

    // 3. If the URL parameter itself is a valid phone number, use it directly
    const digitsOnly = resolvedId.replace(/\D/g, '');
    if (digitsOnly.length >= 9 && digitsOnly.length <= 15) {
      return normalizeSaudiPhone(resolvedId);
    }
  }

  return normalizeSaudiPhone(config.links?.whatsapp || '966542966582');
};

export const formatDisplayPhone = (whatsappNumber?: string): string => {
  const num = whatsappNumber || getRepNumber();
  if (num.startsWith('966') && num.length === 12) {
    return '0' + num.substring(3);
  }
  return num || SITE_CONFIG.links?.phone || '';
};
