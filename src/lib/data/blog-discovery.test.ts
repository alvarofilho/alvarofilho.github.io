import { describe, expect, it } from 'vitest';
import { discoverBlogPosts, type BlogDiscoveryState } from './blog-discovery';
import type { PostMeta } from './posts';

const posts: PostMeta[] = Array.from({ length: 11 }, (_, index) => ({
  title: `Post ${index + 1}`,
  description: index === 0 ? 'Searchable example' : 'Other example',
  date: `2026-06-${String(index + 1).padStart(2, '0')}`,
  tags: index < 2 ? ['Svelte', 'TypeScript'] : ['TypeScript'],
  lang: 'pt',
  slug: `post-${index + 1}`,
  draft: false,
  readingTime: 1,
  searchText: `post ${index + 1} ${index === 0 ? 'searchable' : 'other'}`
}));

const state: BlogDiscoveryState = { query: '', selectedTags: [], page: 3 };

describe('blog discovery', () => {
  it('clamps an invalid page and exposes only the visible Posts', () => {
    const discovery = discoverBlogPosts(posts, state);

    expect(discovery.totalPages).toBe(2);
    expect(discovery.safePage).toBe(2);
    expect(discovery.visiblePosts).toHaveLength(1);
    expect(discovery.visiblePosts[0].slug).toBe('post-11');
  });

  it('combines text and tag filters while exposing compatible tags', () => {
    const discovery = discoverBlogPosts(posts, { query: 'searchable', selectedTags: ['Svelte'], page: 1 });

    expect(discovery.filteredPosts.map((post) => post.slug)).toEqual(['post-1']);
    expect(discovery.compatibleTagStats).toEqual([{ tag: 'TypeScript', count: 1 }]);
    expect(discovery.hasFilters).toBe(true);
  });
});
