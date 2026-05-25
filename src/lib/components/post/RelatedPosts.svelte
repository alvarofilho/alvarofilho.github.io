<script lang="ts">
  import { getPostPath, type PostMeta } from '$lib/data/posts';
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
          <a href={getPostPath(post)}>
            <span class="rp-title">{post.title}</span>
            <span class="rp-date">{formatDate(post.date, post.lang)}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .related-posts {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.5rem 0;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s;
  }

  a:hover {
    border-bottom-color: var(--border);
  }

  a:hover .rp-title {
    color: var(--accent);
  }

  .rp-title {
    font-size: 0.9rem;
    color: var(--text);
    transition: color 0.15s;
  }

  .rp-date {
    font-size: 0.8rem;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }
</style>
