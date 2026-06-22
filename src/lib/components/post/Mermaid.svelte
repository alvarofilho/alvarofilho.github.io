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
  let isFullscreen = $state(false);

  // Pan & zoom state
  let panX = $state(0);
  let panY = $state(0);
  let zoom = $state(1);
  let isDragging = $state(false);
  let lastPointerX = 0;
  let lastPointerY = 0;

  let mermaidPromise: Promise<MermaidApi> | undefined;
  const diagramLabel = $derived(title ?? 'diagram');
  const trimmedChart = $derived(chart.trim());
  const zoomPercent = $derived(Math.round(zoom * 100));

  function getMermaid() {
    mermaidPromise ??= import('mermaid').then((m) => m.default);
    return mermaidPromise;
  }

  function getTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'base' : 'dark';
  }

  async function renderDiagram(force = false) {
    if ((svg || isLoading || failed) && !force) return;

    if (force) {
      svg = '';
      failed = false;
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
      const result = await mermaid.render(id, trimmedChart);
      // Strip fixed pixel dimensions so the SVG scales as a vector (prevents blur on zoom)
      svg = result.svg.replace(/ width="[^"]*"/, '').replace(/ height="[^"]*"/, '');
    } catch (error) {
      failed = true;
      console.error('Mermaid render failed', error);
    } finally {
      isLoading = false;
    }
  }

  function openFullscreen() {
    panX = 0;
    panY = 0;
    zoom = 1;
    isFullscreen = true;
  }

  function closeFullscreen() {
    isFullscreen = false;
  }

  function resetView() {
    panX = 0;
    panY = 0;
    zoom = 1;
  }

  function zoomIn() {
    zoom = Math.min(zoom * 1.25, 6);
  }

  function zoomOut() {
    zoom = Math.max(zoom * 0.8, 0.15);
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    panX += e.clientX - lastPointerX;
    panY += e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onOverlayKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeFullscreen();
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
    if (e.key === '0') resetView();
  }

  // Non-passive wheel handler (must be registered via addEventListener)
  function useWheelZoom(node: HTMLElement) {
    function handler(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      zoom = Math.min(Math.max(zoom * delta, 0.15), 6);
    }
    node.addEventListener('wheel', handler, { passive: false });
    return { destroy: () => node.removeEventListener('wheel', handler) };
  }

  $effect(() => {
    document.body.classList.toggle('diagram-fullscreen', isFullscreen);
  });

  onMount(() => {
    void renderDiagram();
  });
</script>

{#if isFullscreen}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="diagram-fs"
    class:dragging={isDragging}
    role="dialog"
    aria-modal="true"
    aria-label={diagramLabel}
    onkeydown={onOverlayKeydown}
    tabindex="-1"
    use:useWheelZoom
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
  >
    <div
      class="diagram-fs-canvas"
      style="transform: translate({panX}px, {panY}px) scale({zoom}); transform-origin: center center;"
    >
      {@html svg}
    </div>

    <div class="diagram-fs-bar" role="toolbar" aria-label="Controles do diagrama" tabindex="-1" onpointerdown={(e) => e.stopPropagation()}>
      {#if title}
        <span class="diagram-fs-title">{title}</span>
      {/if}
      <div class="diagram-fs-actions">
        <button type="button" onclick={zoomOut} title="Diminuir zoom (-)">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 7h4M12 12l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <span class="diagram-fs-zoom">{zoomPercent}%</span>
        <button type="button" onclick={zoomIn} title="Aumentar zoom (+)">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 5v4M5 7h4M12 12l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="diagram-fs-sep"></div>
        <button type="button" onclick={resetView} title="Resetar vista (0)">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="diagram-fs-sep"></div>
        <button type="button" onclick={closeFullscreen} title="Fechar (Esc)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<figure class="diagram-block">
  <figcaption class="diagram-header">
    {#if title}
      <span>{title}</span>
    {:else}
      <span></span>
    {/if}
    <div class="diagram-controls" role="toolbar" aria-label="Controles do diagrama">
      {#if svg}
        <button
          type="button"
          onclick={openFullscreen}
          aria-label="Tela cheia"
          title="Tela cheia"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      {/if}

      <button
        type="button"
        onclick={() => renderDiagram(true)}
        aria-label="Renderizar novamente"
        title="Renderizar novamente"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 8a5.5 5.5 0 1 0 1-3.18M2.5 2v3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </figcaption>

  <div
    class="diagram-surface"
    role={svg ? 'img' : undefined}
    aria-label={svg ? diagramLabel : undefined}
  >
    {#if svg}
      {@html svg}
    {:else if failed}
      <pre>{trimmedChart}</pre>
    {:else if isLoading}
      <pre aria-live="polite">rendering diagram...</pre>
    {:else}
      <pre>{trimmedChart}</pre>
    {/if}
  </div>
</figure>
