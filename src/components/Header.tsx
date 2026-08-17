import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG, SECTION_IDS } from '@/config/site';
import { useModal } from '@/hooks/useModal';
import { getLenis } from '@/hooks/useLenis';

const navLinks = [
  { label: 'الخدمات', target: SECTION_IDS.services },
  { label: 'الباقات', target: SECTION_IDS.packages },
  { label: 'طريقة العمل', target: SECTION_IDS.process },
  { label: 'الأسئلة', target: SECTION_IDS.faq },
];

export function Header({ currentPath = '/' }: { currentPath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { openModal } = useModal();
  const isHome = currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.values(SECTION_IDS).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    if (!isHome) {
      window.location.href = '/#' + id;
      setMenuOpen(false);
      return;
    }
    const lenis = getLenis();
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -80 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] h-[72px] transition-all duration-300 ${
          scrolled ? 'shadow-header' : ''
        }`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="content-max-width h-full flex items-center justify-between px-5 md:px-10">
          {/* Logo - right side in RTL */}
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary-dark">{SITE_CONFIG.brand.name}</span>
            <span className="text-caption text-muted-text hidden sm:block">
              {SITE_CONFIG.brand.subtitle}
            </span>
          </div>

          {/* Desktop Nav - center */}
          <nav className="hidden md:flex items-center gap-8">
            {!isHome && (
              <a
                href="/"
                className="text-sm font-medium transition-colors duration-300 pb-1 border-b-2 text-muted-text border-transparent hover:text-primary-dark"
              >
                الرئيسية
              </a>
            )}
            
            {isHome && navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className={`text-sm font-medium transition-colors duration-300 pb-1 border-b-2 ${
                  activeSection === link.target
                    ? 'text-primary-accent border-primary-accent'
                    : 'text-muted-text border-transparent hover:text-primary-dark'
                }`}
              >
                {link.label}
              </button>
            ))}

            <a
              href="/catalog"
              className={`text-sm font-medium transition-colors duration-300 pb-1 border-b-2 ${
                currentPath.startsWith('/catalog')
                  ? 'text-primary-accent border-primary-accent'
                  : 'text-muted-text border-transparent hover:text-primary-dark'
              }`}
            >
              الكتالوج
            </a>
          </nav>

          {/* Desktop CTA - left side in RTL */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 border border-warm-dark text-warm-dark rounded-pill text-sm font-medium transition-all duration-300 hover:bg-warm-dark hover:text-white">
              EN
            </button>
            <button
              onClick={openModal}
              className="px-6 py-2.5 bg-primary-accent text-white rounded-button text-sm font-semibold transition-all duration-300 hover:bg-primary-accent-hover hover:shadow-button-hover"
            >
              اطلب تسعيرة
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-primary-dark" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[998] bg-sand flex flex-col items-center justify-center gap-8 md:hidden">
          <button
            className="absolute top-5 left-5 p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-8 h-8 text-primary-dark" />
          </button>
          {/* Mobile Nav */}
          {!isHome && (
            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-h3 text-primary-dark hover:text-primary-accent transition-colors"
            >
              الرئيسية
            </a>
          )}

          {isHome && navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="text-h3 text-primary-dark hover:text-primary-accent transition-colors"
            >
              {link.label}
            </button>
          ))}

          <a
            href="/catalog"
            onClick={() => setMenuOpen(false)}
            className="text-h3 text-primary-dark hover:text-primary-accent transition-colors"
          >
            الكتالوج
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              openModal();
            }}
            className="btn-primary mt-4"
          >
            اطلب تسعيرة
          </button>
        </div>
      )}
    </>
  );
}
