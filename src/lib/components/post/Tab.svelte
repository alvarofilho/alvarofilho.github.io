<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';

  type Props = { label: string; children?: Snippet };
  let { label, children }: Props = $props();

  const ctx = getContext<{ active: string }>('tabs');
</script>

<div class="tab-panel" hidden={ctx.active !== label} role="tabpanel">
  {@render children?.()}
</div>
