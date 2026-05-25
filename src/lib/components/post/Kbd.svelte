<script lang="ts">
  type Props = { keys: string[] };
  let { keys }: Props = $props();
</script>

<span class="kbd-group">
  {#each keys as key, i}
    <kbd class="kbd">{key}</kbd>{#if i < keys.length - 1}<span class="kbd-plus">+</span>{/if}
  {/each}
</span>
