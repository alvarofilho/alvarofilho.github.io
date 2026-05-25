<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import Callout from '$lib/components/post/Callout.svelte';
  import CodeSnippet from '$lib/components/post/CodeSnippet.svelte';
  import DiffSnippet from '$lib/components/post/DiffSnippet.svelte';
  import HttpMessage from '$lib/components/post/HttpMessage.svelte';
  import BlogImage from '$lib/components/post/BlogImage.svelte';
  import Mermaid from '$lib/components/post/Mermaid.svelte';
  import TableWrapper from '$lib/components/post/TableWrapper.svelte';
  import StepList from '$lib/components/post/StepList.svelte';
  import Step from '$lib/components/post/Step.svelte';
  import TerminalBlock from '$lib/components/post/TerminalBlock.svelte';
  import Tabs from '$lib/components/post/Tabs.svelte';
  import Tab from '$lib/components/post/Tab.svelte';
  import Kbd from '$lib/components/post/Kbd.svelte';
  import Aside from '$lib/components/post/Aside.svelte';
  import KeyValue from '$lib/components/post/KeyValue.svelte';
  import PostToc from '$lib/components/post/PostToc.svelte';
  import RelatedPosts from '$lib/components/post/RelatedPosts.svelte';
  import PostLangs from '$lib/components/post/PostLangs.svelte';
  import { getAvailableLangs } from '$lib/data/posts';

  let { data } = $props();

  const firstPost = $derived(data.posts[0]);
  const availableLangs = $derived(firstPost ? getAvailableLangs(firstPost) : []);
  const t = $derived(data.messages.text);

  // ── CodeSnippet examples ──────────────────────────────────────
  const tsExample = `type PostMeta = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  lang: 'en' | 'pt';
  slug: string;
};

function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  return posts
    .filter((p) => p.lang === post.lang && p.slug !== post.slug)
    .slice(0, limit);
}`;

  const svelteExample = `<script lang="ts">
  import Callout from '$lib/components/post/Callout.svelte';

  let message = $state('Hello, Svelte 5!');
<\/script>

<Callout type="info" title="tip">
  <p>{message}</p>
</Callout>`;

  const bashExample = `# install dependencies
pnpm install

# start dev server
pnpm run dev

# build for production
pnpm run build`;

  const jsonExample = `{
  "name": "alvarofilho.github.io",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }
}`;

  const httpExample = `POST /api/signatures HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...

{
  "documentId": "doc-42",
  "signerId": "user-7"
}`;

  // ── DiffSnippet examples ──────────────────────────────────────
  const diffExample = `--- a/src/lib/data/posts.ts
+++ b/src/lib/data/posts.ts
@@ -12,7 +12,7 @@ export type PostMeta = {
   tags: string[];
 };

-export function getPosts(): PostMeta[] {
+export function getPostsByLang(lang: Lang): PostMeta[] {
   return Object.values(
     import.meta.glob('../content/posts/**/*.svx', { eager: true })
-  ).map((mod) => (mod as { metadata: PostMeta }).metadata);
+  ).filter((mod) => (mod as { metadata: PostMeta }).metadata.lang === lang);
 }`;

  // ── Mermaid examples ──────────────────────────────────────────
  const mermaidFlowchart = `flowchart TD
  A[Blog Post .svx] --> B[Vite Glob Import]
  B --> C{Has draft?}
  C -- yes --> D[Skip]
  C -- no --> E[Enrich Metadata]
  E --> F[Sort by date]
  F --> G[BlogSearch / BlogCard]`;

  const mermaidSequence = `sequenceDiagram
  participant Browser
  participant SvelteKit
  participant Posts

  Browser->>SvelteKit: GET /pt/blog/
  SvelteKit->>Posts: getPostsByLang('pt')
  Posts-->>SvelteKit: PostMeta[]
  SvelteKit-->>Browser: Rendered HTML`;

  // ── TerminalBlock examples ────────────────────────────────────
  const termLines = [
    { kind: 'cmd' as const, text: 'pnpm run build' },
    { kind: 'out' as const, text: '> vite build' },
    { kind: 'out' as const, text: '' },
    { kind: 'out' as const, text: 'transforming...' },
    { kind: 'out' as const, text: '✓  built in 48.43s', muted: false },
    { kind: 'sep' as const },
    { kind: 'cmd' as const, text: 'ls build/' },
    { kind: 'out' as const, text: 'index.html  _app/  pt/  en/', muted: true },
  ];
