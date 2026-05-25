import { posts, getPostPath } from '$lib/data/posts';
import { languageConfig, siteUrl } from '$lib/data/site';
import type { RequestHandler } from './$types';

export const prerender = true;

type AlternateLink = {
  hreflang: string;
  path: string;
};

function canonicalizePath(path: string) {
  return path === '/pt/' ? '/' : path;
}

function url(path: string, priority: string, changefreq: string, alternates: AlternateLink[] = []) {
  const canonicalPath = canonicalizePath(path);
  return `
  <url>
    <loc>${siteUrl}${canonicalPath}</loc>
    ${alternates
      .map(
        (alternate) =>
          `<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${siteUrl}${canonicalizePath(alternate.path)}" />`
      )
      .join('')}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: RequestHandler = () => {
  const homeAlternates = [
    { hreflang: languageConfig.pt.htmlLang, path: '/' },
    { hreflang: languageConfig.en.htmlLang, path: '/en/' },
    { hreflang: 'x-default', path: '/' }
  ];

  const staticUrls = [
    url('/', '1.0', 'monthly', homeAlternates),
    url('/en/', '1.0', 'monthly', homeAlternates),
    url('/pt/blog/', '0.9', 'weekly', [
      { hreflang: languageConfig.pt.htmlLang, path: '/pt/blog/' },
      { hreflang: languageConfig.en.htmlLang, path: '/en/blog/' }
    ]),
    url('/en/blog/', '0.9', 'weekly', [
      { hreflang: languageConfig.pt.htmlLang, path: '/pt/blog/' },
      { hreflang: languageConfig.en.htmlLang, path: '/en/blog/' }
    ])
  ];

  const postAlternates = new Map(
    posts.map((post) => [
      post.translationKey,
      posts
        .filter((candidate) => candidate.translationKey === post.translationKey)
        .map((candidate) => ({
          hreflang: languageConfig[candidate.lang].htmlLang,
          path: getPostPath(candidate)
        }))
    ])
  );

  const postUrls = posts.map((post) => url(getPostPath(post), '0.8', 'monthly', postAlternates.get(post.translationKey)));

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
