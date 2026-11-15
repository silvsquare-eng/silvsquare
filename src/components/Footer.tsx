import { useState, useEffect } from 'react';
import { Phone, ShieldCheck, FileText } from 'lucide-react';
import { SITE_CONFIG, getRepNumber } from '@/config/site';
import { getLenis } from '@/hooks/useLenis';

export function Footer({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const [phoneNumber, setPhoneNumber] = useState<string>(SITE_CONFIG.links.whatsapp);

  useEffect(() => {
    setPhoneNumber(getRepNumber());
  }, []);

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
