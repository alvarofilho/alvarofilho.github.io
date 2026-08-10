<script lang="ts">
  import { contentCatalog, type PostMeta } from '$lib/data/posts';
  import { formatDate } from '$lib/data/site';
  import { ArrowUpRight } from '@lucide/svelte';

  type Props = {
    post: PostMeta;
    index: number;
  };

  let { post, index }: Props = $props();

  const availableLangs = $derived(contentCatalog.getAvailableLangs(post));
</script>

<a href={contentCatalog.getPostPath(post)} class="blog-card">
  <span class="bc-idx">{String(index + 1).padStart(2, '0')}</span>
  <span class="bc-body">
    <span class="bc-meta">{post.tags.join(' · ')}</span>
    <span class="bc-title">{post.title}</span>
    <span class="bc-desc">{post.description}</span>
    <span class="ptags">
      {#each post.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
      {#each availableLangs as lang}
        <span class="tag lang-tag" class:lang-tag--current={lang === post.lang}>
          {lang.toUpperCase()}
        </span>
      {/each}
    </span>
  </span>
  <time datetime={post.date}>{formatDate(post.date, post.lang)}</time>
  <ArrowUpRight size={18} aria-hidden="true" />
</a>
