import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { getLenis } from '@/hooks/useLenis';

const quickLinks = [
  { label: 'الخدمات', target: 'services' },
  { label: 'الباقات', target: 'packages' },
  { label: 'طريقة العمل', target: 'process' },
  { label: 'الأسئلة الشائعة', target: 'faq' },
];

export function Footer() {
  const scrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = '/#' + id;
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

  return (
    <footer className="bg-primary-dark text-sand">
      <div className="content-max-width px-5 md:px-10 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl text-white mb-3">{SITE_CONFIG.brand.name}</h3>
            <p className="text-body text-muted-text">{SITE_CONFIG.brand.footerDescription}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-h3 text-secondary-warm mb-4">روابط سريعة</h4>
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
            <h4 className="text-h3 text-secondary-warm mb-4">تواصل معنا</h4>
            <p className="text-body text-muted-text mb-3">{SITE_CONFIG.links.phone}</p>
            <a
              href={`https://wa.me/${SITE_CONFIG.links.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-success-green text-white rounded-pill text-sm font-medium transition-all duration-300 hover:brightness-110"
            >
              <Phone className="w-4 h-4" />
              واتساب
            </a>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-h3 text-secondary-warm mb-4">قانوني</h4>
            <ul className="space-y-2.5">
              <li className="text-body text-muted-text hover:text-white transition-colors cursor-pointer">
                سياسة الخصوصية
              </li>
              <li className="text-body text-muted-text hover:text-white transition-colors cursor-pointer">
                شروط الاستخدام
              </li>
            </ul>
            <p className="text-caption text-warm-dark mt-4">
              &copy; 2025 {SITE_CONFIG.brand.name}. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-caption text-warm-dark">
            {SITE_CONFIG.brand.factoryName} — {SITE_CONFIG.brand.city} — {SITE_CONFIG.brand.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
