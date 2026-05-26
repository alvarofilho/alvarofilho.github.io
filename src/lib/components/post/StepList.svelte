<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';

  type Props = { children?: Snippet };
  let { children }: Props = $props();

  const ctx = $state({ count: 0 });
  setContext('step-list', ctx);
</script>

<ol class="step-list">
  {@render children?.()}
</ol>

<style>
  .step-list {
    margin: 1.7rem 0;
    list-style: none;
    border: 1px solid var(--border);
  }
</style>
