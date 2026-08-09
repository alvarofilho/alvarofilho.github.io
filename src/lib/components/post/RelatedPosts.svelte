<script lang="ts">
  import { contentCatalog, type PostMeta } from '$lib/data/posts';
  import { formatDate } from '$lib/data/site';

  type Props = {
    posts: PostMeta[];
    title?: string;
  };

  let { posts, title = 'related' }: Props = $props();
</script>

{#if posts.length}
  <nav class="related-posts" aria-label={title}>
    <p class="eyebrow">// {title}</p>
    <ul>
      {#each posts as post}
        <li>
          <a href={contentCatalog.getPostPath(post)}>
            <span class="rp-title">{post.title}</span>
            <span class="rp-date">{formatDate(post.date, post.lang)}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
