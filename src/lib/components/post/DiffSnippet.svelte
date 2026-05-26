<script lang="ts">
  type DiffLine = { type: 'add' | 'remove' | 'meta' | 'ctx'; content: string };

  type Props = {
    code: string;
    lang?: string;
    title?: string;
  };

  let { code, lang = 'diff', title }: Props = $props();

  const lines = $derived<DiffLine[]>(
    code.trim().split('\n').map((line) => {
      if (line.startsWith('+') && !line.startsWith('+++')) return { type: 'add', content: line };
      if (line.startsWith('-') && !line.startsWith('---')) return { type: 'remove', content: line };
      if (line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++'))
        return { type: 'meta', content: line };
      return { type: 'ctx', content: line };
    })
  );
</script>

<figure class="diff-snippet">
  <figcaption>
    <span class="diff-label">{title || lang}</span>
  </figcaption>
<pre class="diff-pre"><code>{#each lines as line}<span class="diff-line diff-{line.type}">{line.content}
</span>{/each}</code></pre>
</figure>

<style>
  .diff-snippet {
    margin: 1.7rem 0;
    border: 1px solid var(--border-l);
    background: #0f0f0f;
    font-family: var(--mono);
  }

  figcaption {
    display: flex;
    align-items: center;
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--border-l);
    color: var(--accent);
    font-size: 0.65rem;
  }

  .diff-pre {
    margin: 0;
    padding: 1rem 0;
    overflow-x: auto;
    font-size: 0.83rem;
    line-height: 1.65;
    background: transparent;
  }

  .diff-pre code {
    display: block;
  }

  .diff-line {
    display: block;
    padding: 0 1.25rem;
    white-space: pre;
  }

  .diff-add {
    background: rgba(61, 214, 140, 0.1);
    color: #3dd68c;
  }

  .diff-remove {
    background: rgba(224, 92, 58, 0.1);
    color: #e05c3a;
  }

  .diff-meta {
    color: #555;
  }

  .diff-ctx {
    color: #edeae5;
  }
</style>
