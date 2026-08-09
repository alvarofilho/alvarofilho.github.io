import { contentCatalog } from '$lib/data/posts';
import { languageConfig, isLang, languages } from '$lib/data/site';
import { absoluteUrl, getBlogPath, getRssPath } from '$lib/data/url-policy';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => languages.map((lang) => ({ lang }));

export const GET: RequestHandler = ({ params }) => {
  const lang = params.lang;
  if (!isLang(lang)) error(404);

  const config = languageConfig[lang];
  const posts = contentCatalog.getPostsByLang(lang);

  const title = lang === 'pt' ? 'Blog — Álvaro Duarte' : 'Blog — Álvaro Duarte';
  const description =
    lang === 'pt'
      ? 'Engenharia de produto aplicada a sistemas confiáveis.'
      : 'Product engineering applied to reliable systems.';

  const items = posts
    .map((post) => {
      const link = absoluteUrl(contentCatalog.getPostPath(post));
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${absoluteUrl(getBlogPath(lang))}</link>
    <description>${description}</description>
    <language>${config.htmlLang}</language>
    <atom:link href="${absoluteUrl(getRssPath(lang))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
