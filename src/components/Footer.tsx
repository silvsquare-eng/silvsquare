import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { getLenis } from '@/hooks/useLenis';

export function Footer({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const quickLinks = lang === 'en' ? [
    { label: 'Services', target: 'services' },
    { label: 'Packages', target: 'packages' },
    { label: 'Process', target: 'process' },
    { label: 'FAQ', target: 'faq' },
  ] : [
    { label: 'الخدمات', target: 'services' },
    { label: 'الباقات', target: 'packages' },
    { label: 'طريقة العمل', target: 'process' },
    { label: 'الأسئلة الشائعة', target: 'faq' },
  ];

  const scrollTo = (id: string) => {
    const isHome = window.location.pathname === '/' || window.location.pathname === '/en' || window.location.pathname === '/en/';
    const urlPrefix = lang === 'en' ? '/en' : '';
    
    if (!isHome) {
      window.location.href = `${urlPrefix || '/'}#${id}`;
      return;
    }
    const lenis = getLenis();
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -80 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerDesc = lang === 'en' ? "Your success partner in providing complete packaging and printing solutions for restaurants and cafes in Saudi Arabia." : SITE_CONFIG.brand.footerDescription;
  const quickLinksTitle = lang === 'en' ? "Quick Links" : "روابط سريعة";
  const contactTitle = lang === 'en' ? "Contact Us" : "تواصل معنا";
  const whatsappBtn = lang === 'en' ? "WhatsApp" : "واتساب";
  const legalTitle = lang === 'en' ? "Legal" : "قانوني";
  const privacyPolicy = lang === 'en' ? "Privacy Policy" : "سياسة الخصوصية";
  const termsOfUse = lang === 'en' ? "Terms of Use" : "شروط الاستخدام";
  const allRightsReserved = lang === 'en' ? (SITE_CONFIG.ui_en?.all_rights_reserved || 'All rights reserved.') : (SITE_CONFIG.ui?.all_rights_reserved || 'جميع الحقوق محفوظة.');
  const factoryInfo = lang === 'en' 
    ? "Silver Square Factory — Riyadh — Saudi Arabia"
    : `${SITE_CONFIG.brand.factoryName} — ${SITE_CONFIG.brand.city} — ${SITE_CONFIG.brand.country}`;

  return (
    <footer className="bg-primary-dark text-sand">
      <div className="content-max-width px-5 md:px-10 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl text-white mb-3">{lang === 'en' ? "Silver Square" : SITE_CONFIG.brand.name}</h3>
            <p className="text-body text-muted-text" dir={lang === 'en' ? 'ltr' : 'rtl'}>{footerDesc}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-h3 text-secondary-warm mb-4">{quickLinksTitle}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => scrollTo(link.target)}
                    className="text-body text-muted-text hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-h3 text-secondary-warm mb-4">{contactTitle}</h4>
            <p className="text-body text-muted-text mb-3" dir="ltr">{SITE_CONFIG.links.phone}</p>
            <a
              href={`https://wa.me/${SITE_CONFIG.links.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-success-green text-white rounded-pill text-sm font-medium transition-all duration-300 hover:brightness-110"
            >
              <Phone className="w-4 h-4" />
              {whatsappBtn}
            </a>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-h3 text-secondary-warm mb-4">{legalTitle}</h4>
            <ul className="space-y-2.5">
              <li className="text-body text-muted-text hover:text-white transition-colors cursor-pointer">
                {privacyPolicy}
              </li>
              <li className="text-body text-muted-text hover:text-white transition-colors cursor-pointer">
                {termsOfUse}
              </li>
            </ul>
            <p className="text-caption text-warm-dark mt-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              &copy; 2025 {lang === 'en' ? "Silver Square" : SITE_CONFIG.brand.name}. {allRightsReserved}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-caption text-warm-dark" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            {factoryInfo}
          </p>
        </div>
      </div>
    </footer>
  );
}
