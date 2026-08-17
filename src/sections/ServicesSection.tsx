import { ClipboardList, Palette, Factory, RefreshCw } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const services = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'تحليل احتياج التغليف',
    description:
      'نبدأ بفهم منيو مطعمك وعدد فروعك ونوع التقديم — داين إن، تيك أواي، أو دليفري. بناءً علها نحدد كل قطع التغليف اللي تحتاجها بالضبط: عددها، مقاساتها، وموادها.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'تصميم وتطبيق الهوية',
    description:
      'نطبع شعارك وألوانك على كل قطعة تغليف: أكواب ورقية وبلاستيكية، أكياس قهوة، أكياس ورقية، بوكسات طعام، ورق زبدة، وستيكرات براند. تصميم موحد يعكس هويتك في كل منتج يوصل للعميل.',
  },
  {
    number: '03',
    icon: Factory,
    title: 'الإنتاج والطباعة',
    description:
      'مواد عالية الجودة: ورق كرافت متين، أكواب بجدران مزدوجة للحرارة، أغطية محكمة للمشروبات. ننتج في مصنعنا بالخبر ونتحكم في كل مرحلة من الطباعة إلى التغليف النهائي.',
  },
  {
    number: '04',
    icon: RefreshCw,
    title: 'إدارة المخزون وإعادة الطلب',
    description:
      'نذكرك قبل ما ينتهي مخزونك. نظام إدارة دورية للطلبات يضمن ما ينقطع عندك تغليف — سواء فرع واحد أو خمسة فروع. نجهز الشحنة ونوصلها لباب الفرع.',
  },
];

export function ServicesSection() {
  const { ref: gridRef, isVisible } = useScrollReveal();

  return (
    <section id="services" className="bg-sand section-padding">
      <div className="content-max-width">
        <SectionHeader eyebrow="ملف التغليف الكامل" heading="ماذا نمسك لك في ملف التغليف؟" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-card shadow-card p-8 md:p-10 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-caption font-bold text-primary-accent">
                  {service.number}
                </span>
                <service.icon
                  className="w-10 h-10 text-secondary-warm"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-h3 text-primary-dark mb-3">{service.title}</h3>
              <p className="text-body text-muted-text">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
