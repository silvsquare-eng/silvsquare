import { useState, useEffect } from 'react';
import { SITE_CONFIG, getRepNumber } from '@/config/site';

export type ProductOptions = Record<string, string[]>;

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: string;
  main_image: string;
  additional_images: string[];
  model_3d?: string;
  options: ProductOptions;
  skus: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const buildWhatsAppLink = (product: Product) => {
    // Generate absolute URL for the product page
    const productUrl = `${origin || 'https://silvsquaresa.pages.dev'}/catalog/${product.id}`;
    
    let repId = null;
    if (typeof window !== 'undefined') {
      repId = localStorage.getItem('sales_rep');
    }
    const phoneNumber = getRepNumber(repId);
    
    const message = encodeURIComponent(
      `${SITE_CONFIG.ui?.whatsapp_message || 'مرحباً، أود الاستفسار عن المنتج التالي:'}\n\n` +
      `📦 الموديل: ${product.name}\n` +
      `🏷️ الكود: ${product.id}\n` +
      `رابط المنتج:\n${productUrl}`
    );
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 border border-sand">
      <a href={`/catalog/${product.id}`} className="block relative aspect-square overflow-hidden bg-sand">
        <img
          src={product.main_image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.model_3d && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            3D متوفر
          </div>
        )}
      </a>
      
      <div className="p-5 flex flex-col gap-3">
        <div>
          <span className="text-xs font-medium text-primary-accent mb-1 block">
            {product.category}
          </span>
          <a href={`/catalog/${product.id}`}>
            <h3 className="text-base font-bold text-primary-dark hover:text-primary-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </a>
        </div>
        
        <p className="text-sm text-muted-text line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="pt-4 mt-auto border-t border-sand flex items-center justify-between gap-2">
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#25D366] text-white py-2 px-2 rounded-button text-sm font-semibold hover:bg-[#20bd5a] transition-colors whitespace-nowrap"
          >
            {SITE_CONFIG.ui?.request_product_quote || 'طلب تسعيرة'}
          </a>
          <a
            href={`/catalog/${product.id}`}
            className="flex-1 text-center border border-primary-accent text-primary-accent py-2 px-4 rounded-button text-sm font-semibold hover:bg-primary-accent hover:text-white transition-colors"
          >
            التفاصيل
          </a>
        </div>
      </div>
    </div>
  );
}
