import { HeroSection } from '@/sections/HeroSection';
import { TargetClientsSection } from '@/sections/TargetClientsSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { PackagesSection } from '@/sections/PackagesSection';
import { ProcessSection } from '@/sections/ProcessSection';
import { CaseStudiesSection } from '@/sections/CaseStudiesSection';
import { StatsSection } from '@/sections/StatsSection';
import { FAQSection } from '@/sections/FAQSection';
import { FinalCTASection } from '@/sections/FinalCTASection';

export function HomePage({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  return (
    <>
      <HeroSection lang={lang} />
      <TargetClientsSection lang={lang} />
      <ServicesSection lang={lang} />
      <PackagesSection lang={lang} />
      <ProcessSection lang={lang} />
      <CaseStudiesSection lang={lang} />
      <StatsSection lang={lang} />
      <FAQSection lang={lang} />
      <FinalCTASection lang={lang} />
    </>
  );
}
