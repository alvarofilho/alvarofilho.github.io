<script lang="ts">
  import type { Component } from 'svelte';
  import { formatDate, type Lang, type Messages } from '$lib/data/site';
  import type { PostMeta } from '$lib/data/posts';
  import PostLangs from './PostLangs.svelte';
  import PostToc from './PostToc.svelte';
  import RelatedPosts from './RelatedPosts.svelte';

  type Props = {
    post: PostMeta;
    messages: Messages;
    mode: 'published' | 'draft';
    availableLangs?: Lang[];
    relatedPosts?: PostMeta[];
  };

  let { post, messages, mode, availableLangs = [], relatedPosts = [] }: Props = $props();

  const modules = import.meta.glob<Component>('/src/content/posts/**/*.svx', {
    eager: true,
    import: 'default'
  });
  const Content = $derived(modules[`/src/content/posts/${post.lang}/${post.slug}.svx`]);
  const isPublished = $derived(mode === 'published');
  const backPath = $derived(isPublished ? `/${post.lang}/blog/` : `/${post.lang}/blog/drafts/`);
  const backLabel = $derived(isPublished ? messages.text.backToBlog : 'draft studio');
  const eyebrow = $derived(isPublished ? messages.command.blogArticleEyebrow : 'draft preview');
</script>

<main>
  <article class="post-page" class:post-page--command={isPublished}>
    <div class="wrap post-wrap" class:post-command-wrap={isPublished}>
      {#if isPublished}
        <div class="post-command-bar">
          <strong>{messages.command.blogCommand}</strong>
          <span>{messages.command.blogFeed}</span>
        </div>
      {/if}
      <a href={backPath} class="post-back">← {backLabel}</a>

      <div class="post-layout">
        <div class="post-main">
          <header class="post-head">
            <div class="post-head-kicker">
              <p class="eyebrow">{eyebrow}</p>
              {#if isPublished}<span><i></i> {messages.command.blogPublished}</span>{/if}
            </div>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            {#if isPublished}
              <PostLangs {post} {availableLangs} />
            {/if}
            <div class="post-meta">
              {#if isPublished}<span>{messages.command.blogAuthor}</span>{/if}
              <span>{formatDate(post.date, post.lang)}</span>
              <span>{post.readingTime} {messages.text.readingTime}</span>
              {#if !isPublished}
                <span class="tag">draft</span>
              {/if}
              {#each post.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </header>

          {#if post.image}
            <div class="post-cover" class:post-cover--themeable={post.imageLight}>
              <img
                src={post.image}
                alt={post.title}
                class="post-cover-img post-cover-img--dark"
                fetchpriority={isPublished ? 'high' : undefined}
              />
              {#if post.imageLight}
                <img
                  src={post.imageLight}
                  alt={post.title}
                  class="post-cover-img post-cover-img--light"
                  fetchpriority={isPublished ? 'high' : undefined}
                />
              {/if}
            </div>
          {/if}

          <div class="post-reading-layout">
            <div class="post-article-body">
              <div class="post-content">
                {#if Content}
                  <Content />
                {/if}
              </div>

              {#if isPublished}
                <RelatedPosts posts={relatedPosts} title={post.lang === 'pt' ? 'relacionados' : 'related'} />
              {/if}
            </div>

            <aside class="post-sidebar">
              {#key `${mode}-${post.lang}-${post.slug}`}
                <PostToc />
              {/key}
            </aside>
          </div>
        </div>
      </div>
    </div>
  </article>
</main>
