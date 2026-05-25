import { error } from '@sveltejs/kit';
import { isLang, messages } from '$lib/data/site';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params, url }) => {
  if (!isLang(params.lang)) {
    error(404, 'Language not found');
  }

  return {
    lang: params.lang,
    messages: messages[params.lang],
    htmlLang: messages[params.lang].htmlLang,
    path: url.pathname
  };
};
