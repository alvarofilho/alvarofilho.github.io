<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    chart: string;
    title?: string;
  };

  type MermaidApi = typeof import('mermaid').default;

  let { chart, title }: Props = $props();
  let svg = $state('');
  let failed = $state(false);
  let isLoading = $state(false);

  let mermaidPromise: Promise<MermaidApi> | undefined;

  function getMermaid() {
    mermaidPromise ??= import('mermaid').then((module) => module.default);
    return mermaidPromise;
  }

  function getTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'base' : 'dark';
  }

  async function renderDiagram() {
    if (svg || isLoading || failed) {
      return;
    }

    isLoading = true;

    try {
      const mermaid = await getMermaid();
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: getTheme(),
        themeVariables: {
          primaryColor: '#131313',
          primaryTextColor: '#edeae5',
          primaryBorderColor: '#282828',
          lineColor: '#e05c3a',
          fontFamily: 'JetBrains Mono, monospace'
        }
      });

      const id = `mermaid-${crypto.randomUUID()}`;
      const result = await mermaid.render(id, chart);
      svg = result.svg;
    } catch (error) {
      failed = true;
      console.error('Mermaid render failed', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    void renderDiagram();
  });
</script>

<figure class="diagram-block">
  {#if title}
    <figcaption>{title}</figcaption>
  {/if}
  <div class="diagram-surface">
    {#if svg}
      {@html svg}
    {:else if failed}
      <pre>{chart}</pre>
    {:else if isLoading}
      <pre>rendering diagram...</pre>
    {:else}
      <pre>{chart}</pre>
    {/if}
  </div>
</figure>
