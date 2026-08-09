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
  imageLight?: string;
  searchText: string;
  readingTime: number;
};

export type PostSeed = Omit<PostMeta, 'searchText' | 'readingTime'> & {
  searchText?: string;
  readingTime?: number;
};

type ContentCatalog = ReturnType<typeof createContentCatalog>;

export function createContentCatalog(seeds: readonly PostSeed[]) {
  const allPosts = seeds
    .filter((post): post is PostSeed & Pick<PostSeed, 'title' | 'description' | 'tags' | 'slug'> =>
      post != null && Boolean(post.title && post.description && post.tags && post.slug)
    )
    .map(enrichPost)
    .sort(sortByDate);
  const publishedPosts = allPosts.filter((post) => !post.draft);
  const draftPosts = allPosts.filter((post) => post.draft);
  const publishedByLanguageAndSlug = toLanguageAndSlugIndex(publishedPosts);
  const draftsByLanguageAndSlug = toLanguageAndSlugIndex(draftPosts);
  const publishedVariants = toTranslationIndex(publishedPosts);
  const draftVariants = toTranslationIndex(draftPosts);

  function getPublishedPosts() {
    return publishedPosts;
  }

  function getDraftPosts() {
    return draftPosts;
  }

  function getPostsByLang(lang: Lang) {
    return publishedPosts.filter((post) => post.lang === lang);
  }

  function getAllPostsForLang(lang: Lang) {
    const byKey = new Map<string, PostMeta>();
    for (const post of publishedPosts) {
      const key = post.translationKey || `${post.slug}-${post.lang}`;
      const existing = byKey.get(key);
      if (!existing || post.lang === lang) byKey.set(key, post);
    }
    return Array.from(byKey.values()).sort(sortByDate);
  }

  function getPublishedPost(lang: Lang, slug: string) {
    return publishedByLanguageAndSlug.get(indexKey(lang, slug));
  }

  function getDraftPostsByLang(lang: Lang) {
    return draftPosts.filter((post) => post.lang === lang);
  }

  function getDraftPost(lang: Lang, slug: string) {
    return draftsByLanguageAndSlug.get(indexKey(lang, slug));
  }

  function getPostPath(post: PostMeta) {
    return `/${post.lang}/blog/${post.slug}/`;
  }

  function getDraftPostPath(post: PostMeta) {
    return `/${post.lang}/blog/drafts/${post.slug}/`;
  }

  function getTranslatedPost(post: PostMeta, lang: Lang) {
    return getTranslation(publishedVariants, post, lang);
  }

  function getTranslatedDraftPost(post: PostMeta, lang: Lang) {
    return getTranslation(draftVariants, post, lang);
  }

  function getAvailableLangs(post: PostMeta) {
    if (!post.translationKey) return [post.lang];
    return (publishedVariants.get(post.translationKey) ?? []).map((variant) => variant.lang);
  }

  function getPostVariants(post: PostMeta) {
    return post.translationKey ? publishedVariants.get(post.translationKey) ?? [post] : [post];
  }

  function getRelatedPosts(post: PostMeta) {
    if (!post.related?.length) return [];
    return post.related
      .map((slug) => getPublishedPost(post.lang, slug))
      .filter((candidate): candidate is PostMeta => candidate !== undefined);
  }

  function findPublishedPostBySlug(slug: string, languageOrder: readonly Lang[]) {
    return languageOrder.map((lang) => getPublishedPost(lang, slug)).find(Boolean);
  }

  return {
    getPublishedPosts,
    getDraftPosts,
    getPostsByLang,
    getAllPostsForLang,
    getPublishedPost,
    getDraftPostsByLang,
    getDraftPost,
    getPostPath,
    getDraftPostPath,
    getTranslatedPost,
    getTranslatedDraftPost,
    getAvailableLangs,
    getPostVariants,
    getRelatedPosts,
    findPublishedPostBySlug
  };
}

function enrichPost(post: PostSeed): PostMeta {
  return {
    ...post,
    readingTime: post.readingTime ?? 1,
    searchText: post.searchText ?? [post.title, post.description, post.tags.join(' '), post.slug]
      .join(' ')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
  };
}

function sortByDate(a: PostMeta, b: PostMeta) {
  return b.date.localeCompare(a.date);
}

function indexKey(lang: Lang, slug: string) {
  return `${lang}:${slug}`;
}

function toLanguageAndSlugIndex(posts: readonly PostMeta[]) {
  return new Map(posts.map((post) => [indexKey(post.lang, post.slug), post]));
}

function toTranslationIndex(posts: readonly PostMeta[]) {
  const index = new Map<string, PostMeta[]>();
  for (const post of posts) {
    if (!post.translationKey) continue;
    const variants = index.get(post.translationKey) ?? [];
    variants.push(post);
    index.set(post.translationKey, variants);
  }
  return index;
}

function getTranslation(index: Map<string, PostMeta[]>, post: PostMeta, lang: Lang) {
  if (!post.translationKey) return undefined;
  return index.get(post.translationKey)?.find((candidate) => candidate.lang === lang);
}

const postMetadata = import.meta.glob<PostSeed>('/src/content/posts/**/*.svx', {
  eager: true,
  import: 'metadata'
});

export const contentCatalog: ContentCatalog = createContentCatalog(Object.values(postMetadata));

// Compatibility exports for existing callers. New code should use contentCatalog as its single interface.
export const allPosts = contentCatalog.getPublishedPosts().concat(contentCatalog.getDraftPosts()).sort(sortByDate);
export const posts = contentCatalog.getPublishedPosts();
export const draftPosts = contentCatalog.getDraftPosts();
export const getPostsByLang = contentCatalog.getPostsByLang;
export const getAllPostsForLang = contentCatalog.getAllPostsForLang;
export const getPost = contentCatalog.getPublishedPost;
export const getDraftPostsByLang = contentCatalog.getDraftPostsByLang;
export const getDraftPost = contentCatalog.getDraftPost;
export const getDraftPostPath = contentCatalog.getDraftPostPath;
export const getPostPath = contentCatalog.getPostPath;
export const getTranslatedPost = contentCatalog.getTranslatedPost;
export const getTranslatedDraftPost = contentCatalog.getTranslatedDraftPost;
export const getAvailableLangs = contentCatalog.getAvailableLangs;
export const getRelatedPosts = contentCatalog.getRelatedPosts;
