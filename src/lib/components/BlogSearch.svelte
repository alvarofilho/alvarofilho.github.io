<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Fuse from 'fuse.js';
  import BlogCard from './BlogCard.svelte';
  import type { PostMeta } from '$lib/data/posts';
  import type { Messages } from '$lib/data/site';

  type Props = {
    posts: PostMeta[];
    messages: Messages;
  };

  let { posts, messages }: Props = $props();
  let query = $state('');
  let debouncedQuery = $state('');
  let tagQuery = $state('');
  let selectedTags = $state<string[]>([]);
  let showAdvancedFilters = $state(false);

  const POSTS_PER_PAGE = 10;
  const popularTagLimit = 8;
  let mounted = false;

  const fuse = $derived(
    new Fuse(posts, {
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'description', weight: 0.35 },
        { name: 'tags', weight: 0.15 },
        { name: 'searchText', weight: 0.05 }
      ],
      threshold: 0.35,
      ignoreLocation: true,
      includeScore: true,
      shouldSort: true,
      useExtendedSearch: true
    })
  );

  const textMatches = $derived(
    debouncedQuery.trim() ? fuse.search(debouncedQuery.trim()).map((result) => result.item) : posts
  );

  const filteredPosts = $derived(
    textMatches.filter((post) => selectedTags.every((tag) => post.tags.includes(tag)))
  );

  const compatibleTagStats = $derived(
    Array.from(
      filteredPosts
        .flatMap((post) => post.tags)
        .filter((tag) => !selectedTags.includes(tag))
        .reduce((counts, tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1), new Map<string, number>())
        .entries()
    )
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  );

  const normalizedTagQuery = $derived(normalizeSearch(tagQuery));
  const matchingTags = $derived(
    compatibleTagStats.filter(({ tag }) => normalizeSearch(tag).includes(normalizedTagQuery))
  );
  const popularTags = $derived(compatibleTagStats.slice(0, popularTagLimit));
  const hasHiddenTags = $derived(compatibleTagStats.length > popularTagLimit);
  const hasFilters = $derived(Boolean(query.trim()) || selectedTags.length > 0);

  let currentPage = $state(1);
  $effect(() => {
    if (!browser) return;
    currentPage = Math.max(1, Number(page.url.searchParams.get('page') ?? '1'));
  });
  const totalPages = $derived(Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE)));
  const safePage = $derived(Math.min(currentPage, totalPages));
  const visiblePosts = $derived(
    filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE)
  );

  $effect(() => {
    const timeoutId = window.setTimeout(() => {
      debouncedQuery = query;
    }, 180);
    return () => window.clearTimeout(timeoutId);
  });

  $effect(() => {
    debouncedQuery;
    selectedTags;
    if (mounted) resetPage();
  });

  onMount(() => {
    mounted = true;
  });

  function setPage(n: number) {
    const url = new URL(page.url);
    url.searchParams.set('page', String(n));
    goto(url.toString(), { keepFocus: true });
  }

  function resetPage() {
    if (!page.url.searchParams.has('page')) return;
    const url = new URL(page.url);
    url.searchParams.delete('page');
    goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
  }

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];
  }

  function clearFilters() {
    query = '';
    debouncedQuery = '';
    tagQuery = '';
    selectedTags = [];
    showAdvancedFilters = false;
  }

  function normalizeSearch(value: string) {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  function isTagSelected(tag: string) {
    return selectedTags.includes(tag);
  }

  function getTagFilterLabel(tag: string) {
    return `${messages.text.blogFilterByTagLabel}: ${tag}`;
  }

  function getTagRemoveLabel(tag: string) {
    return `${messages.text.blogRemoveTagLabel}: ${tag}`;
  }
</script>

{#if posts.length}
  <div class="blog-search fi on">
    <label class="search-label" for="blog-search">{messages.text.blogSearchLabel}</label>
    <input
      id="blog-search"
      bind:value={query}
      class="search-input"
      type="search"
      placeholder={messages.text.blogSearchPlaceholder}
      autocomplete="off"
    />

    <div class="search-tags compact" aria-label={messages.text.blogTagFilter}>
      {#if selectedTags.length}
        <div class="selected-tags" aria-label={messages.text.blogSelectedTags}>
          {#each selectedTags as tag}
            <button
              type="button"
              class="search-tag selected"
              aria-pressed={true}
              aria-label={getTagRemoveLabel(tag)}
              onclick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          {/each}
        </div>
      {/if}

      <div class="tag-row-head">
        <span>{messages.text.blogPopularTags}</span>
        {#if hasHiddenTags}
          <button
            type="button"
            aria-controls="advanced-tag-filters"
            aria-expanded={showAdvancedFilters}
            onclick={() => (showAdvancedFilters = !showAdvancedFilters)}
          >
            {showAdvancedFilters ? messages.text.blogHideFilters : messages.text.blogAdvancedFilters}
          </button>
        {/if}
      </div>

      <div class="available-tags">
        {#each popularTags as { tag, count }}
          <button
            type="button"
            class:selected={isTagSelected(tag)}
            class="search-tag"
            aria-pressed={isTagSelected(tag)}
            aria-label={getTagFilterLabel(tag)}
            onclick={() => toggleTag(tag)}
          >
            {tag}<span>{count}</span>
          </button>
        {/each}
      </div>

      {#if showAdvancedFilters}
        <div id="advanced-tag-filters" class="advanced-tags">
          <input
            bind:value={tagQuery}
            class="tag-search-input"
            type="search"
            aria-label={messages.text.blogTagSearchLabel}
            placeholder={messages.text.blogTagSearchPlaceholder}
            autocomplete="off"
          />

          <div class="available-tags all-tags">
            {#each matchingTags as { tag, count }}
              <button
                type="button"
                class:selected={isTagSelected(tag)}
                class="search-tag"
                aria-pressed={isTagSelected(tag)}
                aria-label={getTagFilterLabel(tag)}
                onclick={() => toggleTag(tag)}
              >
                {tag}<span>{count}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div
      class="search-summary"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{filteredPosts.length} {messages.text.blogResultsSummary}</span>
      {#if hasFilters}
        <button type="button" onclick={clearFilters}>{messages.text.blogClearFilters}</button>
      {/if}
    </div>
  </div>

  {#if filteredPosts.length}
    <div class="blog-list fi on">
      {#each visiblePosts as post, i}
        <BlogCard {post} index={(safePage - 1) * POSTS_PER_PAGE + i} />
      {/each}
    </div>
    {#if totalPages > 1}
      <nav class="blog-pagination" aria-label={messages.text.blogPaginationLabel}>
        <button
          type="button"
          class="pg-btn pg-arrow"
          disabled={safePage <= 1}
          onclick={() => setPage(safePage - 1)}
          aria-label={messages.text.blogPreviousPageLabel}
        >←</button>
        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
          <button
            type="button"
            class="pg-btn"
            class:active={pageNum === safePage}
            onclick={() => setPage(pageNum)}
            aria-label={`${pageNum === safePage ? messages.text.blogCurrentPageLabel : messages.text.blogPageLabel} ${pageNum}`}
            aria-current={pageNum === safePage ? 'page' : undefined}
          >{pageNum}</button>
        {/each}
        <button
          type="button"
          class="pg-btn pg-arrow"
          disabled={safePage >= totalPages}
          onclick={() => setPage(safePage + 1)}
          aria-label={messages.text.blogNextPageLabel}
        >→</button>
      </nav>
    {/if}
  {:else}
    <div class="blog-no-results fi on">
      <p>{messages.text.blogNoResults}</p>
      {#if hasFilters}
        <button type="button" class="btn btn-o" onclick={clearFilters}>{messages.text.blogClearFilters}</button>
      {/if}
    </div>
  {/if}
{:else}
  <div class="blog-no-results fi on">
    <p>{messages.text.blogEmptyText}</p>
  </div>
{/if}
