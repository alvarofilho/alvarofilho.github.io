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
  const label = $derived(getMessages?.()?.text.postAvailableIn ?? 'available in');

  function getPath(lang: Lang) {
    const translated = getTranslatedPost(post, lang);
    return translated ? getPostPath(translated) : null;
  }
</script>

{#if availableLangs.length > 1}
  <div class="post-langs">
    <span class="post-langs-label">// {label}</span>
    {#each availableLangs as lang}
      {@const path = getPath(lang)}
      {@const isCurrent = lang === post.lang}
      {#if isCurrent}
        <span class="post-lang-chip post-lang-chip--current">{lang.toUpperCase()}</span>
      {:else if path}
        <a href={path} class="post-lang-chip">{lang.toUpperCase()}</a>
      {/if}
    {/each}
  </div>
{/if}
