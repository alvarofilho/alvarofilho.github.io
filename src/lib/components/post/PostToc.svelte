<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { Messages } from '$lib/data/site';

  type Heading = { id: string; text: string; level: number };

  let headings = $state<Heading[]>([]);
  let activeId = $state('');

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const tocTitle = $derived(getMessages?.()?.text.tocTitle ?? 'contents');

  function slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  onMount(() => {
    const seen = new Map<string, number>();
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.post-content h2, .post-content h3')
    );

    headings = elements.map((el) => {
      const base = slugify(el.textContent ?? 'section') || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      el.id = el.id || id;
      return { id: el.id, text: el.textContent ?? '', level: Number(el.tagName[1]) };
    });

    if (!headings.length) return;

    activeId = headings[0].id;

    function updateActive() {
      const offset = 96;
      let current = headings[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= offset) {
          current = el.id;
        }
      }
      activeId = current;
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  });
</script>

{#if headings.length}
  <nav class="post-toc" aria-label="Post sections">
    <p>// {tocTitle}</p>
    <ol>
      {#each headings as heading}
        <li class:sub={heading.level === 3}>
          <a href={`#${heading.id}`} class:active={heading.id === activeId}>{heading.text}</a>
        </li>
      {/each}
    </ol>
  </nav>
{/if}
