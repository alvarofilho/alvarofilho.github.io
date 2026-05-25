<script lang="ts">
  type TermLine =
    | { kind: 'cmd'; text: string }
    | { kind: 'out'; text: string; muted?: boolean }
    | { kind: 'sep' };

  type Props = {
    title?: string;
    lines: TermLine[];
  };

  let { title = 'terminal', lines }: Props = $props();
</script>

<figure class="post-terminal">
  <figcaption class="pt-bar">
    <span class="pt-dots">
      <span class="td r"></span>
      <span class="td y"></span>
      <span class="td g"></span>
    </span>
    <span class="pt-title">{title}</span>
  </figcaption>
  <div class="pt-body">
    {#each lines as line}
      {#if line.kind === 'cmd'}
        <div class="pt-line pt-cmd"><span class="pt-prompt">$</span>{line.text}</div>
      {:else if line.kind === 'sep'}
        <div class="pt-line pt-sep"></div>
      {:else}
        <div class="pt-line pt-out" class:pt-muted={line.muted}>{line.text}</div>
      {/if}
    {/each}
  </div>
</figure>
