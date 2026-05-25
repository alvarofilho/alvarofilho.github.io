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
