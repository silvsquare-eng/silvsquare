import { Phone, ShieldCheck, FileText, Mail, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { useRepNumber } from '@/hooks/useRepNumber';
import { getLenis } from '@/hooks/useLenis';

export function Footer({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const phoneNumber = useRepNumber();

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
    const search = window.location.search || '';
    
    if (!isHome) {
      window.location.href = `${urlPrefix || '/'}${search}#${id}`;
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
  const allRightsReserved = lang === 'en' ? (SITE_CONFIG.ui_en?.all_rights_reserved || 'All rights reserved.') : (SITE_CONFIG.ui?.all_rights_reserved || SITE_CONFIG.ui?.footer_rights || 'جميع الحقوق محفوظة.');
  const factoryInfo = lang === 'en' 
    ? "Silver Square Factory — Al Khobar — Saudi Arabia"
    : `${SITE_CONFIG.brand.factoryName} — ${SITE_CONFIG.brand.city} — ${SITE_CONFIG.brand.country}`;

  const sbcTitle = lang === 'en' ? 'Saudi Business Center' : 'المركز السعودي للأعمال';
  const crLabel = lang === 'en' ? 'Commercial Registration:' : 'السجل التجاري:';
  const taxLabel = lang === 'en' ? 'Tax Number (VAT):' : 'الرقم الضريبي:';
  const currentYear = new Date().getFullYear();

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
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-success-green text-white rounded-pill text-sm font-medium transition-all duration-300 hover:brightness-110"
            >
              <Phone className="w-4 h-4" />
              {whatsappBtn}
            </a>

            {/* Social & Direct Contact Links */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <a
                href="mailto:silvsquare@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={lang === 'en' ? 'Email' : 'البريد الإلكتروني'}
                title="silvsquare@gmail.com"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-primary-accent text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://maps.app.goo.gl/nsAAD38NCq2RN9oKA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={lang === 'en' ? 'Location Map' : 'الموقع على الخريطة'}
                title={lang === 'en' ? 'Location Map' : 'الخريطة'}
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-primary-accent text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/silvsquare?igsh=MWt0MGdkOGJvd2R5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-primary-accent text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/silvsquare/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-primary-accent text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@silvsquare?_r=1&_t=ZS-97r6PMgDyxM"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-primary-accent text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.61-.6 3.2-1.72 4.31-1.13 1.13-2.73 1.72-4.34 1.73-1.62.01-3.2-.58-4.32-1.7-1.13-1.13-1.72-2.72-1.73-4.33-.01-1.61.58-3.2 1.7-4.32 1.12-1.12 2.7-1.71 4.31-1.72h.18v4.04c-1.35.01-2.45 1.11-2.46 2.46 0 1.35 1.1 2.45 2.45 2.46 1.35 0 2.45-1.1 2.46-2.46V.02z" />
                </svg>
              </a>
            </div>
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
              &copy; {currentYear} {lang === 'en' ? "Silver Square" : SITE_CONFIG.brand.name}. {allRightsReserved}
            </p>
          </div>
        </div>

        {/* Official Registration & Tax Badges (Saudi Business Center & VAT) */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8"
            dir={lang === 'en' ? 'ltr' : 'rtl'}
          >
            {/* Saudi Business Center + CR */}
            <a
              href="https://eauthenticate.saudibusiness.gov.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl px-5 py-3.5 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-secondary-warm" />
              </div>
              <div className={lang === 'en' ? 'text-left' : 'text-right'}>
                <span className="block text-xs font-semibold text-white">
                  {sbcTitle}
                </span>
                <span className="block text-xs text-muted-text mt-0.5">
                  {crLabel}{' '}
                  <span className="font-mono text-sand font-medium" dir="ltr">
                    2051244352
                  </span>
                </span>
              </div>
            </a>

            {/* Tax Number (VAT) */}
            <div className="flex items-center gap-3.5 bg-white/[0.04] border border-white/10 rounded-xl px-5 py-3.5 w-full sm:w-auto justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-secondary-warm" />
              </div>
              <div className={lang === 'en' ? 'text-left' : 'text-right'}>
                <span className="block text-xs font-semibold text-white">
                  {taxLabel}
                </span>
                <span className="block text-xs font-mono text-sand font-medium mt-0.5" dir="ltr">
                  312743558700003
                </span>
              </div>
            </div>
          </div>

          <p className="text-caption text-warm-dark text-center mt-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            {factoryInfo}
          </p>
        </div>
      </div>
    </footer>
  );
}
