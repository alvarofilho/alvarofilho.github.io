import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { visit } from 'unist-util-visit';

function remarkReadingTime() {
  function countWords(node) {
    if (node.type === 'text') {
      return node.value.trim().split(/\s+/).filter((w) => w.length > 0).length;
    }
    if (node.type === 'html') {
      const text = node.value.replace(/<[^>]*>/g, ' ').replace(/\{[\s\S]*?\}/g, ' ');
      return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    }
    if (node.children) {
      return node.children.reduce((sum, child) => sum + countWords(child), 0);
    }
    return 0;
  }

  return function (tree, file) {
    const words = countWords(tree);
    const readingTime = Math.max(1, Math.ceil(words / 200));
    file.data.fm ??= {};
    file.data.fm.readingTime = readingTime;
  };
}

function externalLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      node.data = node.data || {};
      node.data.hProperties = {
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    });
  };
}

  const config = {
    extensions: ['.svelte', '.svx'],
    preprocess: [
      vitePreprocess(),
      mdsvex({
        extensions: ['.svx'],
        highlight: false,
        remarkPlugins: [remarkReadingTime, externalLinks]
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
