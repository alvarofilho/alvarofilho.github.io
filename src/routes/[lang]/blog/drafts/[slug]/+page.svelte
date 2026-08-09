<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import PostPage from '$lib/components/post/PostPage.svelte';
  import { contentCatalog } from '$lib/data/posts';

  let { data } = $props();
</script>

<Seo
  title={`Draft: ${data.post.title} — Álvaro Duarte`}
  description={data.post.description}
  path={contentCatalog.getDraftPostPath(data.post)}
  lang={data.lang}
  locale={data.messages.locale}
  type="article"
  tags={data.post.tags}
  image={data.post.image}
  noindex
/>

<PostPage post={data.post} messages={data.messages} mode="draft" />
