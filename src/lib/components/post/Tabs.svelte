<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';

  type Props = {
    labels: string[];
    children?: Snippet;
  };

  let { labels, children }: Props = $props();
  let activeLabel = $state('');

  $effect(() => {
    if (!labels.includes(activeLabel)) {
      activeLabel = labels[0] ?? '';
    }
  });

  setContext('tabs', {
    get active() { return activeLabel; }
  });
</script>

<div class="tabs-block">
  <div class="tabs-nav" role="tablist">
    {#each labels as label}
      <button
        type="button"
        role="tab"
        class:active={activeLabel === label}
        aria-selected={activeLabel === label}
        onclick={() => { activeLabel = label; }}
      >{label}</button>
    {/each}
  </div>
  <div class="tabs-panels">
    {@render children?.()}
  </div>
</div>
