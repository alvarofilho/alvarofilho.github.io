<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { getDraftPostPath } from '$lib/data/posts';
  import rawStarterTemplate from '$lib/data/draft-starter-template.svx?raw';

  let { data } = $props();

  const starterTemplate = $derived(rawStarterTemplate.replace('__LANG__', data.lang));
</script>

<Seo
  title={`Draft Studio — Álvaro Duarte`}
  description="Local preview area for writing blog drafts with post components."
  path={`/${data.lang}/blog/drafts/`}
  lang={data.lang}
  locale={data.messages.locale}
  noindex
/>

<main>
  <section class="blog-page">
    <div class="wrap">
      <a href={`/${data.lang}/blog/components/`} class="post-back">← components</a>

      <div class="draft-studio-head">
        <p class="eyebrow">draft studio</p>
        <h1 class="sec-title">Rascunhos com preview real</h1>
        <p>
          Crie artigos em <code>src/content/posts/{data.lang}/</code> com <code>draft: true</code>.
          Eles aparecem aqui para revisar layout, componentes, sumário e responsividade antes de publicar.
        </p>
      </div>

      <div class="draft-grid">
        <section class="draft-panel">
          <h2>Rascunhos</h2>
          {#if data.drafts.length}
            <div class="draft-list">
              {#each data.drafts as draft}
                <a class="draft-row" href={getDraftPostPath(draft)}>
                  <span class="draft-row-title">{draft.title}</span>
                  <span class="draft-row-meta">{draft.slug} · {draft.date}</span>
                </a>
              {/each}
            </div>
          {:else}
            <p class="draft-empty">Nenhum rascunho em {data.lang} ainda.</p>
          {/if}
        </section>

        <section class="draft-panel">
          <h2>Template de artigo</h2>
          <p>Salve como <code>src/content/posts/{data.lang}/webhooks-como-contrato-de-integracao.svx</code>.</p>
          <pre class="draft-template"><code>{starterTemplate}</code></pre>
        </section>
      </div>
    </div>
  </section>
</main>
