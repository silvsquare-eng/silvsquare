import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';
import { SITE_CONFIG } from '@/config/site';

export function CatalogPage({
  products,
  catalog2Products = [],
  lang = 'ar',
  defaultCatalog = '1',
}: {
  products: Product[];
  catalog2Products?: Product[];
  lang?: 'ar' | 'en';
  defaultCatalog?: '1' | '2';
}) {
  const t = {
    all: lang === 'en' ? 'All' : 'الكل',
    back: lang === 'en' ? 'Back to Home' : 'العودة للرئيسية',
    title: lang === 'en' ? 'Products' : (SITE_CONFIG.ui?.products || 'المنتجات'),
    subtitle: lang === 'en' ? 'Browse our diverse product collection and request a quote directly' : (SITE_CONFIG.ui?.catalog_subtitle || 'تصفح مجموعة منتجاتنا المتنوعة واطلب تسعيرة مباشرة'),
  };

  const [activeCatalog, setActiveCatalog] = useState<'1' | '2'>(defaultCatalog);
  const [selectedCategory, setSelectedCategory] = useState<string>(t.all);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawCat = (params.get('cat') || params.get('catalog') || params.get('type') || '').trim().toLowerCase();

      let resolved: '1' | '2' = defaultCatalog;
      if (rawCat === '1') {
        resolved = '1';
      } else if (rawCat === '2' || defaultCatalog === '2') {
        resolved = '2';
      }

      if (resolved !== activeCatalog) {
        setActiveCatalog(resolved);
        setSelectedCategory(t.all);
      }
    } catch {
      // Ignore URL errors in restricted browser environments
    }
  }, [defaultCatalog]);

  const activeProducts = activeCatalog === '2' ? catalog2Products : products;

  // Extract unique categories based on lang
  const categories = [t.all, ...Array.from(new Set(activeProducts.map(p => lang === 'en' ? (p.category_en || p.category) : p.category).filter(Boolean)))];

  // Filter products
  const filteredProducts = selectedCategory === t.all 
    ? activeProducts 
    : activeProducts.filter(p => (lang === 'en' ? (p.category_en || p.category) : p.category) === selectedCategory);

  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20">
      <div className="content-max-width px-5 md:px-10" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        
        {/* Header */}
        <div className="mb-8">
          <a href={lang === 'en' ? '/en/' : '/'} className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-accent transition-colors mb-4">
            {lang === 'en' ? <ChevronLeft className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
            {t.back}
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">{t.title}</h1>
          <p className="text-neutral-500 mt-2">{t.subtitle}</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-accent text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-accent hover:text-primary-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id || index} product={product} lang={lang} />
          ))}
        </div>

      </div>
    </div>
  );
}
