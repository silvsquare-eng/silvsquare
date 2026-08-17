import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export function WhatsAppFAB() {
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

  return (
    <a
      ref={buttonRef}
      href={`https://wa.me/${SITE_CONFIG.links.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[999] w-14 h-14 bg-success-green rounded-full flex items-center justify-center shadow-whatsapp transition-all duration-300 hover:scale-110 hover:shadow-lg"
      aria-label="تواصل عبر واتساب"
    >
      <Phone className="w-7 h-7 text-white" />
    </a>
  );
}
