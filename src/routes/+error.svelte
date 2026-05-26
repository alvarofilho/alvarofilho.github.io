<script lang="ts">
  import { page } from '$app/stores';
  import Error404Page from '$lib/components/Error404Page.svelte';
  import { isLang, messages } from '$lib/data/site';

  const lang = $derived.by(() => {
    const first = $page.url.pathname.split('/').filter(Boolean)[0];
    return isLang(first) ? first : 'pt';
  });

  const m = $derived(messages[lang]);
</script>

<Error404Page lang={lang} messages={m} path={$page.url.pathname} />
