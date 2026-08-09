import { contentCatalog } from '$lib/data/posts';
import { languages } from '$lib/data/site';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => languages.map((lang) => ({ lang }));

export const load: PageLoad = async ({ parent }) => {
  const { lang } = await parent();

  return {
    drafts: contentCatalog.getDraftPostsByLang(lang)
  };
};
