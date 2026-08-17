import settingsData from '../data/settings.json';

export const SITE_CONFIG = settingsData;

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
