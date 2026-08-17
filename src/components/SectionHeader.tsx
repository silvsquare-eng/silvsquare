import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeader({ eyebrow, heading, centered = false, light = false }: SectionHeaderProps) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`mb-8 md:mb-12 ${centered ? 'text-center' : ''}`}
    >
      <span
        className={`inline-block text-caption tracking-wider mb-3 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${light ? 'text-secondary-warm' : 'text-secondary-warm'}`}
      >
        {eyebrow}
      </span>
      <h2
        className={`text-h2 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${light ? 'text-white' : 'text-primary-dark'}`}
      >
        {heading}
      </h2>
    </div>
  );
}
