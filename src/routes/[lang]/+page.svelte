<script lang="ts">
  import HomePage from '$lib/components/HomePage.svelte';
  import Seo from '$lib/components/Seo.svelte';

  let { data } = $props();
</script>

<Seo
  title={data.messages.meta.title}
  description={data.messages.meta.description}
  path={`/${data.lang}/`}
  lang={data.lang}
  locale={data.messages.locale}
  xDefaultPath="/"
/>

<HomePage lang={data.lang} messages={data.messages} />
