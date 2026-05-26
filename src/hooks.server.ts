import type { Handle } from '@sveltejs/kit';

function getHtmlLang(pathname: string) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt-BR';
}

export const handle: Handle = async ({ event, resolve }) => {
  const htmlLang = getHtmlLang(event.url.pathname);

  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
    transformPageChunk: ({ html }) => html.replace('<html lang="pt-BR">', `<html lang="${htmlLang}">`)
  });

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
};
