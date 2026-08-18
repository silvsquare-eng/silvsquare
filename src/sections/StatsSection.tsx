import { useEffect, useRef, useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { SITE_CONFIG } from '@/config/site';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import gsap from 'gsap';

function AnimatedCounter({
  value,
  suffix,
  isVisible,
  delay,
  lang,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
  delay: number;
  lang?: 'ar' | 'en';
}) {
  const [display, setDisplay] = useState(0);
  const proxyRef = useRef({ val: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      gsap.to(proxyRef.current, {
        val: value,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplay(Math.round(proxyRef.current.val));
        },
      });
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <span className="text-display text-primary-accent font-black tabular-nums" dir="ltr">
      {display.toLocaleString(lang === 'en' ? 'en-US' : 'ar-SA')}
      {suffix}
    </span>
  );
}

export function StatsSection({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const { ref: gridRef, isVisible } = useScrollReveal();
  
  const stats = lang === 'en' ? [
    {
      "value": 180,
      "suffix": "+",
      "label": "Restaurants and cafes trust us"
    },
    {
      "value": 12000,
      "suffix": "+",
      "label": "Shipments fulfilled per year"
    },
    {
      "value": 25,
      "suffix": "",
      "label": "Cities we serve in Saudi Arabia"
    },
    {
      "value": 85,
      "suffix": "%",
      "label": "Of customers reorder"
    }
  ] : SITE_CONFIG.stats;

  const eyebrow = lang === 'en' ? 'In Numbers' : 'بأرقام';
  const heading = lang === 'en' ? 'Numbers that show the picture' : 'أرقام توضح الصورة';

  return (
    <section id="stats" className="bg-sand section-padding">
      <div className="content-max-width max-w-[1000px]">
        <SectionHeader eyebrow={eyebrow} heading={heading} centered />

        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          dir={lang === 'en' ? 'ltr' : 'rtl'}
        >
          {stats.map((stat: any, index: number) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                isVisible={isVisible}
                delay={index * 0.2}
                lang={lang}
              />
              <p className="text-caption text-muted-text mt-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
