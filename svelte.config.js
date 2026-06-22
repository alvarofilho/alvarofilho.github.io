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

// Mirror PostToc.svelte's slugify so build-time ids match runtime ids.
function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function headingText(node) {
  if (node.type === 'text' || node.type === 'raw') return node.value;
  if (node.value) return node.value;
  if (node.children) return node.children.map(headingText).join('');
  return '';
}

// Assign ids to h2/h3 at build time so in-page anchors resolve in prerendered HTML.
function rehypeHeadingIds() {
  return (tree) => {
    const seen = new Map();
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      if (node.properties?.id) return;
      const base = slugify(headingText(node)) || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      node.properties = node.properties || {};
      node.properties.id = count ? `${base}-${count + 1}` : base;
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
        remarkPlugins: [remarkReadingTime, externalLinks],
        rehypePlugins: [rehypeHeadingIds]
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
