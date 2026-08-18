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

export const getRepNumber = (repId?: string | null) => {
  const config = SITE_CONFIG as any;
  if (repId && config.reps && config.reps[repId]) {
    return config.reps[repId];
  }
  return config.links?.whatsapp || '';
};
