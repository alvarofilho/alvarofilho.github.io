<script lang="ts">
  type Item = { key: string; value: string };

  type Props = {
    items: Item[];
    caption?: string;
  };

  let { items, caption }: Props = $props();
</script>

<figure class="key-value">
  <dl>
    {#each items as { key, value }}
      <div class="kv-row">
        <dt>{key}</dt>
        <dd>{value}</dd>
      </div>
    {/each}
  </dl>
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

<style>
  .key-value {
    margin: 1.7rem 0;
    border: 1px solid var(--border);
    font-family: var(--mono);
  }

  dl {
    display: grid;
  }

  .kv-row {
    display: grid;
    grid-template-columns: minmax(120px, 30%) 1fr;
    background: var(--card);
    border-bottom: 1px solid var(--border);
  }

  .kv-row:last-child {
    border-bottom: 0;
  }

  dt {
    padding: 0.6rem 0.85rem;
    border-right: 1px solid var(--border);
    color: var(--accent);
    font-size: 0.72rem;
    font-weight: 600;
  }

  dd {
    padding: 0.6rem 0.85rem;
    color: var(--muted);
    font-size: 0.72rem;
  }

  figcaption {
    padding: 0.45rem 0.85rem;
    border-top: 1px solid var(--border);
    color: var(--dimmer);
    font-size: 0.62rem;
  }
</style>
