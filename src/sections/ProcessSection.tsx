import { SectionHeader } from '@/components/SectionHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ProcessSection({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const { ref: gridRef, isVisible } = useScrollReveal();

  const steps = lang === 'en' ? [
    {
      number: '01',
      title: 'Initial Contact',
      description:
        'Fill out a simple form: restaurant name, city, number of branches, activity type, and menu link if any. We will contact you within 24 hours.',
    },
    {
      number: '02',
      title: 'Package Selection and Customization',
      description:
        'We choose the appropriate package with you and adjust sizes and quantities according to your restaurant\'s menu. Everything is designed according to your actual needs.',
    },
    {
      number: '03',
      title: 'Design Approval',
      description:
        'We send you a clear mockup for each piece: cups, bags, boxes. Edits until you are satisfied. After approval, we start production immediately.',
    },
    {
      number: '04',
      title: 'Production and Delivery',
      description:
        'We produce in our factory in Al Khobar and deliver to your restaurant\'s location in Saudi Arabia. Reliable shipping and delivery to the branch door.',
    },
  ] : [
    {
      number: '01',
      title: 'تواصل أولي',
      description:
        'تعبئة نموذج بسيط: اسم المطعم، المدينة، عدد الفروع، نوع النشاط، ورابط المنيو إن وجد. نتواصل معك خلال 24 ساعة.',
    },
    {
      number: '02',
      title: 'اختيار الباقة وتخصيصها',
      description:
        'نختار معك الباقة المناسبة ونضبط المقاسات والكميات حسب منيو مطعمك. كل شيء يُصمم حسب احتياجك الفعلي.',
    },
    {
      number: '03',
      title: 'اعتماد التصميم',
      description:
        'نرسللك موك أب واضح لكل قطعة: أكواب، أكياس، بوكسات. تعديلات حتى ترضى. بعد الاعتماد، نبدأ الإنتاج فوراً.',
    },
    {
      number: '04',
      title: 'الإنتاج والتسليم',
      description:
        'ننتج في مصنعنا بالخبر ونسلم لك في موقع مطعمك داخل السعودية. شحن موثوق وتوصيل لباب الفرع.',
    },
  ];

  const eyebrow = lang === 'en' ? 'Clear Process' : 'عملية واضحة';
  const heading = lang === 'en' ? 'How do we prepare your restaurant\'s packaging?' : 'كيف نجهز تغليف مطعمك؟';

  return (
    <section id="process" className="bg-sand section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          {/* Connecting lines - desktop only */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px">
            <div
              className={`h-full border-t border-dashed border-secondary-warm/30 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative text-center ${lang === 'en' ? 'md:text-left' : 'md:text-right'} transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Decorative number */}
              <span className={`hidden md:block absolute -top-4 ${lang === 'en' ? 'left-0' : 'right-0'} text-display text-primary-accent/[0.12] font-black select-none pointer-events-none`}>
                {step.number}
              </span>

              <div className="relative z-10 pt-4">
                <span className="md:hidden inline-block text-caption font-bold text-primary-accent mb-2">
                  {step.number}
                </span>
                <h3 className="text-h3 text-primary-dark mb-3">{step.title}</h3>
                <p className="text-body text-muted-text">{step.description}</p>
              </div>

              {/* Mobile connecting line */}
              {index < steps.length - 1 && (
                <div className="md:hidden h-8 w-px border-r border-dashed border-secondary-warm/30 mx-auto my-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
