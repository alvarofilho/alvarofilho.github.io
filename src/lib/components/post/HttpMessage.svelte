<script lang="ts">
  import { getContext } from 'svelte';
  import type { Messages } from '$lib/data/site';

  type HeaderLine = {
    name: string;
    value: string;
  };

  type ParsedHttpMessage = {
    kind: 'request' | 'response' | 'message';
    startLine: string;
    method?: string;
    target?: string;
    protocol?: string;
    status?: string;
    reason?: string;
    statusClass?: string;
    headers: HeaderLine[];
    body: string;
  };

  type Props = {
    message: string;
    bodyLang?: string;
    title?: string;
  };

  let { message, bodyLang, title }: Props = $props();
  let copied = $state(false);

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const text = $derived(getMessages?.()?.text);
  const copyLabel = $derived(text?.codeCopy ?? 'copy');
  const copiedLabel = $derived(text?.codeCopied ?? 'copied');

  const parsed = $derived(parseHttpMessage(message));
  const label = $derived(title ?? getDefaultTitle(parsed, text));
  const resolvedBodyLang = $derived(bodyLang ?? inferBodyLang(parsed));
  const highlightedBody = $derived(highlightBody(parsed.body.trim(), resolvedBodyLang));

  function parseHttpMessage(raw: string): ParsedHttpMessage {
    const normalized = raw.trim();
    const [head = '', ...bodyParts] = normalized.split(/\r?\n\r?\n/);
    const [startLine = '', ...headerLines] = head.split(/\r?\n/);
    const requestMatch = /^([A-Z]+)\s+(\S+)\s+(HTTP\/\d(?:\.\d)?)$/.exec(startLine);
    const responseMatch = /^(HTTP\/\d(?:\.\d)?)\s+(\d{3})(?:\s+(.*))?$/.exec(startLine);
    const headers = headerLines
      .map((line) => {
        const separator = line.indexOf(':');

        if (separator === -1) {
          return { name: line, value: '' };
        }

        return {
          name: line.slice(0, separator).trim(),
          value: line.slice(separator + 1).trim(),
        };
      })
      .filter((header) => header.name.length > 0);

    if (requestMatch) {
      return {
        kind: 'request',
        startLine,
        method: requestMatch[1],
        target: requestMatch[2],
        protocol: requestMatch[3],
        headers,
        body: bodyParts.join('\n\n'),
      };
    }

    if (responseMatch) {
      return {
        kind: 'response',
        startLine,
        protocol: responseMatch[1],
        status: responseMatch[2],
        reason: responseMatch[3] ?? '',
        statusClass: `status-${responseMatch[2][0]}xx`,
        headers,
        body: bodyParts.join('\n\n'),
      };
    }

    return {
      kind: 'message',
      startLine,
      headers,
      body: bodyParts.join('\n\n'),
    };
  }

  function getDefaultTitle(parsedMessage: ParsedHttpMessage, labels: Messages['text'] | undefined) {
    if (parsedMessage.kind === 'request') {
      return labels?.httpRequest ?? 'HTTP request';
    }

    if (parsedMessage.kind === 'response') {
      return labels?.httpResponse ?? 'HTTP response';
    }

    return labels?.httpMessage ?? 'HTTP message';
  }

  function inferBodyLang(parsedMessage: ParsedHttpMessage) {
    const contentType = parsedMessage.headers
      .find((header) => header.name.toLowerCase() === 'content-type')
      ?.value.toLowerCase() ?? '';
    const body = parsedMessage.body.trimStart();

    if (contentType.includes('json') || body.startsWith('{') || body.startsWith('[')) {
      return 'json';
    }

    if (contentType.includes('html') || body.startsWith('<!doctype') || body.startsWith('<html')) {
      return 'html';
    }

    if (contentType.includes('xml') || body.startsWith('<?xml')) {
      return 'xml';
    }

    if (contentType.includes('javascript')) {
      return 'javascript';
    }

    return 'text';
  }

  function escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function highlightBody(body: string, lang: string) {
    if (lang === 'json') {
      return highlightJson(body);
    }

    if (lang === 'html' || lang === 'xml') {
      return highlightMarkup(body);
    }

    return escapeHtml(body);
  }

  function highlightJson(body: string) {
    const tokenPattern = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;

    return body.replace(tokenPattern, (match, stringToken: string | undefined, colon: string | undefined) => {
      if (stringToken) {
        const tokenClass = colon ? 'http-token-key' : 'http-token-string';
        return `<span class="${tokenClass}">${escapeHtml(stringToken)}</span>${escapeHtml(colon ?? '')}`;
      }

      if (match === 'true' || match === 'false') {
        return `<span class="http-token-bool">${match}</span>`;
      }

      if (match === 'null') {
        return '<span class="http-token-null">null</span>';
      }

      return `<span class="http-token-number">${match}</span>`;
    });
  }

  function highlightMarkup(body: string) {
    return body.replace(/(<\/?)([A-Za-z][\w:-]*)([^>]*)(>)/g, (_match, open: string, name: string, attrs: string, close: string) => {
      const highlightedAttrs = attrs.replace(/([\w:-]+)(=)("[^"]*"|'[^']*')/g, (_attrMatch: string, attrName: string, equals: string, value: string) =>
        `<span class="http-token-attr">${escapeHtml(attrName)}</span>${equals}<span class="http-token-string">${escapeHtml(value)}</span>`
      );

      return `<span class="http-token-tag">${escapeHtml(open)}</span><span class="http-token-name">${escapeHtml(name)}</span>${highlightedAttrs}<span class="http-token-tag">${escapeHtml(close)}</span>`;
    });
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(message.trim());
    copied = true;
    window.setTimeout(() => (copied = false), 1400);
  }
</script>

<figure class="http-message http-message-{parsed.kind}">
  <figcaption>
    <span>{label}</span>
    <button type="button" onclick={copyMessage} aria-label={`${copyLabel}: ${label}`} aria-live="polite">
      {copied ? copiedLabel : copyLabel}
    </button>
  </figcaption>

  <div class="http-start-line">
    {#if parsed.kind === 'request'}
      <span class="http-chip http-method">{parsed.method}</span>
      <span class="http-target">{parsed.target}</span>
      <span class="http-protocol">{parsed.protocol}</span>
    {:else if parsed.kind === 'response'}
      <span class="http-protocol">{parsed.protocol}</span>
      <span class="http-chip http-status {parsed.statusClass}">{parsed.status}</span>
      {#if parsed.reason}
        <span class="http-reason">{parsed.reason}</span>
      {/if}
    {:else}
      <span class="http-target">{parsed.startLine}</span>
    {/if}
  </div>

  {#if parsed.headers.length > 0}
    <div class="http-section">
      <p class="http-section-label">{text?.httpHeaders ?? 'headers'}</p>
      <dl class="http-headers">
        {#each parsed.headers as header}
          <div>
            <dt>{header.name}</dt>
            <dd>{header.value}</dd>
          </div>
        {/each}
      </dl>
    </div>
  {/if}

  {#if parsed.body}
    <div class="http-section">
      <p class="http-section-label">
        <span>{text?.httpBody ?? 'body'}</span>
        <span>{resolvedBodyLang}</span>
      </p>
      <div class="http-body">
        <pre><code class="language-{resolvedBodyLang}">{@html highlightedBody}</code></pre>
      </div>
    </div>
  {/if}
</figure>
