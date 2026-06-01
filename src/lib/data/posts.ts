import type { Lang } from './site';

export type PostMeta = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  lang: Lang;
  slug: string;
  draft: boolean;
  translationKey?: string;
  related?: string[];
  image?: string;
  searchText: string;
  readingTime: number;
};

type PostMetadata = Omit<PostMeta, 'searchText'> & { searchText?: string };

const postMetadata = import.meta.glob<PostMetadata>('/src/content/posts/**/*.svx', {
  eager: true,
  import: 'metadata'
});

export const allPosts = Object.values(postMetadata)
  .filter((metadata): metadata is PostMetadata => metadata != null && metadata.title != null)
  .map((metadata) => enrichPost(metadata))
  .sort((a, b) => b.date.localeCompare(a.date));

export const posts = allPosts
  .filter((post) => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const draftPosts = allPosts
  .filter((post) => post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

function enrichPost(post: PostMetadata): PostMeta {
  return {
    ...post,
    searchText: [post.title, post.description, post.tags.join(' '), post.slug]
      .join(' ')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
  };
}

export function getPostsByLang(lang: Lang) {
  return posts.filter((post) => post.lang === lang);
}

export function getAllPostsForLang(lang: Lang): PostMeta[] {
  const byKey = new Map<string, PostMeta>();

  for (const post of posts) {
    const key = post.translationKey;
    const existing = byKey.get(key);
    if (!existing || post.lang === lang) {
      byKey.set(key, post);
    }
  }

  return Array.from(byKey.values()).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(lang: Lang, slug: string) {
  return posts.find((post) => post.lang === lang && post.slug === slug);
}

export function getDraftPostsByLang(lang: Lang) {
  return draftPosts.filter((post) => post.lang === lang);
}

export function getDraftPost(lang: Lang, slug: string) {
  return draftPosts.find((post) => post.lang === lang && post.slug === slug);
}

export function getDraftPostPath(post: PostMeta) {
  return `/${post.lang}/blog/drafts/${post.slug}/`;
}

export function getPostPath(post: PostMeta) {
  return `/${post.lang}/blog/${post.slug}/`;
}

export function getTranslatedPost(post: PostMeta, lang: Lang) {
  return posts.find((candidate) => candidate.translationKey === post.translationKey && candidate.lang === lang);
}

export function getTranslatedDraftPost(post: PostMeta, lang: Lang) {
  return draftPosts.find((candidate) => candidate.translationKey === post.translationKey && candidate.lang === lang);
}

export function getAvailableLangs(post: PostMeta): Lang[] {
  return posts
    .filter((p) => p.translationKey === post.translationKey)
    .map((p) => p.lang);
}

export function getRelatedPosts(post: PostMeta): PostMeta[] {
  if (!post.related?.length) return [];

  return post.related
    .map((slug) => posts.find((p) => p.lang === post.lang && p.slug === slug))
    .filter((p): p is PostMeta => p !== undefined);
}
