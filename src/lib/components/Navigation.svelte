<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { getOtherLang, languages, type Lang, type Messages } from '$lib/data/site';
  import { contentCatalog } from '$lib/data/posts';
  import {
    canonicalizePath,
    getBlogArticleRoute,
    getBlogPath,
    getDraftIndexPath,
    getHomePath,
    isBlogPath,
    isBlogIndexPath
  } from '$lib/data/url-policy';

  type Props = {
    lang: Lang;
    messages: Messages;
    path: string;
  };

  let { lang, messages, path }: Props = $props();
  let activeSection = $state('');

  const currentPath = $derived(page.url.pathname || path);
  const currentHash = $derived(page.url.hash);
  const otherLang = $derived(getOtherLang(lang));
  const isBlog = $derived(isBlogPath(currentPath));
  const homePath = $derived(getHomePath(lang));
  const isHome = $derived(canonicalizePath(currentPath) === homePath);
  const blogArticleRoute = $derived(getBlogArticleRoute(currentPath));
  const isCommandBlog = $derived(
    isBlogIndexPath(currentPath) ||
      Boolean(blogArticleRoute && contentCatalog.getPublishedPost(blogArticleRoute.lang, blogArticleRoute.slug))
  );
  const isCommandSurface = $derived(isHome || isCommandBlog);
  const otherPath = $derived(getLanguagePath(currentPath, lang, otherLang));
  const activeLinkId = $derived(isBlog ? 'blog' : activeSection);

  const links = $derived([
    { id: 'skills', label: messages.nav.skills, href: `${homePath}#skills` },
    { id: 'projects', label: messages.nav.projects, href: `${homePath}#projects` },
    { id: 'experience', label: messages.nav.experience, href: `${homePath}#experience` },
    { id: 'blog', label: messages.nav.blog, href: getBlogPath(lang) },
    { id: 'contact', label: messages.nav.contact, href: `${homePath}#contact` }
  ]);

  function getAriaCurrent(linkId: string) {
    if (activeLinkId !== linkId) return undefined;
    return linkId === 'blog' ? 'page' : 'location';
  }

  function getLanguagePath(currentPath: string, currentLang: Lang, nextLang: Lang) {
    if (currentPath === '/') {
      return getHomePath(nextLang);
    }

    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 2 && parts[1] === 'blog') {
      if (parts[2] === 'drafts') {
        const draft = parts[3] ? contentCatalog.getDraftPost(currentLang, parts[3]) : undefined;
        if (!draft) return getDraftIndexPath(nextLang);

        const translatedDraft = contentCatalog.getTranslatedDraftPost(draft, nextLang);
        return translatedDraft ? contentCatalog.getDraftPostPath(translatedDraft) : getDraftIndexPath(nextLang);
      }

      const currentPost = contentCatalog.getPublishedPost(currentLang, parts[2]);
      if (currentPost) {
        const translatedPost = contentCatalog.getTranslatedPost(currentPost, nextLang);
        if (translatedPost) return contentCatalog.getPostPath(translatedPost);

        const fallbackOrder = ['en', 'pt', ...languages.filter((l) => l !== 'en' && l !== 'pt')];
        for (const fallbackLang of fallbackOrder) {
          const fallback = contentCatalog.getTranslatedPost(currentPost, fallbackLang as typeof languages[number]);
          if (fallback) return contentCatalog.getPostPath(fallback);
        }
      }
      return getBlogPath(nextLang);
    }

    return currentPath.replace(`/${currentLang}/`, `/${nextLang}/`);
  }

  const scrollTrackedSections = new Set(['skills', 'projects', 'experience', 'blog', 'contact']);

  function getSectionFromHash() {
    const hashId = globalThis.location.hash.slice(1);
    return scrollTrackedSections.has(hashId) && document.getElementById(hashId) ? hashId : '';
  }

  function updateActiveSectionFromScroll() {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]')).filter((section) =>
      scrollTrackedSections.has(section.id)
    );
    const documentBottom = window.scrollY + window.innerHeight;
    const contactSection = sections.find((section) => section.id === 'contact');

    if (contactSection && documentBottom >= document.documentElement.scrollHeight - 8) {
      activeSection = 'contact';
      return;
    }

    const marker = Math.min(window.innerHeight * 0.45, window.innerHeight - 96);
    const currentSection = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= marker && rect.bottom >= marker;
    });

    activeSection = currentSection?.id || '';
  }

  $effect(() => {
    const currentRoutePath = currentPath;
    currentHash;

    if (!browser) return;

    let cancelled = false;
    let frame = 0;

    if (isBlog) {
      activeSection = '';
      return;
    }

    const requestActiveUpdate = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (cancelled || currentRoutePath !== currentPath) return;
        updateActiveSectionFromScroll();
      });
    };

    const handleHashChange = () => {
      tick().then(() => {
        if (cancelled || currentRoutePath !== currentPath) return;
        activeSection = getSectionFromHash();
        if (!activeSection) requestActiveUpdate();
      });
    };

    tick().then(() => {
      if (cancelled || currentRoutePath !== currentPath) return;

      activeSection = getSectionFromHash();
      if (!activeSection) updateActiveSectionFromScroll();

      window.addEventListener('scroll', requestActiveUpdate, { passive: true });
      window.addEventListener('resize', requestActiveUpdate);
      window.addEventListener('hashchange', handleHashChange);
    });

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestActiveUpdate);
      window.removeEventListener('resize', requestActiveUpdate);
      window.removeEventListener('hashchange', handleHashChange);
    };
  });
</script>

<a class="skip-link" href="#main-content">{messages.aria.skipToContent}</a>

<nav class="site-nav" class:site-nav--command={isCommandSurface} aria-label={messages.aria.primaryNavigation}>
  <a href={homePath} class="nav-logo" aria-label={messages.aria.homeLink}>
    <span class="nav-logo-command">AD<span>_</span></span>
    <span class="nav-logo-default"><span class="d">~/</span><span class="a">alvaroduarte</span></span>
  </a>
  <ul class="nav-links">
    {#each links as link, index}
      <li>
        <a href={link.href} class:active={activeLinkId === link.id} aria-current={getAriaCurrent(link.id)}
          ><span class="nav-link-index">0{index + 1}</span>{link.label}</a
        >
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
  <div class="nav-rail-footer" aria-hidden="true">
    <span><i></i> {messages.command.online}</span>
    <small>UTC−03:00</small>
  </div>
</nav>
