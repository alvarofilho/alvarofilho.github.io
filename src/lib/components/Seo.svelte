<script lang="ts">
  import { siteUrl, type Lang } from '$lib/data/site';

  type Props = {
    title: string;
    description: string;
    path: string;
    lang?: Lang;
    locale?: string;
    type?: 'website' | 'article';
    rssPath?: string;
    publishedTime?: string;
    tags?: string[];
    image?: string;
    noindex?: boolean;
  };

  let {
    title,
    description,
    path,
    lang,
    locale = 'pt_BR',
    type = 'website',
    rssPath,
    publishedTime,
    tags,
    image,
    noindex = false
  }: Props = $props();

  const ogImage = $derived(image ? `${siteUrl}${image}` : undefined);

  const canonical = $derived(`${siteUrl}${path}`);
  const shouldUseSimpleAlternate = $derived(path.split('/').filter(Boolean).length <= 2);
  const alternatePath = $derived(shouldUseSimpleAlternate && path.startsWith('/pt/')
    ? path.replace('/pt/', '/en/')
    : shouldUseSimpleAlternate && path.startsWith('/en/')
      ? path.replace('/en/', '/pt/')
      : undefined);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if noindex}
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
    <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
  {/if}
  <link rel="canonical" href={canonical} />
  {#if lang}
    <meta property="og:locale" content={locale} />
    <link rel="alternate" hreflang={lang === 'pt' ? 'pt-BR' : 'en'} href={canonical} />
    {#if alternatePath}
      <link
        rel="alternate"
        hreflang={lang === 'pt' ? 'en' : 'pt-BR'}
        href={`${siteUrl}${alternatePath}`}
      />
    {/if}
  {/if}
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}
  <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:site" content="@alvarofilho" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
  {/if}
  {#if rssPath}
    <link rel="alternate" type="application/rss+xml" title={title} href={`${siteUrl}${rssPath}`} />
  {/if}
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  {#each tags ?? [] as tag}
    <meta property="article:tag" content={tag} />
  {/each}
</svelte:head>
