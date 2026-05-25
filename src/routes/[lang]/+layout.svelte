<script lang="ts">
  import { setContext } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navigation from '$lib/components/Navigation.svelte';

  let { data, children } = $props();

  setContext('messages', () => data.messages);
</script>

<Navigation lang={data.lang} messages={data.messages} path={data.path} />
{@render children()}
<Footer messages={data.messages} />
