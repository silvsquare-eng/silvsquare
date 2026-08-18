import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';

function FAQItem({
  question,
  answer,
  isOpen: initialOpen,
  lang = 'ar'
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  lang?: 'ar' | 'en';
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-primary-dark/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-6 ${lang === 'en' ? 'text-left' : 'text-right'} gap-4 min-h-[48px]`}
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
        <p className={`text-body text-muted-text pb-6 ${lang === 'en' ? 'text-left' : 'text-right'}`}>{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const faqs = lang === 'en' ? [
    {
      question: 'What is the minimum order quantity?',
      answer:
        'It varies by product. Paper cups start from 5,000 cups, paper bags from 3,000 bags, and stickers from 1,000 stickers. The ready packages clearly state the minimum for each.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'The first order takes 8–14 working days depending on order size and customizations. Recurring orders take 7–10 days. We communicate with regular updates during production.',
    },
    {
      question: 'Can I start with small quantities for my home business?',
      answer:
        'Yes. The home business package is specially designed for small quantities. The minimum is 2,500 pieces total, and we can customize it according to your products.',
    },
    {
      question: 'How do I send the logo and menu?',
      answer:
        'After you request a quote, we send you a link to upload your files. We need the logo in vector format (AI, EPS, or high-quality PDF) and the menu as an image or PDF.',
    },
    {
      question: 'Does the price include design?',
      answer:
        'Yes. Design and mockup are included in the package price. We adjust the design until you are completely satisfied. Number of revisions: 3 free rounds.',
    },
    {
      question: 'What is the payment and shipping mechanism?',
      answer:
        'Payment: 50% upon order confirmation and 50% before shipping. We support bank transfers. Shipping: We deliver to all cities in Saudi Arabia. Shipping cost is calculated based on location and weight.',
    },
    {
      question: 'Do you support restaurant chains with multiple branches?',
      answer:
        'Yes. We prepare the same design for all branches and deliver to each branch separately. We have a periodic inventory management system that connects all branches.',
    },
  ] : [
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

  const eyebrow = lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة المتكررة';
  const heading = lang === 'en' ? 'Common Questions' : 'الأسئلة الشائعة';

  return (
    <section id="faq" className="bg-white section-padding">
      <div className="content-max-width max-w-[800px]" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        <div className="mt-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === 0}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
