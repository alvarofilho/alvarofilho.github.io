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
