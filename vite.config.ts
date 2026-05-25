import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['mermaid', 'dayjs', '@braintree/sanitize-url']
  },
  build: {
    chunkSizeWarningLimit: 700
  }
});
