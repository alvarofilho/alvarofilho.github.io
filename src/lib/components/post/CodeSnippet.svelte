<script lang="ts">
  import { getContext } from 'svelte';
  import type { Messages } from '$lib/data/site';

  type Props = {
    code: string;
    lang?: string;
    title?: string;
  };

  let { code, lang = 'text', title }: Props = $props();
  let copied = $state(false);
  let highlighted = $state('');
  let highlightFailed = $state(false);
  let highlightRun = 0;

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const copyLabel = $derived(getMessages?.()?.text.codeCopy ?? 'copy');
  const copiedLabel = $derived(getMessages?.()?.text.codeCopied ?? 'copied');
  const trimmedCode = $derived(code.trim());
  const codeLabel = $derived(title || lang);

  $effect(() => {
    trimmedCode;
    lang;
    void highlightCode();
  });

  async function highlightCode() {
    const run = ++highlightRun;
    highlighted = '';
    highlightFailed = false;

    try {
      const { codeToHtml } = await import('shiki');
      const html = await codeToHtml(trimmedCode, {
        lang,
        theme: 'github-dark'
      });

      if (run === highlightRun) {
        highlighted = html;
      }
    } catch (error) {
      if (run === highlightRun) {
        highlightFailed = true;
      }

      console.error('Code highlight failed', error);
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(trimmedCode);
    copied = true;
    window.setTimeout(() => (copied = false), 1400);
  }
</script>

<figure class="code-snippet">
  <figcaption>
    <span class="lang-label">{codeLabel}</span>
    <button type="button" onclick={copyCode} aria-label={`${copyLabel}: ${codeLabel}`} aria-live="polite">
      {copied ? copiedLabel : copyLabel}
    </button>
  </figcaption>
  {#if highlighted && !highlightFailed}
    {@html highlighted}
  {:else}
    <pre><code class="language-{lang}">{trimmedCode}</code></pre>
  {/if}
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
