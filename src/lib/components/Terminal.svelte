<script lang="ts">
  import { onMount } from 'svelte';
  import type { TerminalLine } from '$lib/data/site';

  type Props = {
    lines: TerminalLine[];
  };

  type RenderedLine =
    | { kind: 'cmd'; prompt: '$'; text: string }
    | { kind: 'out'; text: string; modifier?: 'hi' | 'gr' }
    | { kind: 'space' }
    | { kind: 'cursor' };

  let { lines }: Props = $props();
  let rendered = $state<RenderedLine[]>([]);
  let timeoutId: number | undefined;
  const staticRendered = $derived(renderStatic(lines));

  function renderStatic(source: TerminalLine[]): RenderedLine[] {
    return source.map((line) => {
      if (line.kind === 'cmd') return { kind: 'cmd', prompt: '$', text: line.text };
      if (line.kind === 'out') return line;
      return line;
    });
  }

  function renderTerminal() {
    if (timeoutId) window.clearTimeout(timeoutId);
    rendered = [];
    let lineIndex = 0;

    const renderNextLine = () => {
      const line = lines[lineIndex++];
      if (!line) return;

      if (line.kind === 'space' || line.kind === 'cursor') {
        rendered = [...rendered, line];
        if (line.kind === 'space') {
          timeoutId = window.setTimeout(renderNextLine, 70);
        }
        return;
      }

      if (line.kind === 'out') {
        rendered = [...rendered, line];
        timeoutId = window.setTimeout(renderNextLine, 95);
        return;
      }

      const commandIndex = rendered.length;
      rendered = [...rendered, { kind: 'cmd', prompt: '$', text: '' }];
      let charIndex = 0;

      const typeCharacter = () => {
        if (charIndex < line.text.length) {
          const nextText = line.text.slice(0, charIndex + 1);
          rendered = rendered.map((renderedLine, index) =>
            index === commandIndex ? { kind: 'cmd', prompt: '$', text: nextText } : renderedLine
          );
          charIndex += 1;
          timeoutId = window.setTimeout(typeCharacter, 52);
          return;
        }

        timeoutId = window.setTimeout(renderNextLine, 140);
      };

      timeoutId = window.setTimeout(typeCharacter, 60);
    };

    timeoutId = window.setTimeout(renderNextLine, 1300);
  }

  onMount(() => {
    const shouldAnimate =
      window.matchMedia('(min-width: 721px)').matches &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (!shouldAnimate) {
      rendered = renderStatic(lines);
      return;
    }

    renderTerminal();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  });
</script>

<div class="term">
  <div class="term-bar">
    <div class="tdots">
      <div class="td r"></div>
      <div class="td y"></div>
      <div class="td g"></div>
    </div>
    <span class="ttitle">álvaro@dev — zsh</span>
  </div>
  <div class="term-body">
    {#each (rendered.length ? rendered : staticRendered) as line}
      {#if line.kind === 'space'}
        <div class="tspace"></div>
      {:else if line.kind === 'cursor'}
        <div class="tl"><span class="tp">$</span><span class="tcursor"></span></div>
      {:else if line.kind === 'cmd'}
        <div class="tl"><span class="tp">{line.prompt}</span><span class="tc">{line.text}</span></div>
      {:else}
        <div class="tl"><span class={line.modifier ? `to ${line.modifier}` : 'to'}>{line.text}</span></div>
      {/if}
    {/each}
  </div>
</div>
