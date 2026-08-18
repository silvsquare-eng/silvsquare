import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export function WhatsAppFAB({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: 2,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  const ariaLabel = lang === 'en' ? "Contact via WhatsApp" : "تواصل عبر واتساب";
  const defaultMessage = lang === 'en' ? "Hello, I would like to inquire about packaging services." : SITE_CONFIG.whatsappMessage;

  return (
    <a
      ref={buttonRef}
      href={`https://wa.me/${SITE_CONFIG.links.whatsapp}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${lang === 'en' ? 'right-6' : 'left-6'} z-[999] w-14 h-14 bg-success-green rounded-full flex items-center justify-center shadow-whatsapp transition-all duration-300 hover:scale-110 hover:shadow-lg`}
      aria-label={ariaLabel}
    >
      <Phone className="w-7 h-7 text-white" />
    </a>
  );
}
