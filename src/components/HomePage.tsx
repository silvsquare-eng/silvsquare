import { HeroSection } from '@/sections/HeroSection';
import { TargetClientsSection } from '@/sections/TargetClientsSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { PackagesSection } from '@/sections/PackagesSection';
import { ProcessSection } from '@/sections/ProcessSection';
import { CaseStudiesSection } from '@/sections/CaseStudiesSection';
import { StatsSection } from '@/sections/StatsSection';
import { FAQSection } from '@/sections/FAQSection';
import { FinalCTASection } from '@/sections/FinalCTASection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TargetClientsSection />
      <ServicesSection />
      <PackagesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <StatsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
