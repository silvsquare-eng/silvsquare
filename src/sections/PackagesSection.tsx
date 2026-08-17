import { SectionHeader } from '@/components/SectionHeader';
import { useModal } from '@/hooks/useModal';
import { SITE_CONFIG } from '@/config/site';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const packages = [
  {
    name: 'باقة كافيه ستارتر',
    target: 'كافيه جديد يفتح أول فرع',
    contents: [
      'أكواب ورقية 8oz و12oz (طباعة كاملة)',
      'أكواب بلاستيكية مثلجة 16oz',
      'أكياس قهوة 250g و1kg (طباعة كاملة)',
      'ستيكرات براند (3 مقاسات)',
      'ورق زبدة مطبوع (500 ورقة)',
    ],
    quantity: 'الحد الأدنى: 5,000 قطعة إجمالي',
    delivery: 'تسليم أول طلب: 10–12 يوم عمل',
    featured: false,
  },
  {
    name: 'باقة مطعم وجبات سريعة',
    target: 'مطاعم البرجر، الشاورما، والوجبات السريعة',
    contents: [
      'بوكسات طعام بمقاسات متعددة (طباعة كاملة)',
      'ورق ساندوتش / زبدة مطبوع (1,000 ورقة)',
      'أكياس ورقية مطبوعة (3 مقاسات)',
      'أكواب مشروبات 8oz و12oz',
      'ستيكرات أمان للأغذية',
      'بوكس الجمعات (Large Family Box)',
    ],
    quantity: 'الحد الأدنى: 10,000 قطعة إجمالي',
    delivery: 'تسليم أول طلب: 12–14 يوم عمل',
    featured: true,
  },
  {
    name: 'باقة مشروع منزلي',
    target: 'مشاريع منزلية تتوسع وتريد تغليف احترافي',
    contents: [
      'أكواب ورقية 8oz (طباعة كاملة)',
      'أكياس ورقية صغيرة مطبوعة',
      'ستيكرات براند (2 مقاسات)',
      'ورق زبدة مطبوع (250 ورقة)',
    ],
    quantity: 'الحد الأدنى: 2,500 قطعة إجمالي',
    delivery: 'تسليم أول طلب: 8–10 أيام عمل',
    featured: false,
  },
];

export function PackagesSection() {
  const { openModal } = useModal();
  const { ref: gridRef, isVisible } = useScrollReveal();

  return (
    <section id="packages" className="bg-white section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow="حلول جاهزة" heading="باقات جاهزة لمطعمك وكافيهك" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-card p-6 md:p-8 transition-all duration-700 ${
                pkg.featured
                  ? 'border-2 border-primary-accent shadow-[0_4px_20px_rgba(232,96,17,0.12)]'
                  : 'card-base'
              } ${
                isVisible
                  ? pkg.featured
                    ? 'opacity-100 scale-100'
                    : 'opacity-100 translate-y-0'
                  : pkg.featured
                  ? 'opacity-0 scale-[0.98]'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {pkg.featured && (
                <span className="inline-block text-caption bg-primary-accent text-white px-4 py-1 rounded-pill mb-4">
                  الأكثر طلباً
                </span>
              )}

              <h3 className="text-h3 text-primary-dark mb-2">{pkg.name}</h3>

              <div className="mb-4">
                <span className="text-caption text-secondary-warm font-medium">لمن؟</span>
                <p className="text-subtitle text-primary-dark mt-1">{pkg.target}</p>
              </div>

              <div className="h-px bg-sand my-5" />

              <ul className="space-y-2 mb-5">
                {pkg.contents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-body text-warm-dark">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-warm mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-caption text-muted-text mb-3">{pkg.quantity}</p>

              <span className="inline-block text-caption bg-accent-light text-secondary-warm px-4 py-1.5 rounded-pill mb-6">
                {pkg.delivery}
              </span>

              <div className="space-y-3">
                <button onClick={openModal} className="btn-primary w-full">
                  اطلب تسعيرة
                </button>
                <a
                  href={SITE_CONFIG.links.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-sm"
                >
                  عرض المنتجات في المتجر →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
