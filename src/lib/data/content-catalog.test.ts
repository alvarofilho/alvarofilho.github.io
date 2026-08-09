import { describe, expect, it } from 'vitest';
import { createContentCatalog, type PostSeed } from './posts';

const seeds: PostSeed[] = [
  {
    title: 'Portuguese post', description: 'A post in Portuguese', date: '2026-06-01', tags: ['Svelte'],
    lang: 'pt', slug: 'post', draft: false, translationKey: 'post'
  },
  {
    title: 'English post', description: 'A post in English', date: '2026-06-02', tags: ['Svelte'],
    lang: 'en', slug: 'post', draft: false, translationKey: 'post'
  },
  {
    title: 'Draft', description: 'Not published', date: '2026-06-03', tags: ['Svelte'],
    lang: 'pt', slug: 'draft', draft: true
  }
];

describe('content catalog', () => {
  it('keeps Drafts out of public discovery while exposing them through their own interface', () => {
    const catalog = createContentCatalog(seeds);

    expect(catalog.getPublishedPosts()).toHaveLength(2);
    expect(catalog.getPublishedPost('pt', 'draft')).toBeUndefined();
    expect(catalog.getDraftPost('pt', 'draft')?.title).toBe('Draft');
  });

  it('resolves Language Variants and stable Post paths from one interface', () => {
    const catalog = createContentCatalog(seeds);
    const post = catalog.getPublishedPost('pt', 'post');

    expect(post).toBeDefined();
    expect(catalog.getTranslatedPost(post!, 'en')?.title).toBe('English post');
    expect(catalog.getPostPath(post!)).toBe('/pt/blog/post/');
    expect(catalog.getAvailableLangs(post!)).toEqual(['en', 'pt']);
  });

  it('falls back by slug when a requested language does not have the published Post', () => {
    const catalog = createContentCatalog(seeds);

    expect(catalog.findPublishedPostBySlug('post', ['en', 'pt'])?.lang).toBe('en');
  });
});
