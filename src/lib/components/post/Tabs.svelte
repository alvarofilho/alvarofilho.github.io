<script module lang="ts">
  let tabsCount = 0;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';

  type Props = {
    labels: string[];
    children?: Snippet;
  };

  let { labels, children }: Props = $props();
  let activeLabel = $state('');
  let tabRefs: Array<HTMLButtonElement | null> = [];

  const tabsId = `tabs-${tabsCount++}`;

  $effect(() => {
    if (!labels.includes(activeLabel)) {
      activeLabel = labels[0] ?? '';
    }
  });

  function getTabId(label: string) {
    return `${tabsId}-tab-${labels.indexOf(label)}`;
  }

  function getPanelId(label: string) {
    return `${tabsId}-panel-${labels.indexOf(label)}`;
  }

  function activateTab(label: string) {
    if (labels.includes(label)) {
      activeLabel = label;
    }
  }

  function focusTab(index: number) {
    const normalizedIndex = (index + labels.length) % labels.length;
    const label = labels[normalizedIndex];

    if (!label) return;

    activateTab(label);
    tabRefs[normalizedIndex]?.focus();
  }

  function onTabKeydown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusTab(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(labels.length - 1);
        break;
    }
  }

  function tabRef(node: HTMLButtonElement, index: number) {
    tabRefs[index] = node;

    return {
      update(nextIndex: number) {
        if (nextIndex === index) return;
        tabRefs[index] = null;
        index = nextIndex;
        tabRefs[index] = node;
      },
      destroy() {
        tabRefs[index] = null;
      }
    };
  }

  setContext('tabs', {
    get active() {
      return activeLabel;
    },
    activate: activateTab,
    getTabId,
    getPanelId
  });
</script>

<div class="tabs-block">
  <div class="tabs-nav" role="tablist" aria-orientation="horizontal">
    {#each labels as label, index}
      <button
        type="button"
        use:tabRef={index}
        role="tab"
        class:active={activeLabel === label}
        id={getTabId(label)}
        aria-selected={activeLabel === label}
        aria-controls={getPanelId(label)}
        tabindex={activeLabel === label ? 0 : -1}
        onclick={() => activateTab(label)}
        onkeydown={(event) => onTabKeydown(event, index)}
      >{label}</button>
    {/each}
  </div>
  <div class="tabs-panels">
    {@render children?.()}
  </div>
</div>

<style>
  .tabs-block {
    margin: 1.7rem 0;
    border: 1px solid var(--border-l);
  }

  .tabs-nav {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    background: var(--card);
    border-bottom: 1px solid var(--border-l);
  }

  .tabs-nav::-webkit-scrollbar {
    display: none;
  }

  button {
    padding: 0.55rem 0.9rem;
    background: none;
    border: 0;
    border-right: 1px solid var(--border-l);
    color: var(--muted);
    cursor: pointer;
    font-family: var(--mono);
    font-size: 0.68rem;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }

  button:hover {
    color: var(--text);
    background: var(--card-h);
  }

  button.active {
    color: var(--accent);
    background: var(--card-h);
    border-bottom: 2px solid var(--accent);
    padding-bottom: calc(0.55rem - 2px);
  }

  .tabs-panels {
    background: var(--card);
    padding: 1rem 1.1rem;
  }

  .tabs-panels :global(> :last-child) {
    margin-bottom: 0;
  }
</style>
