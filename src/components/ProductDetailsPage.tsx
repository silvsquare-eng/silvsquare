import { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, Box } from 'lucide-react';
import { Reviews } from '@/components/Reviews';
import type { Product } from '@/components/ProductCard';
import { SITE_CONFIG, getRepNumber } from '@/config/site';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export interface DetailedProduct extends Product {
  rating: number;
  reviews: any[];
}

export function ProductDetailsPage({ product }: { product: DetailedProduct }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product?.options) {
      Object.entries(product.options).forEach(([key, values]) => {
        if (values && values.length > 0) initial[key] = values[0];
      });
    }
    return initial;
  });

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  const [show3D, setShow3D] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Load model-viewer only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').catch(console.error);
    }
  }, []);

  // Reset view when options change
  useEffect(() => {
    setActiveImageIndex(null);
    setShow3D(false);
  }, [selectedOptions]);

  if (!product) return <div className="pt-32 text-center h-screen">جاري تحميل المنتج...</div>;

  let dynamicName = product.name;
  let dynamicSku = product.id;
  
  if (selectedOptions) {
    const optionsString = Object.values(selectedOptions).filter(Boolean).join(' - ');
    if (optionsString) {
      dynamicName = `${product.name} - ${optionsString}`;
      dynamicSku = `${product.id}-${Object.values(selectedOptions).filter(Boolean).map(v => v.replace(/\s+/g, '')).join('-')}`;
    }
  }

  const buildWhatsAppLink = () => {
    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/catalog/${product.id}` : '';

    let repId = null;
    if (typeof window !== 'undefined') {
      repId = localStorage.getItem('sales_rep');
    }
    const phoneNumber = getRepNumber(repId);
    const imageUrl = getColorImage();

    let msg = `السلام عليكم، أريد طلب:\n${productUrl}\n\n`;
    msg += `📦 المنتج: ${dynamicName}\n`;
    msg += `🏷️ رمز المنتج (SKU): ${dynamicSku}\n`;
    if (imageUrl) {
      msg += `🖼️ صورة المنتج: ${imageUrl}\n`;
    }
    msg += `\nالتفاصيل:\n`;
    Object.entries(selectedOptions).forEach(([key, value]) => {
      msg += `- ${key}: ${value}\n`;
    });
    const encodedMsg = encodeURIComponent(msg);
    return `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
  };

  const getMarketingDescription = () => {
    return "مصمم خصيصاً لتلبية احتياجات المطاعم والكافيهات. يعكس هوية علامتك التجارية بشكل احترافي، ويتميز بجودة عالية تتحمل الاستخدام المكثف، مما يضمن تجربة تقديم ممتازة لعملائك ويرفع من مستوى رضاهم.";
  };

  const getColorImage = () => {
    const colorKey = Object.keys(product?.options || {}).find(k => k.toLowerCase() === 'colors' || k === 'اللون' || k === 'color');
    if (!product || !colorKey) return product?.main_image;
    
    const selectedColor = selectedOptions[colorKey];
    if (!selectedColor) return product.main_image;

    const colorIndex = product.options[colorKey].indexOf(selectedColor);
    if (colorIndex === 0) return product.main_image;
    if (colorIndex > 0 && product.additional_images && product.additional_images.length >= colorIndex) {
      return product.additional_images[colorIndex - 1];
    }
    return product.main_image;
  };
  const displayImage = activeImageIndex !== null && product.additional_images && product.additional_images.length > activeImageIndex 
      ? product.additional_images[activeImageIndex] 
      : getColorImage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20">
      <div className="content-max-width px-5 md:px-10">
        <a href="/catalog" className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-accent transition-colors mb-8">
          <ChevronRight className="w-4 h-4 ml-1" />
          {SITE_CONFIG.ui?.view_catalog || 'العودة للكتالوج'}
        </a>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative">
              {show3D && product.model_3d ? (
                // @ts-ignore
                <model-viewer
                  src={product.model_3d}
                  alt={product.name}
                  auto-rotate
                  camera-controls
                  ar
                  style={{ width: '100%', height: '100%' }}
                />
              ) : displayImage ? (
                <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">لا توجد صورة</div>
              )}

              {/* 3D Toggle Button */}
              {product.model_3d && (
                <button 
                  onClick={() => setShow3D(!show3D)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:bg-white transition-colors z-10 flex items-center gap-2"
                >
                  <Box className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm font-semibold text-primary-dark">{show3D ? 'عرض الصور' : 'عرض 3D'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {/* Main Image Thumbnail */}
              <div 
                className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${!show3D && activeImageIndex === null ? 'border-primary-accent' : 'border-transparent'}`}
                onClick={() => { setActiveImageIndex(null); setShow3D(false); }}
              >
                 <img src={getColorImage()} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Additional Images Thumbnails */}
              {product.additional_images && product.additional_images.map((img, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${!show3D && activeImageIndex === i ? 'border-primary-accent' : 'border-transparent'}`}
                  onClick={() => { setActiveImageIndex(i); setShow3D(false); }}
                >
                  <img src={img} alt={`${product.name} - ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary-accent mb-2">{product.category}</span>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">{dynamicName}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded">SKU: {dynamicSku}</span>
            </div>
            
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="bg-primary-accent/10 p-5 rounded-2xl mb-8 border border-primary-accent/20">
              <h3 className="font-semibold text-primary-dark mb-2 text-sm flex items-center gap-2">
                🌟 لأصحاب المطاعم والكافيهات
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {getMarketingDescription()}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-10">
              {product.options && Object.entries(product.options).map(([key, values]) => {
                if (!values || values.length === 0) return null;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{key}:</label>
                    <select 
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent"
                      value={selectedOptions[key] || ''}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                    >
                      {values.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Contact Action */}
            <div className="mt-auto pt-6 border-t border-neutral-100">
              <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-lg font-bold transition-colors w-full">
                <MessageCircle className="w-5 h-5" /> {SITE_CONFIG.ui?.request_product_quote || 'طلب تسعيرة'}
              </a>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <Reviews productId={product.id} initialReviews={product.reviews} initialRating={product.rating} />
        </div>

      </div>
    </div>
  );
}
