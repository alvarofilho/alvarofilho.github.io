<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';

  type Props = { label: string; children?: Snippet };
  let { label, children }: Props = $props();

  const ctx = getContext<{
    active: string;
    activate: (label: string) => void;
    getTabId: (label: string) => string;
    getPanelId: (label: string) => string;
  }>('tabs');
</script>

<div
  class="tab-panel"
  id={ctx.getPanelId(label)}
  hidden={ctx.active !== label}
  role="tabpanel"
  aria-labelledby={ctx.getTabId(label)}
  tabindex={ctx.active === label ? 0 : -1}
>
  {@render children?.()}
</div>
