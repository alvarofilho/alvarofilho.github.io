import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  canonicalizePath,
  getBlogPath,
  getBlogArticleRoute,
  getHomePath,
  getRssPath,
  getSiteAlternates,
  isBlogPath,
  isBlogIndexPath
} from './url-policy';

describe('URL policy', () => {
  it('keeps the Portuguese home page at the root and generates stable localized paths', () => {
    expect(getHomePath('pt')).toBe('/');
    expect(getHomePath('en')).toBe('/en/');
    expect(getBlogPath('pt')).toBe('/pt/blog/');
    expect(getRssPath('en')).toBe('/en/blog/rss.xml');
  });

  it('uses the root as the canonical Portuguese home URL', () => {
    expect(canonicalizePath('/pt/')).toBe('/');
    expect(absoluteUrl('/pt/')).toBe('https://alvaro.dev.br/');
  });

  it('classifies published and internal blog routes explicitly', () => {
    expect(isBlogPath('/pt/blog/')).toBe(true);
    expect(isBlogIndexPath('/pt/blog/')).toBe(true);
    expect(getBlogArticleRoute('/en/blog/an-article/')).toEqual({ lang: 'en', slug: 'an-article' });
    expect(getBlogArticleRoute('/pt/blog/drafts/')).toEqual({ lang: 'pt', slug: 'drafts' });
    expect(getBlogArticleRoute('/pt/blog/components/example/')).toBeUndefined();
    expect(isBlogIndexPath('/en/')).toBe(false);
  });

  it('returns Portuguese, English, and x-default alternates for the home page', () => {
    expect(getSiteAlternates()).toEqual([
      { hreflang: 'pt-BR', path: '/' },
      { hreflang: 'en', path: '/en/' },
      { hreflang: 'x-default', path: '/' }
    ]);
  });
});
