<script lang="ts">
  import { fadeIn } from '$lib/actions/fadeIn';
  import BlogSearch from '$lib/components/BlogSearch.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { contentCatalog } from '$lib/data/posts';
  import { formatDate } from '$lib/data/site';
  import { getBlogPath, getRssPath } from '$lib/data/url-policy';
  import { ArrowRight } from '@lucide/svelte';

  let { data } = $props();
  const latestPost = $derived(data.posts[0]);
</script>

<Seo
  title={`${data.messages.text.blogTitle} — Álvaro Duarte`}
  description={data.messages.text.blogHint}
  path={getBlogPath(data.lang)}
  lang={data.lang}
  locale={data.messages.locale}
  rssPath={getRssPath(data.lang)}
/>

<main class="blog-command-page">
  <section class="blog-page blog-command-surface">
    <div class="blog-command-wrap">
      <div class="blog-command-bar fi" use:fadeIn>
        <strong>{data.messages.command.blogCommand}</strong>
        <span>{String(data.posts.length).padStart(2, '0')} · {data.messages.command.blogFeed}</span>
      </div>

      <header class="blog-command-masthead fi" use:fadeIn>
        <span>{data.messages.command.blogBriefingEyebrow}</span>
        <h1>{data.messages.command.blogBriefingTitle}<br /><em>{data.messages.command.blogBriefingAccent}</em></h1>
        <p>{data.messages.command.blogBriefingIntro}</p>
        <div><span>LANG · {data.lang.toUpperCase()}</span><span>{data.messages.command.rssOnline}</span></div>
      </header>

      {#if data.posts.length}
        <a class="blog-command-feature fi" href={contentCatalog.getPostPath(latestPost)} use:fadeIn>
          <span class="blog-command-feature-copy">
            <small>{data.messages.command.blogLatestEntry} · {formatDate(latestPost.date, latestPost.lang)}</small>
            <strong>{latestPost.title}</strong>
            <p>{latestPost.description}</p>
            <span>{data.messages.command.blogOpenNote} <ArrowRight size={15} aria-hidden="true" /></span>
          </span>
          {#if latestPost.image}
            <span class="blog-command-feature-art" class:blog-command-feature-art--themeable={latestPost.imageLight}>
              <img src={latestPost.image} alt="" class="blog-feature-img blog-feature-img--dark" fetchpriority="high" />
              {#if latestPost.imageLight}<img src={latestPost.imageLight} alt="" class="blog-feature-img blog-feature-img--light" fetchpriority="high" />{/if}
            </span>
          {/if}
        </a>

        {#key data.lang}
          <BlogSearch posts={data.posts} messages={data.messages} />
        {/key}
      {:else}
        <div class="blog-coming fi" use:fadeIn>
          <span class="blog-coming-em">{data.messages.text.blogEmptyStatus}</span>
          <p class="blog-coming-sub">{data.messages.text.blogEmptyText}</p>
        </div>
      {/if}
    </div>
  </section>
</main>
