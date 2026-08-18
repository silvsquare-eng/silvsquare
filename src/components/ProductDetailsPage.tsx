import { useState, useEffect } from "react";
import { ChevronRight, MessageCircle, Box } from "lucide-react";
import { Reviews } from "@/components/Reviews";
import type { Product } from "@/components/ProductCard";
import { SITE_CONFIG, getRepNumber } from "@/config/site";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

export interface DetailedProduct extends Product {
  rating: number;
  reviews: any[];
}

export function ProductDetailsPage({ product, lang = "ar" }: { product: DetailedProduct, lang?: "ar" | "en" }) {
  const optionsToUse = lang === "en" && product.options_en ? product.options_en : product.options;
  
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    if (optionsToUse) {
      Object.entries(optionsToUse).forEach(([key, values]) => {
        if (values && values.length > 0) initial[key] = values[0];
      });
    }
    return initial;
  });

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const [show3D, setShow3D] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const [origin, setOrigin] = useState("");
  const [repId, setRepId] = useState<string | null>(null);

  // Load model-viewer only on client-side and set origin
  useEffect(() => {
    setOrigin(window.location.origin);
    setRepId(localStorage.getItem("sales_rep"));
    if (typeof window !== "undefined") {
      import("@google/model-viewer").catch(console.error);
    }
  }, []);

  // Reset view when options change
  useEffect(() => {
    setActiveImageIndex(null);
    setShow3D(false);
  }, [selectedOptions]);

  const loadingText = lang === "en" ? "Loading product..." : "جاري تحميل المنتج...";
  
  if (!product)
    return (
      <div className="pt-32 text-center h-screen">{loadingText}</div>
    );

  const baseName = lang === "en" && product.name_en ? product.name_en : product.name;
  const baseCategory = lang === "en" && product.category_en ? product.category_en : product.category;
  const baseDescription = lang === "en" && product.description_en ? product.description_en : product.description;

  let dynamicName = baseName;
  let dynamicSku = product.id;

  if (selectedOptions) {
    const optionsString = Object.values(selectedOptions)
      .filter(Boolean)
      .join(" - ");
    if (optionsString) {
      dynamicName = `${baseName} - ${optionsString}`;
      dynamicSku = `${product.id}-${Object.values(selectedOptions)
        .filter(Boolean)
        .map((v) => v.replace(/\s+/g, ""))
        .join("-")}`;
    }
  }

  const urlPrefix = lang === "en" ? "/en" : "";

  const buildWhatsAppLink = () => {
    const productUrl = `${origin || "https://silvsquaresa.pages.dev"}${urlPrefix}/catalog/${product.id}`;

    const phoneNumber = getRepNumber(repId);
    const imageUrl = getColorImage();

    const greeting = lang === "en" 
      ? "Hello, I would like to order:\n"
      : "السلام عليكم، أريد طلب:\n";
    const productLabel = lang === "en" ? "📦 Product:" : "📦 المنتج:";
    const skuLabel = lang === "en" ? "🏷️ SKU:" : "🏷️ رمز المنتج (SKU):";
    const imageLabel = lang === "en" ? "🖼️ Image:" : "🖼️ صورة المنتج:";
    const detailsLabel = lang === "en" ? "Details:" : "التفاصيل:";

    let msg = `${greeting}${productUrl}\n\n`;
    msg += `${productLabel} ${dynamicName}\n`;
    msg += `${skuLabel} ${dynamicSku}\n`;
    if (imageUrl) {
      msg += `${imageLabel} ${imageUrl}\n`;
    }
    msg += `\n${detailsLabel}\n`;
    Object.entries(selectedOptions).forEach(([key, value]) => {
      msg += `- ${key}: ${value}\n`;
    });
    const encodedMsg = encodeURIComponent(msg);
    return `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
  };

  const getMarketingDescription = () => {
    return lang === "en" 
      ? "Specially designed to meet the needs of restaurants and cafes. It professionally reflects your brand identity and features high quality that withstands intensive use, ensuring an excellent serving experience for your customers and raising their satisfaction level."
      : "مصمم خصيصاً لتلبية احتياجات المطاعم والكافيهات. يعكس هوية علامتك التجارية بشكل احترافي، ويتميز بجودة عالية تتحمل الاستخدام المكثف، مما يضمن تجربة تقديم ممتازة لعملائك ويرفع من مستوى رضاهم.";
  };

  const getColorImage = () => {
    // 1. Check explicitly mapped option images first
    if (product?.option_images) {
      for (const [key, selectedValue] of Object.entries(selectedOptions)) {
        if (selectedValue && product.option_images[selectedValue]) {
          return product.option_images[selectedValue];
        }
      }
    }

    // 2. Fallback to guessing by order for color-like keys (legacy support)
    const colorKey = Object.keys(optionsToUse || {}).find(
      (k) => k.toLowerCase() === "colors" || k === "اللون" || k === "color"
    );
    if (!product || !colorKey) return product?.main_image;

    const selectedColor = selectedOptions[colorKey];
    if (!selectedColor) return product.main_image;

    const colorIndex = optionsToUse[colorKey].indexOf(selectedColor);
    if (colorIndex === 0) return product.main_image;
    if (
      colorIndex > 0 &&
      product.additional_images &&
      product.additional_images.length >= colorIndex
    ) {
      return product.additional_images[colorIndex - 1];
    }
    return product.main_image;
  };

  const displayImage =
    activeImageIndex !== null &&
    product.additional_images &&
    product.additional_images.length > activeImageIndex
      ? product.additional_images[activeImageIndex]
      : getColorImage();

  const backToCatalogText = lang === "en" 
    ? (SITE_CONFIG.ui_en?.view_catalog || "Back to Catalog")
    : (SITE_CONFIG.ui?.view_catalog || "العودة للكتالوج");

  const noImageText = lang === "en" ? "No image available" : "لا توجد صورة";
  const view3DText = lang === "en" ? "View 3D" : "عرض 3D";
  const viewImagesText = lang === "en" ? "View Images" : "عرض الصور";
  const forRestaurantsText = lang === "en" ? "🌟 For Restaurants & Cafes" : "🌟 لأصحاب المطاعم والكافيهات";
  const quoteText = lang === "en" 
    ? (SITE_CONFIG.ui_en?.request_product_quote || "Request Quote")
    : (SITE_CONFIG.ui?.request_product_quote || "طلب تسعيرة");
    
  const brandingTitle = lang === "en" ? "Printing & Branding Services" : "خدمات الطباعة والهوية البصرية";
  const brandingSubtitle = lang === "en" ? "Let your packaging tell your brand story" : "اجعل تغليفك يحكي قصة علامتك التجارية";
  const brandingDesc = lang === "en" 
    ? "Whether you need your logo printed in a simple, elegant single color, or want to implement a complete, consistent visual identity across all products (cups, bags, and boxes)... our team is ready to turn your vision into a professional reality that reflects the quality of your business and leaves an unforgettable impression on your customers."
    : "سواءً كنت تحتاج إلى طباعة شعارك بلون واحد بسيط وأنيق، أو ترغب في تنفيذ هوية بصرية كاملة متناسقة على جميع المنتجات (الأكواب، الأكياس، والبوكسات).. فريقنا مستعد لتحويل رؤيتك إلى واقع احترافي يعكس جودة مشروعك ويترك انطباعاً لا يُنسى لدى عملائك.";
  const brandingBtn = lang === "en" ? "Inquire about printing & customization" : "استفسر عن الطباعة والتخصيص";

  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20">
      <div className="content-max-width px-5 md:px-10">
        <a
          href={`${urlPrefix}/catalog`}
          className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-accent transition-colors mb-8"
        >
          <ChevronRight className={`w-4 h-4 ${lang === 'en' ? 'mr-1 rotate-180' : 'ml-1'}`} />
          {backToCatalogText}
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative">
              {show3D && product.model_3d ? (
                // @ts-ignore
                <model-viewer
                  src={product.model_3d}
                  alt={baseName}
                  auto-rotate
                  camera-controls
                  ar
                  style={{ width: "100%", height: "100%" }}
                />
              ) : displayImage ? (
                <img
                  src={displayImage}
                  alt={baseName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  {noImageText}
                </div>
              )}

              {/* 3D Toggle Button */}
              {product.model_3d && (
                <button
                  onClick={() => setShow3D(!show3D)}
                  className={`absolute top-4 ${lang === "en" ? "left-4" : "right-4"} bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:bg-white transition-colors z-10 flex items-center gap-2`}
                >
                  <Box className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm font-semibold text-primary-dark">
                    {show3D ? viewImagesText : view3DText}
                  </span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {/* Main Image Thumbnail */}
              <div
                className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${!show3D && activeImageIndex === null ? "border-primary-accent" : "border-transparent"}`}
                onClick={() => {
                  setActiveImageIndex(null);
                  setShow3D(false);
                }}
              >
                <img
                  src={getColorImage()}
                  alt={baseName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Additional Images Thumbnails */}
              {product.additional_images &&
                product.additional_images.map((img, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${!show3D && activeImageIndex === i ? "border-primary-accent" : "border-transparent"}`}
                    onClick={() => {
                      setActiveImageIndex(i);
                      setShow3D(false);
                    }}
                  >
                    <img
                      src={img}
                      alt={`${baseName} - ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary-accent mb-2">
              {baseCategory}
            </span>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">
              {dynamicName}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded">
                SKU: {dynamicSku}
              </span>
            </div>

            <p className="text-neutral-600 mb-6 leading-relaxed" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              {baseDescription}
            </p>

            <div className="bg-primary-accent/10 p-5 rounded-2xl mb-8 border border-primary-accent/20">
              <h3 className="font-semibold text-primary-dark mb-2 text-sm flex items-center gap-2">
                {forRestaurantsText}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                {getMarketingDescription()}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-10">
              {optionsToUse &&
                Object.entries(optionsToUse).map(([key, values]) => {
                  if (!values || values.length === 0) return null;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {key}:
                      </label>
                      <select
                        className={`w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent ${lang === 'en' ? 'text-left' : 'text-right'}`}
                        value={selectedOptions[key] || ""}
                        onChange={(e) =>
                          handleOptionChange(key, e.target.value)
                        }
                      >
                        {values.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
            </div>

            {/* Contact Action */}
            <div className="mt-auto pt-6 border-t border-neutral-100">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-lg font-bold transition-colors w-full"
              >
                <MessageCircle className="w-5 h-5" />{" "}
                {quoteText}
              </a>
            </div>
          </div>
        </div>

        {/* Branding & Printing Service Banner */}
        <div className="mt-16 bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
            <span className="text-sm font-bold text-primary-accent mb-3 block">{brandingTitle}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4 leading-snug">
              {brandingSubtitle}
            </h2>
            <p className="text-neutral-600 mb-8 leading-relaxed" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              {brandingDesc}
            </p>
            <button
              onClick={() => {
                window.open(buildWhatsAppLink(), '_blank');
              }}
              className="inline-flex w-fit items-center justify-center gap-2 bg-primary-dark hover:bg-primary-accent text-white py-3 px-8 rounded-xl font-semibold transition-colors"
            >
              {brandingBtn}
            </button>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <img 
              src="/branding-mockup.jpg" 
              alt={brandingTitle} 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <Reviews
            productId={product.id}
            initialReviews={product.reviews}
            initialRating={product.rating}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
