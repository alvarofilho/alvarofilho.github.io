import { error } from '@sveltejs/kit';
import { getDraftPost, getDraftPostsByLang } from '$lib/data/posts';
import { languages } from '$lib/data/site';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => {
  return languages.flatMap((lang) =>
    getDraftPostsByLang(lang).map((post) => ({ lang, slug: post.slug }))
  );
};

export const load: PageLoad = async ({ params, parent }) => {
  const { lang } = await parent();
  const post = getDraftPost(lang, params.slug);

  if (!post) {
    error(404, 'Draft not found');
  }

  return { post };
};
