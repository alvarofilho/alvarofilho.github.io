<script lang="ts">
  import { onMount } from 'svelte';
  import type { Messages } from '$lib/data/site';

  type ThemeMode = 'system' | 'dark' | 'light';

  type Props = {
    messages: Messages;
  };

  let { messages }: Props = $props();

  const modes: ThemeMode[] = ['system', 'dark', 'light'];
  const icon: Record<ThemeMode, string> = {
    system: '●',
    dark: '☾',
    light: '☀'
  };

  let mode = $state<ThemeMode>('system');
  let resolvedTheme = $state<'dark' | 'light'>('dark');
  let mediaQuery: MediaQueryList | undefined;

  function normalize(value: string | null): ThemeMode {
    return modes.includes(value as ThemeMode) ? (value as ThemeMode) : 'system';
  }

  function resolveTheme(nextMode = mode) {
    if (nextMode === 'system') {
      return mediaQuery?.matches ? 'light' : 'dark';
    }

    return nextMode;
  }

  function applyTheme() {
    resolvedTheme = resolveTheme();
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = resolvedTheme;
  }

  function nextMode() {
    const currentIndex = modes.indexOf(mode);
    mode = modes[(currentIndex + 1) % modes.length];
    localStorage.setItem('theme', mode);
    applyTheme();
  }

  onMount(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery = query;
    mode = normalize(localStorage.getItem('theme'));
    applyTheme();

    const listener = () => {
      if (mode === 'system') {
        applyTheme();
      }
    };

    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  });

  const label = $derived(`${messages.aria.themeToggle}: ${messages.theme[mode]}. ${messages.aria.themeNext}: ${
    messages.theme[modes[(modes.indexOf(mode) + 1) % modes.length]]
  }.`);
</script>

<button
  id="theme-btn"
  type="button"
  class="lang-btn theme-btn"
  data-mode={mode}
  aria-label={label}
  title={`${messages.theme[mode]} (${resolvedTheme})`}
  onclick={nextMode}
>
  {icon[mode]}
</button>
