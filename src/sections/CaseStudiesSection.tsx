import { SectionHeader } from '@/components/SectionHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const cases = [
  {
    image: '/assets/case-coffee.jpg',
    tag: 'كافيه',
    title: 'كافيه قهوة مختصة — الدمام',
    before: 'الوضع قبل: أكواب بدون طباعة، أكياس عادية، لا هوية موحدة',
    executed: [
      'أكواب ورقية 8oz و12oz بطباعة كاملة',
      'أكياس قهوة 250g بشعار الكافيه',
      'ستيكرات براند بمقاسين',
      'ورق زبدة مطبوع',
    ],
    after: 'النتيجة: هوية تغليف موحدة 100%، تقليل الموردين من 3 إلى 1',
  },
  {
    image: '/assets/case-fastfood.jpg',
    tag: 'مطعم',
    title: 'مطعم برجر — الخبر',
    before: 'الوضع قبل: بوكسات generic، ورق ساندوتش بدون طباعة، كل مورد لوحده',
    executed: [
      'بوكسات طعام 3 مقاسات بطباعة كاملة',
      'ورق ساندوتش مطبوع بشعار المطعم',
      'أكياس ورقية مطبوعة (2 مقاس)',
      'أكواب مشروبات 12oz و16oz',
    ],
    after: 'النتيجة: توحيد التغليف بالكامل، توفير 20% في تكلفة التغليف',
  },
  {
    image: '/assets/case-bakery.jpg',
    tag: 'مشروع منزلي',
    title: 'مشروع حلويات منزلية — الرياض',
    before: 'الوضع قبل: تغليف يدوي بسيط، لا يوجد شعار مطبوع على المنتجات',
    executed: [
      'أكواب ورقية 8oz بطباعة كاملة',
      'ستيكرات براند 3 مقاسات',
      'أكياس ورقية صغيرة مطبوعة',
      'ورق زبدة مطبوع (250 ورقة)',
    ],
    after: 'النتيجة: شكل احترافي رفع مبيعات التوصيل 40%',
  },
];

export function CaseStudiesSection() {
  const { ref: gridRef, isVisible } = useScrollReveal();

  return (
    <section id="cases" className="bg-white section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow="قصص نجاح" heading="نماذج تغليف نفذناها" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, index) => (
            <div
              key={index}
              className={`card-base overflow-hidden transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-[200px] md:h-[240px] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(24,20,17,0.8) 0%, transparent 60%)',
                  }}
                />
                <span className="absolute bottom-4 right-4 text-caption bg-accent-light text-secondary-warm px-3 py-1 rounded-pill">
                  {c.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 md:p-7">
                <h3 className="text-h3 text-primary-dark mb-4">{c.title}</h3>

                <div className="mb-4">
                  <p className="text-body text-muted-text">{c.before}</p>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {c.executed.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-body text-warm-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-warm mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-body font-semibold text-success-green">{c.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
