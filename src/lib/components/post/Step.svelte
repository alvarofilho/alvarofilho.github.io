<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';

  type Props = { title?: string; children?: Snippet };
  let { title, children }: Props = $props();

  const ctx = getContext<{ count: number }>('step-list');
  const num = String(++ctx.count).padStart(2, '0');
</script>

<li class="step-item">
  <span class="step-num">{num}</span>
  <div class="step-body">
    {#if title}<p class="step-title">{title}</p>{/if}
    {@render children?.()}
  </div>
</li>

<style>
  .step-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    background: var(--card);
    border-bottom: 1px solid var(--border);
  }

  .step-item:last-child {
    border-bottom: 0;
  }

  .step-num {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0.9rem 0;
    border-right: 1px solid var(--border);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .step-body {
    padding: 0.85rem 1.1rem;
  }

  .step-title {
    margin-bottom: 0.4rem;
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .step-body :global(> :last-child) {
    margin-bottom: 0;
  }
</style>
