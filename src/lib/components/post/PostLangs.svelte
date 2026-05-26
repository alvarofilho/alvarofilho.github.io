<script lang="ts">
  import { getContext } from 'svelte';
  import { getPostPath, getTranslatedPost, type PostMeta } from '$lib/data/posts';
  import type { Lang, Messages } from '$lib/data/site';

  type Props = {
    post: PostMeta;
    availableLangs: Lang[];
  };

  let { post, availableLangs }: Props = $props();

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const text = $derived(getMessages?.()?.text);
  const label = $derived(text?.postAvailableIn ?? 'available in');
  const navLabel = $derived(text?.postLangsLabel ?? 'Available languages for this post');
  const currentLabel = $derived(text?.postCurrentLangLabel ?? 'Current language');
  const readInLabel = $derived(text?.postReadInLangLabel ?? 'Read this post in');

  function getPath(lang: Lang) {
    const translated = getTranslatedPost(post, lang);
    return translated ? getPostPath(translated) : null;
  }
</script>

{#if availableLangs.length > 1}
  <nav class="post-langs" aria-label={navLabel}>
    <span class="post-langs-label">// {label}</span>
    {#each availableLangs as lang}
      {@const path = getPath(lang)}
      {@const isCurrent = lang === post.lang}
      {#if isCurrent}
        <span
          class="post-lang-chip post-lang-chip--current"
          aria-current="page"
          aria-label={`${currentLabel}: ${lang.toUpperCase()}`}
        >{lang.toUpperCase()}</span>
      {:else if path}
        <a href={path} class="post-lang-chip" aria-label={`${readInLabel} ${lang.toUpperCase()}`}
          >{lang.toUpperCase()}</a
        >
      {/if}
    {/each}
  </nav>
{/if}
