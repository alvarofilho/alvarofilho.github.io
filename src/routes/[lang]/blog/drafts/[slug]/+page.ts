import { error } from '@sveltejs/kit';
import { contentCatalog } from '$lib/data/posts';
import { languages } from '$lib/data/site';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => {
  return languages.flatMap((lang) =>
    contentCatalog.getDraftPostsByLang(lang).map((post) => ({ lang, slug: post.slug }))
  );
};

export const load: PageLoad = async ({ params, parent }) => {
  const { lang } = await parent();
  const post = contentCatalog.getDraftPost(lang, params.slug);

  if (!post) {
    error(404, 'Draft not found');
  }

  return { post };
};
