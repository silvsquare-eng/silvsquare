import { useState } from 'react';
import { Phone, Check } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { SITE_CONFIG } from '@/config/site';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function FinalCTASection({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const { openModal } = useModal();
  const { ref, isVisible } = useScrollReveal();
  const [copied, setCopied] = useState(false);

  const defaultMessage = lang === 'en' ? "Hello, I would like to inquire about packaging services." : SITE_CONFIG.whatsappMessage;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const t = {
    title: lang === 'en' ? 'We give you a complete packaging solution for your restaurant, from the first design to the last box that reaches the customer' : 'نعطيك حل تغليف كامل لمطعمك من أول تصميم إلى آخر بوكس يوصل للعميل',
    subtitle: lang === 'en' ? 'One destination. Design + Printing + Production + Shipping. For all your branches in Saudi Arabia.' : 'جهة واحدة. تصميم + طباعة + إنتاج + شحن. لكل فروعك داخل السعودية.',
    btnStart: lang === 'en' ? 'Start preparing your restaurant packaging now' : 'ابدأ تجهيز تغليف مطعمك الآن',
    orContact: lang === 'en' ? 'Or contact us directly via WhatsApp' : 'أو تواصل مباشرة عبر واتساب',
    whatsapp: lang === 'en' ? 'WhatsApp' : 'واتساب',
    copyWait: lang === 'en' ? 'Click to copy message' : 'اضغط لنسخ الرسالة',
    copied: lang === 'en' ? 'Copied' : 'تم النسخ',
  };

  return (
    <section id="cta" className="bg-primary-dark section-padding" ref={ref}>
      <div className="content-max-width max-w-[800px] text-center" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <h2
          className={`text-h2 text-white leading-[1.3] mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {t.title}
        </h2>

        <p
          className={`text-subtitle text-secondary-warm mb-10 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {t.subtitle}
        </p>

        <button
          onClick={openModal}
          className={`btn-primary text-lg px-11 py-4 mb-7 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {t.btnStart}
        </button>

        <div
          className={`transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-body text-muted-text mb-4">{t.orContact}</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <a 
              href={`https://wa.me/${SITE_CONFIG.links.whatsapp}?text=${encodeURIComponent(defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-7 py-3 bg-success-green text-white rounded-pill font-medium transition-all duration-300 hover:brightness-110 ${lang === 'en' ? 'flex-row-reverse' : ''}`}
            >
              <Phone className="w-5 h-5" />
              {t.whatsapp}
            </a>
          </div>
        </div>

        {/* Pre-written message */}
        <div
          className={`mt-5 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block bg-white/[0.08] rounded-lg px-5 py-4 text-center">
            <p className="text-caption text-white/50 italic mb-2">
              {defaultMessage}
            </p>
            <button
              onClick={handleCopy}
              className={`text-caption text-secondary-warm hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto ${lang === 'en' ? 'flex-row-reverse' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> {t.copied}
                </>
              ) : (
                t.copyWait
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
