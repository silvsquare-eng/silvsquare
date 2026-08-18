import { Coffee, Beef, Home, Building2 } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function TargetClientsSection({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const { ref: gridRef, isVisible } = useScrollReveal();

  const clients = lang === 'en' ? [
    {
      icon: Coffee,
      title: 'A new cafe opening its first branch',
      problem:
        'Needs complete packaging from day one: cups, bags, boxes, and stickers — and doesn\'t want to deal with 4 different suppliers.',
      accent: true,
    },
    {
      icon: Beef,
      title: 'Fast food restaurant',
      problem:
        'Large and diverse quantities: food boxes, sandwich wrap paper, takeaway bags — wants them all with the same identity and from the same source.',
      accent: false,
    },
    {
      icon: Home,
      title: 'Home business scaling to restaurant level',
      problem:
        'Starts with small quantities and wants professional packaging that elevates the product\'s look without unfair minimum orders.',
      accent: false,
    },
    {
      icon: Building2,
      title: 'Small restaurant chain (2–5 branches)',
      problem:
        'Wants to unify packaging across all branches and manage periodic orders without running out of stock.',
      accent: true,
    },
  ] : [
    {
      icon: Coffee,
      title: 'كافيه جديد يفتح أول فرع',
      problem:
        'تحتاج تغليف كامل من أول يوم: أكواب، أكياس، بوكسات، وستيكرات — ولا تريد التعامل مع 4 موردين مختلفين',
      accent: true,
    },
    {
      icon: Beef,
      title: 'مطعم وجبات سريعة',
      problem:
        'كميات كبيرة ومتنوعة: بوكسات طعام، ورق ساندوتش، أكياس تيك أواي — تريد كلها بنفس الهوية ومن نفس المصدر',
      accent: false,
    },
    {
      icon: Home,
      title: 'مشروع منزلي طالع لمستوى مطعم',
      problem:
        'تبدأ بكميات صغيرة وتريد تغليف احترافي يرفع من شكل منتجك بدون حد أدنى مجحف',
      accent: false,
    },
    {
      icon: Building2,
      title: 'سلسلة مطاعم صغيرة (2–5 فروع)',
      problem:
        'تريد توحيد التغليف بين كل الفروع وإدارة الطلبات الدورية بدون ما ينقطع المخزون',
      accent: true,
    },
  ];

  const eyebrow = lang === 'en' ? 'Serving every restaurant and cafe' : 'نخدم كل مطعم وكافيه';
  const heading = lang === 'en' ? 'Who do we prepare packaging for?' : 'لمن نجهز التغليف؟';

  return (
    <section id="clients" className="bg-white section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow={eybrow} heading={heading} />

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          {clients.map((client, index) => (
            <div
              key={index}
              className={`card-base p-6 md:p-8 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <client.icon
                className={`w-12 h-12 mb-5 ${
                  client.accent ? 'text-primary-accent' : 'text-secondary-warm'
                }`}
                strokeWidth={1.5}
              />
              <h3 className="text-h3 text-primary-dark mb-3">{client.title}</h3>
              <p className="text-body text-muted-text">{client.problem}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
