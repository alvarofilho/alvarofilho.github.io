<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import PostLangs from '$lib/components/post/PostLangs.svelte';
  import PostToc from '$lib/components/post/PostToc.svelte';
  import RelatedPosts from '$lib/components/post/RelatedPosts.svelte';
  import { getPostPath, getTranslatedPost } from '$lib/data/posts';
  import { languageConfig } from '$lib/data/site';
  import type { Component } from 'svelte';

  let { data } = $props();

  const modules = import.meta.glob<{
    default: Component;
    metadata: { lang: string; slug: string };
  }>('/src/content/posts/**/*.svx', { eager: true });
  const Content = $derived(
    Object.entries(modules).find(([, module]) => {
      const metadata = (module as { metadata?: { lang: string; slug: string } }).metadata;
      return metadata?.lang === data.lang && metadata.slug === data.post.slug;
    })?.[1].default
  );
  const alternates = $derived(
    data.availableLangs.map((alternateLang) => {
      const translatedPost = alternateLang === data.post.lang
        ? data.post
        : getTranslatedPost(data.post, alternateLang);

      return {
        hreflang: languageConfig[alternateLang].htmlLang,
        path: translatedPost ? getPostPath(translatedPost) : getPostPath(data.post)
      };
    })
  );
</script>

<Seo
  title={`${data.post.title} — Álvaro Duarte`}
  description={data.post.description}
  path={`/${data.lang}/blog/${data.post.slug}/`}
  lang={data.lang}
  locale={data.messages.locale}
  type="article"
  rssPath={`/${data.lang}/blog/rss.xml`}
  publishedTime={`${data.post.date}T00:00:00Z`}
  tags={data.post.tags}
  image={data.post.image}
  {alternates}
/>

<main>
  <article class="post-page">
    <div class="wrap post-wrap">
      <a href={`/${data.lang}/blog/`} class="post-back">← {data.messages.text.backToBlog}</a>

      <div class="post-layout">
        <div class="post-main">
          <header class="post-head">
            <p class="eyebrow">blog</p>
            <h1>{data.post.title}</h1>
            <p>{data.post.description}</p>
            <PostLangs post={data.post} availableLangs={data.availableLangs} />
            <div class="post-meta">
              <span>{new Date(`${data.post.date}T00:00:00`).toLocaleDateString(data.lang === 'pt' ? 'pt-BR' : 'en', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              })}</span>
              {#each data.post.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </header>

          {#if data.post.image}
            <div class="post-cover">
              <img src={data.post.image} alt={data.post.title} />
            </div>
          {/if}

          <div class="post-content">
            {#if Content}
              <Content />
            {/if}
          </div>

          <RelatedPosts posts={data.relatedPosts} title={data.lang === 'pt' ? 'relacionados' : 'related'} />
        </div>

        <aside class="post-sidebar">
          {#key data.lang}
            <PostToc />
          {/key}
        </aside>
      </div>
    </div>
  </article>
</main>
