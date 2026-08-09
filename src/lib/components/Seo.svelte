<script lang="ts">
  import { languageConfig, siteUrl, type Lang } from '$lib/data/site';
  import { absoluteUrl, getLocalizedPageAlternates } from '$lib/data/url-policy';

  type Alternate = {
    hreflang: string;
    path: string;
  };

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
    alternates?: Alternate[];
    xDefaultPath?: string;
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
    alternates = [],
    xDefaultPath,
    noindex = false
  }: Props = $props();

  const htmlLang = $derived(lang ? languageConfig[lang].htmlLang : undefined);
  const canonical = $derived(absoluteUrl(path));
  const ogImagePath = $derived(image?.endsWith('.svg') ? image.replace('.svg', '.png') : image);
  const ogImage = $derived(`${siteUrl}${ogImagePath ?? '/images/avatar-144.jpg'}`);
  const twitterCard = $derived(image ? 'summary_large_image' : 'summary');
  const defaultAlternates = $derived(getLocalizedPageAlternates(path));
  const resolvedAlternates = $derived((alternates.length ? alternates : defaultAlternates).map((alternate) => ({
    ...alternate,
    href: absoluteUrl(alternate.path)
  })));

</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if noindex}
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
    <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
  {/if}
  <link rel="canonical" href={canonical} />
  {#if htmlLang}
    <meta property="og:locale" content={locale} />
  {/if}
  {#each resolvedAlternates as alternate}
    <link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
  {/each}
  {#if xDefaultPath}
    <link rel="alternate" hreflang="x-default" href={absoluteUrl(xDefaultPath)} />
  {/if}
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:site" content="@alvarofilho" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  {#if rssPath}
    <link rel="alternate" type="application/rss+xml" title={title} href={absoluteUrl(rssPath)} />
  {/if}
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  {#each tags ?? [] as tag}
    <meta property="article:tag" content={tag} />
  {/each}
</svelte:head>
