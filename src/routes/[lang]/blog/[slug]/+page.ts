import { error, redirect } from '@sveltejs/kit';
import { contentCatalog } from '$lib/data/posts';
import { languages } from '$lib/data/site';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
  languages.flatMap((lang) => contentCatalog.getPostsByLang(lang).map((post) => ({ lang, slug: post.slug })));

export const load: PageLoad = async ({ params, parent }) => {
  const { lang } = await parent();
  const post = contentCatalog.getPublishedPost(lang, params.slug);

  if (!post) {
    const fallbackLangs = ['en', 'pt', ...languages.filter((l) => l !== 'en' && l !== 'pt')] as const;
    for (const fallbackLang of fallbackLangs) {
      const fallback = contentCatalog.getPublishedPost(fallbackLang, params.slug);
      if (fallback) {
        redirect(302, contentCatalog.getPostPath(fallback));
      }
    }
    error(404, 'Post not found');
  }

  return {
    post,
    relatedPosts: contentCatalog.getRelatedPosts(post),
    availableLangs: contentCatalog.getAvailableLangs(post)
  };
};
