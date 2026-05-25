import { posts, getPostPath } from '$lib/data/posts';
import { siteUrl, languages } from '$lib/data/site';
import type { RequestHandler } from './$types';

export const prerender = true;

function url(path: string, priority: string, changefreq: string) {
  return `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: RequestHandler = () => {
  const staticUrls = languages.flatMap((lang) => [
    url(`/${lang}/`, '1.0', 'monthly'),
    url(`/${lang}/blog/`, '0.9', 'weekly'),
  ]);

  const postUrls = posts.map((post) =>
    url(getPostPath(post), '0.8', 'monthly')
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...postUrls].join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
