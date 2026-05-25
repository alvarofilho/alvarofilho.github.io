<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    caption?: string;
    children?: Snippet;
  };

  let { caption, children }: Props = $props();
</script>

<figure class="table-wrapper">
  <div>
    {@render children?.()}
  </div>
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>
