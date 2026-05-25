<script lang="ts">
  import { setContext } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navigation from '$lib/components/Navigation.svelte';

  let { data, children } = $props();

  setContext('messages', () => data.messages);
</script>

<Navigation lang={data.lang} messages={data.messages} path={data.path} />
<div id="main-content" tabindex="-1">
  {@render children()}
</div>
<Footer messages={data.messages} />
