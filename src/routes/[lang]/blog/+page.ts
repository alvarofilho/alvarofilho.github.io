import { getAllPostsForLang } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { lang } = await parent();
  return {
    posts: getAllPostsForLang(lang)
  };
};
