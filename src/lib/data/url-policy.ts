import { languageConfig, siteUrl, type Lang } from './site';

export type AlternateLink = {
  hreflang: string;
  path: string;
};

export function canonicalizePath(path: string) {
  return path === '/pt/' ? '/' : path;
}

export function absoluteUrl(path: string) {
  return `${siteUrl}${canonicalizePath(path)}`;
}

export function getHomePath(lang: Lang) {
  return lang === 'pt' ? '/' : `/${lang}/`;
}

export function getBlogPath(lang: Lang) {
  return `/${lang}/blog/`;
}

export function getDraftIndexPath(lang: Lang) {
  return `${getBlogPath(lang)}drafts/`;
}

export function getRssPath(lang: Lang) {
  return `${getBlogPath(lang)}rss.xml`;
}

export function getSiteAlternates(): AlternateLink[] {
  return [
    { hreflang: languageConfig.pt.htmlLang, path: getHomePath('pt') },
    { hreflang: languageConfig.en.htmlLang, path: getHomePath('en') },
    { hreflang: 'x-default', path: getHomePath('pt') }
  ];
}

export function getBlogAlternates(): AlternateLink[] {
  return [
    { hreflang: languageConfig.pt.htmlLang, path: getBlogPath('pt') },
    { hreflang: languageConfig.en.htmlLang, path: getBlogPath('en') }
  ];
}

export function getLocalizedPageAlternates(path: string): AlternateLink[] {
  if (path === '/' || path === '/pt/' || path === '/en/') {
    return getSiteAlternates().filter((alternate) => alternate.hreflang !== 'x-default');
  }

  const segments = path.split('/').filter(Boolean);
  return segments.length === 2 && segments[1] === 'blog' ? getBlogAlternates() : [];
}
