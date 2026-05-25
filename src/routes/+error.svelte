<script lang="ts">
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import { isLang, messages } from '$lib/data/site';

  const lang = $derived.by(() => {
    const first = $page.url.pathname.split('/').filter(Boolean)[0];
    return isLang(first) ? first : 'pt';
  });

  const m = $derived(messages[lang]);
</script>

<Navigation {lang} messages={m} path={$page.url.pathname} />

<main>
  <section class="redirect-page">
    <div class="wrap e404-wrap">
      <p class="eyebrow">404</p>
      <h1 class="e404-title">{m.text.e404Title}</h1>
      <p class="e404-sub">{m.text.e404Sub}</p>
      <a href="/{lang}/" class="e404-cta">{m.text.e404Cta} →</a>

      <div class="e404-term">
        <span class="e404-prompt"><span class="e404-dollar">$</span> GET {$page.url.pathname}</span>
        <span class="e404-response"><span class="e404-status">404</span> {m.text.e404Title}</span>
      </div>
    </div>
  </section>
</main>

<Footer messages={m} />

<style>
  .e404-wrap {
    max-width: 600px;
  }

  .e404-title {
    margin-bottom: 0.75rem;
    color: var(--text);
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    font-weight: 600;
    line-height: 1.15;
  }

  .e404-sub {
    margin-bottom: 2rem;
    color: var(--muted);
    font-family: var(--sans);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .e404-cta {
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 1rem;
    border: 1px solid var(--border-l);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 0.72rem;
    text-decoration: none;
    transition: border-color 0.18s, background 0.18s;
  }

  .e404-cta:hover {
    background: var(--accent-dim);
    border-color: var(--accent);
  }

  .e404-term {
    display: grid;
    gap: 0.35rem;
    margin-top: 3rem;
    padding: 1rem 1.25rem;
    background: var(--card);
    border: 1px solid var(--border-l);
    font-family: var(--mono);
    font-size: 0.72rem;
  }

  .e404-prompt,
  .e404-response {
    display: flex;
    gap: 0.6rem;
    color: var(--muted);
  }

  .e404-dollar {
    color: var(--accent);
    user-select: none;
  }

  .e404-status {
    color: #e05c3a;
  }
</style>
