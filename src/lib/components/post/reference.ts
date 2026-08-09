export const postComponentReference = [
  { id: 'callout', name: 'Callout', interface: 'type, title?' },
  { id: 'comments', name: 'Comments', interface: 'comments, labels?' },
  { id: 'aside', name: 'Aside', interface: 'title?' },
  { id: 'codesnippet', name: 'CodeSnippet', interface: 'code, lang, title?' },
  { id: 'httpmessage', name: 'HttpMessage', interface: 'message, title?' },
  { id: 'diffsnippet', name: 'DiffSnippet', interface: 'code, title?' },
  { id: 'kbd', name: 'Kbd', interface: 'keys' },
  { id: 'steplist', name: 'StepList + Step', interface: 'children, title?' },
  { id: 'terminalblock', name: 'TerminalBlock', interface: 'lines, title?' },
  { id: 'tabs', name: 'Tabs + Tab', interface: 'children' },
  { id: 'keyvalue', name: 'KeyValue', interface: 'entries' },
  { id: 'mermaid', name: 'Mermaid', interface: 'chart, title?' },
  { id: 'tablewrapper', name: 'TableWrapper', interface: 'children' },
  { id: 'blogimage', name: 'BlogImage', interface: 'src, alt, caption?' },
  { id: 'postlangs', name: 'PostLangs', interface: 'post, availableLangs' }
] as const;
