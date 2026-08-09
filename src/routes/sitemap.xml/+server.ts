import { contentCatalog } from '$lib/data/posts';
import { languageConfig } from '$lib/data/site';
import { absoluteUrl, getBlogAlternates, getBlogPath, getHomePath, getSiteAlternates } from '$lib/data/url-policy';
import type { RequestHandler } from './$types';

export const prerender = true;

type AlternateLink = {
  hreflang: string;
  path: string;
};

function url(path: string, priority: string, changefreq: string, alternates: AlternateLink[] = []) {
  return `
  <url>
    <loc>${absoluteUrl(path)}</loc>
    ${alternates
      .map(
        (alternate) =>
          `<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${absoluteUrl(alternate.path)}" />`
      )
      .join('')}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: RequestHandler = () => {
  const homeAlternates = getSiteAlternates();
  const blogAlternates = getBlogAlternates();

  const staticUrls = [
    url(getHomePath('pt'), '1.0', 'monthly', homeAlternates),
    url(getHomePath('en'), '1.0', 'monthly', homeAlternates),
    url(getBlogPath('pt'), '0.9', 'weekly', blogAlternates),
    url(getBlogPath('en'), '0.9', 'weekly', blogAlternates)
  ];

  const postUrls = contentCatalog.getPublishedPosts().map((post) =>
    url(
      contentCatalog.getPostPath(post),
      '0.8',
      'monthly',
      contentCatalog.getPostVariants(post).map((variant) => ({
        hreflang: languageConfig[variant.lang].htmlLang,
        path: contentCatalog.getPostPath(variant)
      }))
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">${[...staticUrls, ...postUrls].join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
