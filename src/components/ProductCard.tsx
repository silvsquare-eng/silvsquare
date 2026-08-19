import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SITE_CONFIG, getRepNumber } from "@/config/site";

export type ProductOptions = Record<string, string[]>;

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  category: string;
  category_en?: string;
  description: string;
  description_en?: string;
  base_price: string;
  main_image: string;
  additional_images: string[];
  model_3d?: string;
  options: ProductOptions;
  options_en?: ProductOptions;
  option_images?: Record<string, string>;
  linked_options?: Record<string, string>;
  skus: string[];
}

interface ProductCardProps {
  product: Product;
  lang?: "ar" | "en";
}

export function ProductCard({ product, lang = "ar" }: ProductCardProps) {
  const [origin, setOrigin] = useState("");
  const [repId, setRepId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setOrigin(window.location.origin);
    setRepId(localStorage.getItem("sales_rep"));
  }, []);

  const allImages = [product.main_image, ...(product.additional_images || [])];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const name = lang === "en" && product.name_en ? product.name_en : product.name;
  const category = lang === "en" && product.category_en ? product.category_en : product.category;
  const description = lang === "en" && product.description_en ? product.description_en : product.description;
  const urlPrefix = lang === "en" ? "/en" : "";

  const buildWhatsAppLink = (product: Product) => {
    // Generate absolute URL for the product page
    const productUrl = `${origin || "https://silvsquaresa.pages.dev"}${urlPrefix}/catalog/${product.id}`;

    const phoneNumber = getRepNumber(repId);

    const defaultMsg = lang === "en" 
      ? "Hello, I would like to inquire about the following product:"
      : "مرحباً، أود الاستفسار عن المنتج التالي:";
    const whatsappMsg = lang === "en" 
      ? (SITE_CONFIG.ui_en?.whatsapp_message || defaultMsg)
      : (SITE_CONFIG.ui?.whatsapp_message || defaultMsg);

    const message = encodeURIComponent(
      `${whatsappMsg}\n\n` +
        `📦 ${lang === "en" ? "Model:" : "الموديل:"} ${name}\n` +
        `🏷️ ${lang === "en" ? "Code:" : "الكود:"} ${product.id}\n` +
        `${lang === "en" ? "Product Link:" : "رابط المنتج:"}\n${productUrl}`,
    );
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  const quoteText = lang === "en" 
    ? (SITE_CONFIG.ui_en?.request_product_quote || "Request Quote")
    : (SITE_CONFIG.ui?.request_product_quote || "طلب تسعيرة");

  const detailsText = lang === "en" ? "Details" : "التفاصيل";
  const model3dText = lang === "en" ? "3D Available" : "3D متوفر";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 border border-sand">
      <a
        href={`${urlPrefix}/catalog/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-sand group/image"
      >
        <img
          src={allImages[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={lang === 'en' ? nextImage : prevImage}
              className={`absolute top-1/2 ${lang === 'en' ? 'right-2' : 'right-2'} -translate-y-1/2 bg-white/80 backdrop-blur text-primary-dark p-1.5 rounded-full shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white`}
              style={lang === 'en' ? { right: '0.5rem', left: 'auto' } : {}}
            >
              <ChevronRight className={`w-5 h-5 ${lang === 'en' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={lang === 'en' ? prevImage : nextImage}
              className={`absolute top-1/2 ${lang === 'en' ? 'left-2' : 'left-2'} -translate-y-1/2 bg-white/80 backdrop-blur text-primary-dark p-1.5 rounded-full shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white`}
              style={lang === 'en' ? { left: '0.5rem', right: 'auto' } : {}}
            >
              <ChevronLeft className={`w-5 h-5 ${lang === 'en' ? 'rotate-180' : ''}`} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIndex ? "bg-primary-accent" : "bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}

        {product.model_3d && (
          <div className={`absolute top-3 ${lang === "en" ? "left-3" : "right-3"} bg-white/90 backdrop-blur text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
            {model3dText}
          </div>
        )}
      </a>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <span className="text-xs font-medium text-primary-accent mb-1 block">
            {category}
          </span>
          <a href={`${urlPrefix}/catalog/${product.id}`}>
            <h3 className="text-base font-bold text-primary-dark hover:text-primary-accent transition-colors line-clamp-1">
              {name}
            </h3>
          </a>
        </div>

        <p className="text-sm text-muted-text line-clamp-2 min-h-[40px]" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          {description}
        </p>

        <div className="pt-4 mt-auto border-t border-sand flex items-center justify-between gap-2">
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#25D366] text-white py-2 px-2 rounded-button text-sm font-semibold hover:bg-[#20bd5a] transition-colors whitespace-nowrap"
          >
            {quoteText}
          </a>
          <a
            href={`${urlPrefix}/catalog/${product.id}`}
            className="flex-1 text-center border border-primary-accent text-primary-accent py-2 px-4 rounded-button text-sm font-semibold hover:bg-primary-accent hover:text-white transition-colors"
          >
            {detailsText}
          </a>
        </div>
      </div>
    </div>
  );
}
