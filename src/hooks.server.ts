import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const htmlLang = event.url.pathname === '/en' || event.url.pathname.startsWith('/en/') ? 'en' : 'pt-BR';

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="pt-BR">', `<html lang="${htmlLang}">`)
  });
};
