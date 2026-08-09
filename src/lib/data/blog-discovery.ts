import Fuse from 'fuse.js';
import type { PostMeta } from './posts';

export const POSTS_PER_PAGE = 10;
export const POPULAR_TAG_LIMIT = 8;

export type BlogDiscoveryState = {
  query: string;
  selectedTags: string[];
  page: number;
  tagQuery?: string;
};

export type TagStat = {
  tag: string;
  count: number;
};

export function discoverBlogPosts(posts: readonly PostMeta[], state: BlogDiscoveryState) {
  const query = state.query.trim();
  const selectedTags = state.selectedTags;
  const textMatches = query ? createSearch(posts).search(query).map((result) => result.item) : [...posts];
  const filteredPosts = textMatches.filter((post) => selectedTags.every((tag) => post.tags.includes(tag)));
  const compatibleTagStats = getCompatibleTagStats(filteredPosts, selectedTags);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.max(1, Math.min(state.page, totalPages));

  return {
    filteredPosts,
    compatibleTagStats,
    matchingTags: compatibleTagStats.filter(({ tag }) =>
      normalizeBlogSearch(tag).includes(normalizeBlogSearch(state.tagQuery ?? ''))
    ),
    popularTags: compatibleTagStats.slice(0, POPULAR_TAG_LIMIT),
    hasHiddenTags: compatibleTagStats.length > POPULAR_TAG_LIMIT,
    hasFilters: Boolean(query) || selectedTags.length > 0,
    totalPages,
    safePage,
    visiblePosts: filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE)
  };
}

export function normalizeBlogSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function createSearch(posts: readonly PostMeta[]) {
  return new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'description', weight: 0.35 },
      { name: 'tags', weight: 0.15 },
      { name: 'searchText', weight: 0.05 }
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
    shouldSort: true,
    useExtendedSearch: true
  });
}

function getCompatibleTagStats(posts: readonly PostMeta[], selectedTags: readonly string[]): TagStat[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!selectedTags.includes(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
