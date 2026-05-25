<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: string;
    children?: Snippet;
  };

  let { title, children }: Props = $props();
</script>

<aside class="post-aside">
  {#if title}
    <p class="aside-title">{title}</p>
  {/if}
  <div class="aside-body">
    {@render children?.()}
  </div>
</aside>
