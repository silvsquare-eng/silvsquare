import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';

export function CatalogPage({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Extract unique categories
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filter products
  const filteredProducts = selectedCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20">
      <div className="content-max-width px-5 md:px-10">
        
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-accent transition-colors mb-4">
            <ChevronRight className="w-4 h-4 ml-1" />
            العودة للرئيسية
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">كتالوج المنتجات</h1>
          <p className="text-neutral-500 mt-2">تصفح مجموعة منتجاتنا المتنوعة واطلب تسعيرة مباشرة</p>
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
            <ProductCard key={index} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
