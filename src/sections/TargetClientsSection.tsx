import { Coffee, Beef, Home, Building2 } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const clients = [
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

export function TargetClientsSection() {
  const { ref: gridRef, isVisible } = useScrollReveal();

  return (
    <section id="clients" className="bg-white section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow="نخدم كل مطعم وكافيه" heading="لمن نجهز التغليف؟" />

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
