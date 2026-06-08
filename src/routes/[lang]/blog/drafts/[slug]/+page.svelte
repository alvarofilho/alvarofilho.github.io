<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import PostToc from '$lib/components/post/PostToc.svelte';
  import type { Component } from 'svelte';

  let { data } = $props();

  const modules = import.meta.glob<Component>('/src/content/posts/**/*.svx', {
    eager: true,
    import: 'default'
  });
  const Content = $derived(modules[`/src/content/posts/${data.lang}/${data.post.slug}.svx`]);
</script>

<Seo
  title={`Draft: ${data.post.title} — Álvaro Duarte`}
  description={data.post.description}
  path={`/${data.lang}/blog/drafts/${data.post.slug}/`}
  lang={data.lang}
  locale={data.messages.locale}
  type="article"
  tags={data.post.tags}
  image={data.post.image}
  noindex
/>

<main>
  <article class="post-page">
    <div class="wrap post-wrap">
      <a href={`/${data.lang}/blog/drafts/`} class="post-back">← draft studio</a>

      <div class="post-layout">
        <div class="post-main">
          <header class="post-head">
            <p class="eyebrow">draft preview</p>
            <h1>{data.post.title}</h1>
            <p>{data.post.description}</p>
            <div class="post-meta">
              <span>{new Date(`${data.post.date}T00:00:00`).toLocaleDateString(data.lang === 'pt' ? 'pt-BR' : 'en', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              })}</span>
              <span>{data.post.readingTime} {data.messages.text.readingTime}</span>
              <span class="tag">draft</span>
              {#each data.post.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </header>

          {#if data.post.image}
            <div class="post-cover" class:post-cover--themeable={data.post.imageLight}>
              <img src={data.post.image} alt={data.post.title} class="post-cover-img post-cover-img--dark" />
              {#if data.post.imageLight}
                <img src={data.post.imageLight} alt={data.post.title} class="post-cover-img post-cover-img--light" />
              {/if}
            </div>
          {/if}

          <div class="post-content">
            {#if Content}
              <Content />
            {/if}
          </div>
        </div>

        <aside class="post-sidebar">
          {#key data.post.slug}
            <PostToc />
          {/key}
        </aside>
      </div>
    </div>
  </article>
</main>
