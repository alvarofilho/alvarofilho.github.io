<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    type?: 'info' | 'warning' | 'success' | 'danger';
    title?: string;
    children?: Snippet;
  };

  let { type = 'info', title, children }: Props = $props();
</script>

<aside class={`callout callout-${type}`}>
  {#if title}
    <p class="callout-title">{title}</p>
  {/if}
  <div class="callout-body">
    {@render children?.()}
  </div>
</aside>
