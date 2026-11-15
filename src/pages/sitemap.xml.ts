import type { APIRoute } from 'astro';
import catalogData from '@/data/catalog.json';
import catalog2Data from '@/data/catalog2.json';
import { SITE_URL } from '@/utils/seo';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildBilingualEntry(arPath: string, enPath: string, priority: string, changefreq: string, lastmod: string): string[] {
  const arUrl = escapeXml(`${SITE_URL}${arPath}`);
  const enUrl = escapeXml(`${SITE_URL}${enPath}`);

  return [
    [
      '  <url>',
      `    <loc>${arUrl}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}" />`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n'),
    [
      '  <url>',
      `    <loc>${enUrl}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}" />`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n'),
  ];
}

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  const entries: string[] = [
    ...buildBilingualEntry('/', '/en/', '1.0', 'weekly', lastmod),
    ...buildBilingualEntry('/catalog/', '/en/catalog/', '0.9', 'weekly', lastmod),
    ...buildBilingualEntry('/catalog2/', '/en/catalog2/', '0.9', 'weekly', lastmod),
  ];

  const seenIds = new Set<string>();
  for (const product of [...catalogData, ...catalog2Data]) {
    if (!product?.id || seenIds.has(product.id)) continue;
    seenIds.add(product.id);
    const encodedId = encodeURIComponent(product.id);
    entries.push(
      ...buildBilingualEntry(`/catalog/${encodedId}/`, `/en/catalog/${encodedId}/`, '0.8', 'weekly', lastmod)
    );
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
