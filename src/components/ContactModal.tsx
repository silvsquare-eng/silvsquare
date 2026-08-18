import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { SITE_CONFIG } from '@/config/site';
import gsap from 'gsap';

interface FormData {
  restaurantName: string;
  city: string;
  branches: string;
  activityType: string;
  menuLink: string;
  phone: string;
}

export function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [formData, setFormData] = useState<FormData>({
    restaurantName: '',
    city: '',
    branches: '1',
    activityType: '',
    menuLink: '',
    phone: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setErrors({});
      return;
    }

    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) return;

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      modal,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', delay: 0.1 }
    );
  }, [isOpen]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) {
      closeModal();
      return;
    }

    gsap.to(modal, { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: closeModal,
    });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    if (!formData.restaurantName.trim()) newErrors.restaurantName = true;
    if (!formData.city.trim()) newErrors.city = true;
    if (!formData.activityType) newErrors.activityType = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('Form submitted:', formData);
    setSubmitted(true);

    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-sand border rounded-input px-4 py-3 text-body transition-all duration-300 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/10 ${
      errors[field] ? 'border-red-400' : 'border-primary-dark/[0.08]'
    }`;

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(24,20,17,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-8 md:p-10 relative"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 text-warm-dark hover:text-primary-dark transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-h2 text-primary-dark mb-2">{SITE_CONFIG.ui?.request_quote_button || 'اطلب تسعيرة تغليف مطعمك'}</h2>
            <p className="text-body text-muted-text mb-8">نرد عليك خلال 24 ساعة</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  اسم المطعم أو المشروع *
                </label>
                <input
                  type="text"
                  placeholder="مثال: كافيه نورة"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className={inputClass('restaurantName')}
                />
              </div>

              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  المدينة *
                </label>
                <input
                  type="text"
                  placeholder="مثال: الرياض"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass('city')}
                />
              </div>

              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  عدد الفروع
                </label>
                <select
                  value={formData.branches}
                  onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                  className={inputClass('branches')}
                >
                  <option value="1">1 فرع</option>
                  <option value="2">2 فروع</option>
                  <option value="3-5">3–5 فروع</option>
                  <option value="6+">6+ فروع</option>
                </select>
              </div>

              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  نوع النشاط *
                </label>
                <select
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  className={inputClass('activityType')}
                >
                  <option value="">اختر...</option>
                  <option value="cafe">كافيه</option>
                  <option value="fastfood">مطعم وجبات سريعة</option>
                  <option value="home">مشروع منزلي</option>
                  <option value="family">مطعم عائلي</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  رابط المنيو (إن وجد)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.menuLink}
                  onChange={(e) => setFormData({ ...formData, menuLink: e.target.value })}
                  className={inputClass('menuLink')}
                />
              </div>

              <div>
                <label className="block text-caption font-semibold text-warm-dark mb-1.5">
                  رقم الجوال / واتساب *
                </label>
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass('phone')}
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-3">
                إرسال الطلب
              </button>

              <p className="text-caption text-muted-text text-center mt-4">
                بياناتك محمية ولن نشاركها مع أي طرف ثالث.
              </p>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="w-12 h-12 text-success-green mb-4" />
            <h3 className="text-h3 text-primary-dark mb-2">تم إرسال طلبك بنجاح!</h3>
            <p className="text-body text-muted-text">سنتواصل معك خلال 24 ساعة</p>
          </div>
        )}
      </div>
    </div>
  );
}
