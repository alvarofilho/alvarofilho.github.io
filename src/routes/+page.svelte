<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import HomePage from '$lib/components/HomePage.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { messages } from '$lib/data/site';

  const lang = 'pt';
  const pageMessages = messages.pt;
</script>

<Seo
  title={pageMessages.meta.title}
  description={pageMessages.meta.description}
  path="/"
  lang={lang}
  locale={pageMessages.locale}
/>

<Navigation {lang} messages={pageMessages} path="/" />
<HomePage {lang} messages={pageMessages} />
<Footer messages={pageMessages} />
