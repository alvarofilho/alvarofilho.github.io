<script lang="ts">
  import { fadeIn } from '$lib/actions/fadeIn';
  import BlogSearch from '$lib/components/BlogSearch.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { getBlogPath, getRssPath } from '$lib/data/url-policy';

  let { data } = $props();
</script>

<Seo
  title={`${data.messages.text.blogTitle} — Álvaro Duarte`}
  description={data.messages.text.blogHint}
  path={getBlogPath(data.lang)}
  lang={data.lang}
  locale={data.messages.locale}
  rssPath={getRssPath(data.lang)}
/>

<main>
  <section class="blog-page">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>blog</p>
      <h1 class="sec-title fi" use:fadeIn>{data.messages.text.blogTitle}</h1>

      {#if data.posts.length}
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
