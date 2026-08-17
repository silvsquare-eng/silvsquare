import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, Check } from 'lucide-react';

import { SITE_CONFIG } from '@/config/site';
import { useModal } from '@/hooks/useModal';

export function HeroSection() {
  const { openModal } = useModal();
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      content.querySelector('.pre-title'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.2
    )
      .fromTo(
        content.querySelector('.main-heading'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.4
      )
      .fromTo(
        content.querySelector('.sub-heading'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.6
      )
      .fromTo(
        content.querySelectorAll('.benefit-item'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        0.8
      )
      .fromTo(
        content.querySelectorAll('.cta-btn'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        1.0
      )
      .fromTo(
        content.querySelector('.scroll-indicator'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.5
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!imgRef.current) return;
    gsap.fromTo(imgRef.current, { scale: 1.05 }, { scale: 1, duration: 8, ease: 'none' });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0">
        <img
          ref={imgRef}
          src="/assets/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to left, rgba(24,20,17,0.78) 0%, rgba(24,20,17,0.45) 55%, rgba(24,20,17,0.15) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 content-max-width w-full px-5 md:px-10 pt-28 pb-20 md:pt-32 md:pb-16"
      >
        <div className="max-w-[680px] mr-0 ml-auto">
          {/* Pre-title */}
          <div className="pre-title mb-6 opacity-0">
            <span className="inline-block text-caption tracking-wider text-secondary-warm bg-secondary-warm/15 px-4 py-1.5 rounded-pill">
              مصنع سعودي — الخبر
            </span>
          </div>

          {/* Main heading */}
          <h1 className="main-heading text-display text-white mb-5 max-w-[600px] opacity-0">
            نجهز تغليف مطعمك من التصميم إلى باب الفرع
          </h1>

          {/* Subheading */}
          <p className="sub-heading text-subtitle text-white/80 mb-8 max-w-[540px] opacity-0">
            جهة واحدة تتولى تحليل احتياجك، تصميم هوية تغليفك، إنتاج وطباعة كل القطع، وإدارة
            الطلبات الدورية — لكل فروعك داخل السعودية
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            {SITE_CONFIG.hero.benefits.map((benefit, i) => (
              <div key={i} className="benefit-item flex items-center gap-2 opacity-0">
                <Check className="w-4 h-4 text-primary-accent flex-shrink-0" />
                <span className="text-body text-white/85">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={openModal}
              className="cta-btn btn-primary px-9 py-4 text-base opacity-0"
            >
              اطلب تسعيرة تجهيز مطعمك
            </button>
            <a
              href={SITE_CONFIG.links.store}
              className="cta-btn inline-flex items-center justify-center bg-transparent border-2 border-white/60 text-white font-semibold py-3.5 px-7 rounded-button transition-all duration-300 hover:bg-white hover:text-primary-dark opacity-0"
            >
              زيارة الكتالوج
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0">
        <ChevronDown className="w-6 h-6 text-white/50 animate-bounce-gentle" />
      </div>
    </section>
  );
}
