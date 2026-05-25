<script lang="ts">
  import { getContext } from 'svelte';
  import { codeToHtml } from 'shiki';
  import type { Messages } from '$lib/data/site';

  type Props = {
    code: string;
    lang?: string;
    title?: string;
  };

  let { code, lang = 'text', title }: Props = $props();
  let copied = $state(false);

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const copyLabel = $derived(getMessages?.()?.text.codeCopy ?? 'copy');
  const copiedLabel = $derived(getMessages?.()?.text.codeCopied ?? 'copied');

  const highlighted = $derived(codeToHtml(code.trim(), {
    lang,
    theme: 'github-dark',
  }));

  async function copyCode() {
    await navigator.clipboard.writeText(code.trim());
    copied = true;
    window.setTimeout(() => (copied = false), 1400);
  }
</script>

<figure class="code-snippet">
  <figcaption>
    <span class="lang-label">{title || lang}</span>
    <button type="button" onclick={copyCode}>{copied ? copiedLabel : copyLabel}</button>
  </figcaption>
  {#await highlighted}
    <pre><code class="language-{lang}">{code.trim()}</code></pre>
  {:then html}
    {@html html}
  {/await}
</figure>

<style>
  figure :global(.shiki) {
    margin: 0;
    padding: 1.25rem 1.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.6;
    background-color: #0f0f0f !important;
  }
</style>
