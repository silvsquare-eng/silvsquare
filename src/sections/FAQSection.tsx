import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';

const faqs = [
  {
    question: 'ما الحد الأدنى للطلب؟',
    answer:
      'يختلف حسب المنتج. الأكواب الورقية تبدأ من 5,000 كوب، الأكياس الورقية من 3,000 كيس، والستيكرات من 1,000 ستيكر. الباقات الجاهزة توضح الحد الأدنى لكل منها بوضوح.',
  },
  {
    question: 'كم يستغرق وقت التسليم؟',
    answer:
      'أول طلب يستغرق 8–14 يوم عمل حسب حجم الطلب والتخصيصات. الطلبات الدورية المتكررة تستغرق 7–10 أيام. نتواصل معك بتحديثات منتظمة خلال الإنتاج.',
  },
  {
    question: 'هل أقدر أبدأ بكميات صغيرة لمشروعي المنزلي؟',
    answer:
      'نعم. باقة المشروع المنزلي مصممة خصيصاً للكميات الصغيرة. الحد الأدنى 2,500 قطعة إجمالي، ونقدر نخصصها حسب منتجاتك.',
  },
  {
    question: 'كيف أرسل الشعار والمنيو؟',
    answer:
      'بعد ما تطلب التسعيرة، نرسللك رابط يرفع فيه ملفاتك. نحتاج الشعار بصيغة vector (AI أو EPS أو PDF عالي الجودة) والمنيو كصورة أو PDF.',
  },
  {
    question: 'هل السعر يشمل التصميم؟',
    answer:
      'نعم. التصميم والموك أب شامل في سعر الباقة. نعدل التصميم حتى ترضى تماماً. عدد التعديلات: 3 جولات مجانية.',
  },
  {
    question: 'ما آلية الدفع والشحن؟',
    answer:
      'الدفع: 50% عند تأكيد الطلب و50% قبل الشحن. ندعم التحويل البنكي. الشحن: نوصل لجميع مدن السعودية. تكلفة الشحن تحسب حسب الموقع والوزن.',
  },
  {
    question: 'هل تدعمون سلاسل المطاعم بفروع متعددة؟',
    answer:
      'نعم. نجهز نفس التصميم لكل الفروع ونسلم لكل فرع على حدة. عندنا نظام إدارة مخزون دوري يربط كل الفروع.',
  },
];

function FAQItem({
  question,
  answer,
  isOpen: initialOpen,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-primary-dark/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-right gap-4 min-h-[48px]"
      >
        <span className="text-h3 text-primary-dark">{question}</span>
        <span
          className={`flex-shrink-0 text-primary-accent transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="text-body text-muted-text pb-6">{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="bg-white section-padding">
      <div className="content-max-width max-w-[800px]">
        <SectionHeader eyebrow="الأسئلة المتكررة" heading="الأسئلة الشائعة" />

        <div className="mt-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
