export const SITE_URL = 'https://catalog.silvsquare.com';

interface SchemaProduct {
  id: string;
  name: string;
  name_en?: string;
}

/**
 * Builds a Schema.org CollectionPage + ItemList payload for catalog index pages.
 */
export function buildCollectionSchema({
  name,
  description,
  url,
  lang,
  products,
  basePath,
}: {
  name: string;
  description: string;
  url: string;
  lang: 'ar' | 'en';
  products: SchemaProduct[];
  basePath: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: lang === 'en' ? 'en-US' : 'ar-SA',
    isPartOf: {
      '@type': 'WebSite',
      name: lang === 'en' ? 'Silver Square Packaging' : 'المربع الفضي للتعبئة والتغليف',
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${basePath}/${encodeURIComponent(product.id)}/`,
        name: lang === 'en' ? product.name_en || product.name : product.name,
      })),
    },
  };
}

/**
 * Builds a Schema.org BreadcrumbList payload for product detail pages.
 */
export function buildProductBreadcrumbSchema({
  lang,
  isCatalog2,
  productId,
  productName,
}: {
  lang: 'ar' | 'en';
  isCatalog2: boolean;
  productId: string;
  productName: string;
}) {
  const prefix = lang === 'en' ? '/en' : '';
  const homeLabel = lang === 'en' ? 'Home' : 'الرئيسية';
  const catalogLabel = lang === 'en'
    ? (isCatalog2 ? 'Second Catalog' : 'Products')
    : (isCatalog2 ? 'الكتالوج الثاني' : 'المنتجات');
  const catalogPath = isCatalog2 ? `${prefix}/catalog2/` : `${prefix}/catalog/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${SITE_URL}${prefix}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: catalogLabel,
        item: `${SITE_URL}${catalogPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `${SITE_URL}${prefix}/catalog/${encodeURIComponent(productId)}/`,
      },
    ],
  };
}
