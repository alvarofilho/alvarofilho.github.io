<script lang="ts">
  import { onMount } from 'svelte';
  import Error404Page from '$lib/components/Error404Page.svelte';
  import { isLang, messages, type Lang } from '$lib/data/site';

  let lang = $state<Lang>('pt');
  let path = $state('/404');

  onMount(() => {
    path = window.location.pathname || '/404';

    const firstSegment = path.split('/').filter(Boolean)[0];
    if (firstSegment && isLang(firstSegment)) {
      lang = firstSegment;
    }
  });

  const pageMessages = $derived(messages[lang]);
</script>

<Error404Page {lang} messages={pageMessages} {path} />
