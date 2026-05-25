<script lang="ts">
  import { onMount } from 'svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { getOtherLang, languages, type Lang, type Messages } from '$lib/data/site';
  import { getDraftPost, getDraftPostPath, getPost, getPostPath, getTranslatedDraftPost, getTranslatedPost } from '$lib/data/posts';

  type Props = {
    lang: Lang;
    messages: Messages;
    path: string;
  };

  let { lang, messages, path }: Props = $props();
  let active = $state('hero');

  const otherLang = $derived(getOtherLang(lang));
  const isBlog = $derived(path.includes('/blog'));
  const homePath = $derived(path === '/' ? '/' : `/${lang}/`);
  const otherPath = $derived(getLanguagePath(path, lang, otherLang));

  const links = $derived([
    { id: 'skills', label: messages.nav.skills, href: `${homePath}#skills` },
    { id: 'projects', label: messages.nav.projects, href: `${homePath}#projects` },
    { id: 'experience', label: messages.nav.experience, href: `${homePath}#experience` },
    { id: 'blog', label: messages.nav.blog, href: `/${lang}/blog/` },
    { id: 'contact', label: messages.nav.contact, href: `${homePath}#contact` }
  ]);

  function getLanguagePath(currentPath: string, currentLang: Lang, nextLang: Lang) {
    if (currentPath === '/') {
      return `/${nextLang}/`;
    }

    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 2 && parts[1] === 'blog') {
      if (parts[2] === 'drafts') {
        const draft = parts[3] ? getDraftPost(currentLang, parts[3]) : undefined;
        if (!draft) return `/${nextLang}/blog/drafts/`;

        const translatedDraft = getTranslatedDraftPost(draft, nextLang);
        return translatedDraft ? getDraftPostPath(translatedDraft) : `/${nextLang}/blog/drafts/`;
      }

      const currentPost = getPost(currentLang, parts[2]);
      if (currentPost) {
        const translatedPost = getTranslatedPost(currentPost, nextLang);
        if (translatedPost) return getPostPath(translatedPost);

        const fallbackOrder = ['en', 'pt', ...languages.filter((l) => l !== 'en' && l !== 'pt')];
        for (const fallbackLang of fallbackOrder) {
          const fallback = getTranslatedPost(currentPost, fallbackLang as typeof languages[number]);
          if (fallback) return getPostPath(fallback);
        }
      }
      return `/${nextLang}/blog/`;
    }

    return currentPath.replace(`/${currentLang}/`, `/${nextLang}/`);
  }

  onMount(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (!('IntersectionObserver' in window) || isBlog) {
      active = isBlog ? 'blog' : 'hero';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active = entry.target.id;
          }
        }
      },
      { threshold: 0.35 }
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  });
</script>

<nav class="site-nav">
  <a href={homePath} class="nav-logo">
    <span class="d">~/</span><span class="a">alvaroduarte</span>
  </a>
  <ul class="nav-links">
    {#each links as link}
      <li>
        <a href={link.href} class:active={active === link.id}>{link.label}</a>
      </li>
    {/each}
  </ul>
  <div class="nav-actions">
    <ThemeToggle {messages} />
    <a
      class="lang-btn"
      href={otherPath}
      data-sveltekit-noscroll
      aria-label={messages.aria.languageButton}
      title={`${messages.language.current}: ${lang.toUpperCase()}`}
    >
      {lang.toUpperCase()}
    </a>
  </div>
</nav>
