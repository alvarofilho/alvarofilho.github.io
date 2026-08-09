<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import PostPage from '$lib/components/post/PostPage.svelte';
  import { contentCatalog } from '$lib/data/posts';
  import { languageConfig } from '$lib/data/site';
  import { getRssPath } from '$lib/data/url-policy';

  let { data } = $props();

  const alternates = $derived(
    data.availableLangs.map((alternateLang) => {
      const translatedPost = alternateLang === data.post.lang
        ? data.post
        : contentCatalog.getTranslatedPost(data.post, alternateLang);

      return {
        hreflang: languageConfig[alternateLang].htmlLang,
        path: translatedPost ? contentCatalog.getPostPath(translatedPost) : contentCatalog.getPostPath(data.post)
      };
    })
  );
</script>

<Seo
  title={`${data.post.title} — Álvaro Duarte`}
  description={data.post.description}
  path={contentCatalog.getPostPath(data.post)}
  lang={data.lang}
  locale={data.messages.locale}
  type="article"
  rssPath={getRssPath(data.lang)}
  publishedTime={`${data.post.date}T00:00:00Z`}
  tags={data.post.tags}
  image={data.post.image}
  {alternates}
/>

<PostPage
  post={data.post}
  messages={data.messages}
  mode="published"
  availableLangs={data.availableLangs}
  relatedPosts={data.relatedPosts}
/>
