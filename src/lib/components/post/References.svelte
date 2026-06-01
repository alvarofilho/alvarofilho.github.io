<script lang="ts">
  type Item = { label: string; href: string };

  type Props = {
    items: Item[];
  };

  let { items }: Props = $props();
</script>

<footer class="post-references">
  <p class="references-title">referências</p>
  <ol>
    {#each items as { label, href }}
      <li>
        <a {href} target="_blank" rel="noopener noreferrer">{label}</a>
      </li>
    {/each}
  </ol>
</footer>

<style>
  .post-references {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .references-title {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--dimmer);
    text-transform: lowercase;
    margin: 0 0 0.75rem;
  }

  ol {
    list-style: decimal;
    padding-left: 1.25rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  li {
    font-family: var(--mono);
    font-size: 0.72rem;
  }

  a {
    color: var(--muted);
    text-decoration: none;
    word-break: break-all;
    transition: color 0.15s;
  }

  a:hover {
    color: var(--accent);
  }
</style>