</script>

<Seo
  title={`${t.componentShowcaseTitle} — Álvaro Duarte`}
  description={t.componentShowcaseDescription}
  path={`/${data.lang}/blog/components/`}
  lang={data.lang}
  locale={data.lang === 'pt' ? 'pt_BR' : 'en_US'}
  noindex
/>

<main>
  <article class="post-page component-showcase-page">
    <div class="wrap post-wrap">
      <a href={`/${data.lang}/blog/`} class="post-back">← blog</a>

      <div class="post-layout">
        <div class="post-main">
          <header class="post-head">
            <p class="eyebrow">{t.componentShowcaseReference}</p>
            <h1>{t.componentShowcaseTitle}</h1>
            <p>{t.componentShowcaseDescription}</p>
            <div class="post-meta">
              <span>2026-05-24</span>
              <span class="tag">{t.componentShowcaseTag}</span>
              <span class="tag">{t.componentShowcaseReference}</span>
            </div>
          </header>

          <div class="post-content">

            <!-- ─── CALLOUT ──────────────────────────────────────── -->
            <h2 id="callout">Callout</h2>
            <p>Four variants: <code>info</code>, <code>warning</code>, <code>success</code>, <code>danger</code>. Optional <code>title</code> prop.</p>

            <Callout type="info">
              <p>Default <strong>info</strong> callout without a title.</p>
            </Callout>

            <Callout type="info" title="note">
              <p>Info callout <strong>with a title</strong>. Use for tips, notes, and supplementary context.</p>
            </Callout>

            <Callout type="warning" title="heads up">
              <p>Warning callout. Use for gotchas, deprecations, or anything that needs attention.</p>
            </Callout>

            <Callout type="success" title="done">
              <p>Success callout. Use to confirm expected outcomes or summarize completed steps.</p>
            </Callout>

            <Callout type="danger" title="breaking change">
              <p>Danger callout. Use for destructive actions, security implications, or hard failures.</p>
            </Callout>

            <!-- ─── ASIDE ─────────────────────────────────────────── -->
            <h2 id="aside">Aside</h2>
            <p>Neutral supplementary block. Softer than a <code>Callout</code> — for context, not alerts. Props: optional <code>title</code>.</p>

            <Aside>
              <p>Aside without a title. Good for tangential context that doesn't need emphasis.</p>
            </Aside>

            <Aside title="background">
              <p>Aside with a title. Use for background context, definitions, or additional reading that's useful but not critical.</p>
            </Aside>

            <!-- ─── CODE SNIPPET ─────────────────────────────────── -->
            <h2 id="codesnippet">CodeSnippet</h2>
            <p>Syntax-highlighted code via Shiki. Always dark. Props: <code>code</code>, <code>lang</code>, optional <code>title</code>.</p>

            <CodeSnippet lang="typescript" code={tsExample} title="src/lib/data/posts.ts" />
            <CodeSnippet lang="svelte" code={svelteExample} title="MyComponent.svelte" />
            <CodeSnippet lang="bash" code={bashExample} />
            <CodeSnippet lang="json" code={jsonExample} title="package.json" />

            <!-- HTTP MESSAGE -->
            <h2 id="httpmessage">HttpMessage</h2>
            <p>{t.componentHttpMessageDescription}</p>

            <HttpMessage title={t.componentHttpMessageExampleTitle} message={httpExample} />

            <!-- ─── DIFF SNIPPET ─────────────────────────────────── -->
            <h2 id="diffsnippet">DiffSnippet</h2>
            <p>Git-style unified diff viewer. Lines prefixed with <code>+</code> are highlighted green, <code>-</code> red, <code>@@</code> grey. Props: <code>code</code>, optional <code>lang</code>, <code>title</code>.</p>

            <DiffSnippet code={diffExample} title="src/lib/data/posts.ts" />

            <!-- ─── KBD ───────────────────────────────────────────── -->
            <h2 id="kbd">Kbd</h2>
            <p>Inline keyboard shortcut display. Prop: <code>keys: string[]</code>.</p>

            <p>
              Open the command palette with <Kbd keys={['Ctrl', 'Shift', 'P']} />, then type
              <Kbd keys={['>']} /> to filter by command. Press <Kbd keys={['Esc']} /> to dismiss.
            </p>
            <p>
              On macOS: <Kbd keys={['⌘', 'K']} /> opens Quick Open, <Kbd keys={['⌘', '⇧', 'P']} /> opens the palette.
            </p>

            <!-- ─── STEP LIST ─────────────────────────────────────── -->
            <h2 id="steplist">StepList + Step</h2>
            <p>Numbered steps with optional titles. Compound component — wrap <code>Step</code> elements inside <code>StepList</code>. Numbers auto-increment.</p>

            <StepList>
              <Step title="Install dependencies">
                <p>Run <code>pnpm install</code> in the project root. This installs all packages listed in <code>package.json</code>.</p>
              </Step>
              <Step title="Configure environment">
                <p>Copy <code>.env.example</code> to <code>.env</code> and fill in the required variables.</p>
                <CodeSnippet lang="bash" code={`cp .env.example .env\nnano .env`} />
              </Step>
              <Step title="Start the dev server">
                <p>Run <code>pnpm run dev</code>. The site will be available at <code>http://localhost:5173</code>.</p>
              </Step>
              <Step title="Build for production">
                <p>Run <code>pnpm run build</code>. The static output is written to the <code>build/</code> directory.</p>
              </Step>
            </StepList>

            <!-- ─── TERMINAL BLOCK ───────────────────────────────── -->
            <h2 id="terminalblock">TerminalBlock</h2>
            <p>Static terminal output — always dark regardless of theme. Props: <code>lines: TermLine[]</code>, optional <code>title</code>. Line kinds: <code>cmd</code>, <code>out</code>, <code>sep</code>.</p>

            <TerminalBlock title="build output" lines={termLines} />

            <TerminalBlock lines={[
              { kind: 'cmd', text: 'git log --oneline -5' },
              { kind: 'out', text: 'a3f2c1d feat: add pagination to blog' },
              { kind: 'out', text: '8d1e904 fix: CodeSnippet border-radius' },
              { kind: 'out', text: '2b7f3aa chore: reorganize .docs folder' },
              { kind: 'out', text: 'f19c8b2 feat: blog search with fuse.js' },
              { kind: 'out', text: 'c4a1d55 init: sveltekit + mdsvex setup' },
            ]} />

            <!-- ─── TABS ──────────────────────────────────────────── -->
            <h2 id="tabs">Tabs</h2>
            <p>Switchable content panels. Props: <code>labels: string[]</code>. Children snippet receives the active index — use <code>{'{#if active === 0}'}</code> to show/hide panels.</p>

            <Tabs labels={['pnpm', 'check', 'build']}>
              <Tab label="pnpm">
                <CodeSnippet lang="bash" code={`pnpm add fuse.js\npnpm dev`} />
              </Tab>
              <Tab label="check">
                <CodeSnippet lang="bash" code={`pnpm run check`} />
              </Tab>
              <Tab label="build">
                <CodeSnippet lang="bash" code={`pnpm run build`} />
              </Tab>
            </Tabs>

            <Tabs labels={['TypeScript', 'JavaScript']}>
              <Tab label="TypeScript">
                <CodeSnippet lang="typescript" code={`function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}`} />
              </Tab>
              <Tab label="JavaScript">
                <CodeSnippet lang="javascript" code={`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`} />
              </Tab>
            </Tabs>

            <!-- ─── KEY VALUE ─────────────────────────────────────── -->
            <h2 id="keyvalue">KeyValue</h2>
            <p>Definition-list style table. Good for metadata, specs, or property listings. Props: <code>items: {'{key, value}[]'}</code>, optional <code>caption</code>.</p>

            <KeyValue
              items={[
                { key: 'Framework', value: 'SvelteKit 2 + Svelte 5' },
                { key: 'Rendering', value: 'Static (adapter-static)' },
                { key: 'Styling', value: 'Vanilla CSS via app.css' },
                { key: 'Blog', value: 'MDSvex (.svx files)' },
                { key: 'Highlighting', value: 'Shiki (github-dark)' },
                { key: 'Search', value: 'Fuse.js (fuzzy)' },
              ]}
              caption="Portfolio tech stack"
            />

            <KeyValue
              items={[
                { key: 'Border radius', value: '0 — sharp corners only' },
                { key: 'Primary font', value: 'JetBrains Mono' },
                { key: 'Body font', value: 'DM Sans' },
                { key: 'Accent', value: '#e05c3a' },
                { key: 'Background', value: '#080808 (dark) / #f5f2ed (light)' },
              ]}
            />

            <!-- ─── MERMAID ───────────────────────────────────────── -->
            <h2 id="mermaid">Mermaid</h2>
            <p>Renders flowcharts and diagrams via mermaid.js. Props: <code>chart</code>, optional <code>title</code>.</p>

            <Mermaid chart={mermaidFlowchart} title="Blog post processing pipeline" />
            <Mermaid chart={mermaidSequence} />

            <!-- ─── TABLE WRAPPER ────────────────────────────────── -->
            <h2 id="tablewrapper">TableWrapper</h2>
            <p>Responsive scroll wrapper for tables. Optional <code>caption</code> prop.</p>

            <TableWrapper caption="All post components — props reference">
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Props</th>
                    <th>Children</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Callout</td><td>type, title?</td><td>yes</td></tr>
                  <tr><td>Aside</td><td>title?</td><td>yes</td></tr>
                  <tr><td>CodeSnippet</td><td>code, lang?, title?</td><td>no</td></tr>
                  <tr><td>HttpMessage</td><td>message, bodyLang?, title?</td><td>no</td></tr>
                  <tr><td>DiffSnippet</td><td>code, lang?, title?</td><td>no</td></tr>
                  <tr><td>Kbd</td><td>keys: string[]</td><td>no</td></tr>
                  <tr><td>StepList</td><td>—</td><td>yes (Step)</td></tr>
                  <tr><td>Step</td><td>title?</td><td>yes</td></tr>
                  <tr><td>TerminalBlock</td><td>lines, title?</td><td>no</td></tr>
                  <tr><td>Tabs</td><td>labels: string[]</td><td>snippet(active)</td></tr>
                  <tr><td>KeyValue</td><td>items, caption?</td><td>no</td></tr>
                  <tr><td>BlogImage</td><td>src, alt, caption?</td><td>no</td></tr>
                  <tr><td>Mermaid</td><td>chart, title?</td><td>no</td></tr>
                  <tr><td>TableWrapper</td><td>caption?</td><td>yes</td></tr>
                  <tr><td>PostToc</td><td>—</td><td>no</td></tr>
                  <tr><td>PostLangs</td><td>post, availableLangs</td><td>no</td></tr>
                  <tr><td>RelatedPosts</td><td>posts, title?</td><td>no</td></tr>
                </tbody>
              </table>
            </TableWrapper>

            <!-- ─── BLOG IMAGE ─────────────────────────────────────── -->
            <h2 id="blogimage">BlogImage</h2>
            <p>Lazy-loaded image with optional caption. Props: <code>src</code>, <code>alt</code>, optional <code>caption</code>.</p>

            <BlogImage
              src="/images/blog/signature-layers.svg"
              alt="Diagram showing the layers of a digital signature system"
            />

            <BlogImage
              src="/images/blog/signature-layers.svg"
              alt="Diagram showing the layers of a digital signature system"
              caption="Fig. 1 — Digital signature layers: key management, signing, verification, and audit trail."
            />

            <!-- ─── POST LANGS ──────────────────────────────────────── -->
            <h2 id="postlangs">PostLangs</h2>
            <p>Language variant switcher shown at the top of a post. Props: <code>post</code>, <code>availableLangs</code>.</p>

            {#if firstPost}
              <div class="demo-block">
                <PostLangs post={firstPost} {availableLangs} />
              </div>
            {:else}
              <Callout type="warning">
                <p>No posts available to demo PostLangs.</p>
              </Callout>
            {/if}

          </div>

          <!-- ─── RELATED POSTS ──────────────────────────────── -->
          {#if data.posts.length > 0}
            <RelatedPosts
              posts={data.posts.slice(0, 3)}
              title={data.lang === 'pt' ? 'posts disponíveis' : 'available posts'}
            />
          {/if}
        </div>

        <aside class="post-sidebar">
          <PostToc />
        </aside>
      </div>
    </div>
  </article>
</main>

<style>
  .demo-block {
    padding: 1rem 1.25rem;
    border: 1px solid var(--border);
    background: var(--surface);
  }

  @media (max-width: 720px) {
    .demo-block {
      padding: 0.85rem 0.9rem;
    }

    .component-showcase-page :global(.post-head p),
    .component-showcase-page :global(.post-content p),
    .component-showcase-page :global(.post-content li),
    .component-showcase-page :global(.post-content td),
    .component-showcase-page :global(.post-content dd) {
      overflow-wrap: anywhere;
      word-break: normal;
    }

    .component-showcase-page :global(.post-meta) {
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .component-showcase-page :global(.post-content) {
      font-size: 0.92rem;
      line-height: 1.8;
    }

    .component-showcase-page :global(.post-content h2) {
      font-size: 1.05rem;
    }

    .component-showcase-page :global(.post-content h3) {
      font-size: 0.92rem;
    }

    .component-showcase-page :global(.post-content :not(pre) > code) {
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .component-showcase-page :global(.code-snippet figcaption),
    .component-showcase-page :global(.http-message figcaption),
    .component-showcase-page :global(.http-section-label) {
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .component-showcase-page :global(.code-snippet figcaption button),
    .component-showcase-page :global(.http-message figcaption button) {
      margin-left: auto;
    }

    .component-showcase-page :global(.code-snippet pre),
    .component-showcase-page :global(.http-body),
    .component-showcase-page :global(.diff-pre),
    .component-showcase-page :global(.pt-body),
    .component-showcase-page :global(.tabs-panels),
    .component-showcase-page :global(.diagram-surface) {
      padding-left: 0.9rem;
      padding-right: 0.9rem;
    }

    .component-showcase-page :global(.http-start-line) {
      padding: 0.75rem 0.8rem;
    }

    .component-showcase-page :global(.http-chip) {
      min-height: 1.3rem;
      font-size: 0.62rem;
    }

    .component-showcase-page :global(.tabs-nav button) {
      flex: 0 0 auto;
      min-height: 2.3rem;
    }

    .component-showcase-page :global(.kv-row) {
      grid-template-columns: 1fr;
    }

    .component-showcase-page :global(.kv-row dt) {
      border-right: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.25rem;
    }

    .component-showcase-page :global(.kv-row dd) {
      padding-top: 0.35rem;
    }

    .component-showcase-page :global(.post-langs) {
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .component-showcase-page :global(.post-content) {
      font-size: 0.89rem;
    }

    .component-showcase-page :global(.code-snippet pre),
    .component-showcase-page :global(.http-body),
    .component-showcase-page :global(.diff-pre),
    .component-showcase-page :global(.pt-body),
    .component-showcase-page :global(.tabs-panels),
    .component-showcase-page :global(.diagram-surface) {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    .component-showcase-page :global(.step-item) {
      grid-template-columns: 38px 1fr;
    }

    .component-showcase-page :global(.step-body) {
      padding: 0.75rem 0.85rem;
    }
  }
</style>
