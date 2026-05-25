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
