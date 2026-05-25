import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      highlight: false
    })
  ],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    prerender: {
      handleHttpError: ({ path, message }) => {
        // Static assets in /images/ and /icons/ are not SvelteKit routes — ignore 404s
        if (path.startsWith('/images/') || path.startsWith('/icons/')) return;
        throw new Error(message);
      },
      handleUnseenRoutes: ({ routes }) => {
        const unexpected = routes.filter((route) => route !== '/[lang]/blog/drafts/[slug]');
        if (unexpected.length) {
          console.warn(`Unseen prerender routes:\n${unexpected.map((route) => `  - ${route}`).join('\n')}`);
        }
      }
    }
  }
};

export default config;
