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

<style>
  .table-wrapper {
    margin: 1.7rem 0;
  }

  .table-wrapper > div {
    overflow-x: auto;
    border: 1px solid var(--border);
  }

  .table-wrapper :global(table) {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    background: var(--card);
    font-family: var(--mono);
    font-size: 0.72rem;
  }

  .table-wrapper :global(th),
  .table-wrapper :global(td) {
    padding: 0.75rem 0.85rem;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }

  .table-wrapper :global(th) {
    color: var(--accent);
    font-weight: 600;
  }

  .table-wrapper :global(td) {
    color: var(--muted);
  }

  figcaption {
    margin-top: 0.55rem;
    color: var(--dimmer);
    font-family: var(--mono);
    font-size: 0.62rem;
  }
</style>
