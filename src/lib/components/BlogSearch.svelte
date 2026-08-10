<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { discoverBlogPosts, POSTS_PER_PAGE } from '$lib/data/blog-discovery';
  import BlogCard from './BlogCard.svelte';
  import type { PostMeta } from '$lib/data/posts';
  import type { Messages } from '$lib/data/site';
  import { Search } from '@lucide/svelte';

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

  let mounted = false;

  let currentPage = $state(1);
  $effect(() => {
    if (!browser) return;
    currentPage = Math.max(1, Number(page.url.searchParams.get('page') ?? '1'));
  });
  const discovery = $derived(
    discoverBlogPosts(posts, {
      query: debouncedQuery,
      selectedTags,
      tagQuery,
      page: currentPage
    })
  );

  $effect(() => {
    const nextQuery = query;
    const timeoutId = window.setTimeout(() => {
      debouncedQuery = nextQuery;
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
  <section class="blog-command-log" aria-labelledby="blog-log-title">
    <header class="blog-command-log-head">
      <div>
        <span>{messages.command.blogNotesEyebrow}</span>
        <h2 id="blog-log-title">{messages.command.blogNotesLog}</h2>
      </div>
      <label class="blog-command-search" for="blog-search">
        <Search size={15} aria-hidden="true" />
        <span>{messages.command.blogSearchCommand}</span>
        <input
          id="blog-search"
          bind:value={query}
          class="search-input"
          type="search"
          aria-label={messages.text.blogSearchLabel}
          placeholder={messages.text.blogSearchPlaceholder}
          autocomplete="off"
        />
      </label>
    </header>

    <div class="blog-search fi on">

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
          {#if discovery.hasHiddenTags}
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
          {#each discovery.popularTags as { tag, count }}
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
              {#each discovery.matchingTags as { tag, count }}
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
        <span>
          {discovery.filteredPosts.length}
          {discovery.filteredPosts.length === 1 ? messages.text.blogResultsSummarySingle : messages.text.blogResultsSummary}
        </span>
        {#if discovery.hasFilters}
          <button type="button" onclick={clearFilters}>{messages.text.blogClearFilters}</button>
        {/if}
      </div>
    </div>

    {#if discovery.filteredPosts.length}
      <div class="blog-list fi on">
        {#each discovery.visiblePosts as post, i}
          <BlogCard {post} index={discovery.filteredPosts.length - 1 - ((discovery.safePage - 1) * POSTS_PER_PAGE + i)} />
        {/each}
      </div>
      {#if discovery.totalPages > 1}
        <nav class="blog-pagination" aria-label={messages.text.blogPaginationLabel}>
          <button
            type="button"
            class="pg-btn pg-arrow"
            disabled={discovery.safePage <= 1}
            onclick={() => setPage(discovery.safePage - 1)}
            aria-label={messages.text.blogPreviousPageLabel}
          >←</button>
          {#each Array.from({ length: discovery.totalPages }, (_, i) => i + 1) as pageNum}
            <button
              type="button"
              class="pg-btn"
              class:active={pageNum === discovery.safePage}
              onclick={() => setPage(pageNum)}
              aria-label={`${pageNum === discovery.safePage ? messages.text.blogCurrentPageLabel : messages.text.blogPageLabel} ${pageNum}`}
              aria-current={pageNum === discovery.safePage ? 'page' : undefined}
            >{pageNum}</button>
          {/each}
          <button
            type="button"
            class="pg-btn pg-arrow"
            disabled={discovery.safePage >= discovery.totalPages}
            onclick={() => setPage(discovery.safePage + 1)}
            aria-label={messages.text.blogNextPageLabel}
          >→</button>
        </nav>
      {/if}
    {:else}
      <div class="blog-no-results fi on">
        <p>{messages.text.blogNoResults}</p>
        {#if discovery.hasFilters}
          <button type="button" class="btn btn-o" onclick={clearFilters}>{messages.text.blogClearFilters}</button>
        {/if}
      </div>
    {/if}
  </section>
{:else}
  <div class="blog-no-results fi on">
    <p>{messages.text.blogEmptyText}</p>
  </div>
{/if}
