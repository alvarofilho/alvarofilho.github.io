<script lang="ts">
  import { getContext } from 'svelte';
  import type { Messages } from '$lib/data/site';

  type CommentReply = {
    author: string;
    date: string;
    body: string;
    handle?: string;
    badge?: string;
    isAuthor?: boolean;
  };

  type CommentItem = {
    author: string;
    date: string;
    body: string;
    handle?: string;
    badge?: string;
    isAuthor?: boolean;
    replies?: CommentReply[];
  };

  type Props = {
    title?: string;
    description?: string;
    comments?: CommentItem[];
    emptyLabel?: string;
    formTitle?: string;
    namePlaceholder?: string;
    messagePlaceholder?: string;
    submitLabel?: string;
  };

  let {
    title,
    description,
    comments = [],
    emptyLabel,
    formTitle,
    namePlaceholder,
    messagePlaceholder,
    submitLabel
  }: Props = $props();

  const getMessages = getContext<(() => Messages) | undefined>('messages');
  const text = $derived(getMessages?.()?.text);
  const totalComments = $derived(
    comments.reduce((count, comment) => count + 1 + (comment.replies?.length ?? 0), 0)
  );
  const resolvedTitle = $derived(title ?? text?.commentsTitle ?? 'comments');
  const resolvedDescription = $derived(description ?? text?.commentsDescription ?? 'Join the discussion below.');
  const resolvedEmptyLabel = $derived(emptyLabel ?? text?.commentsEmpty ?? 'No comments yet.');
  const resolvedFormTitle = $derived(formTitle ?? text?.commentsFormTitle ?? 'leave a comment');
  const resolvedNamePlaceholder = $derived(namePlaceholder ?? text?.commentsNamePlaceholder ?? 'Your name');
  const resolvedMessagePlaceholder = $derived(
    messagePlaceholder ?? text?.commentsMessagePlaceholder ?? 'Share your thoughts...'
  );
  const resolvedSubmitLabel = $derived(submitLabel ?? text?.commentsSubmitLabel ?? 'post comment');
  const discussionKicker = $derived(text?.commentsDiscussionKicker ?? 'discussion');
  const countLabel = $derived(
    totalComments === 1
      ? (text?.commentsCountSingle ?? 'entry')
      : (text?.commentsCountPlural ?? 'entries')
  );
  const commentsListLabel = $derived(text?.commentsListLabel ?? 'Comment thread');
  const commentsRepliesLabel = $derived(text?.commentsRepliesLabel ?? 'Replies to comment');
  const titleSlug = $derived(resolvedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'comments');
  const titleId = $derived(`comments-title-${titleSlug}`);
</script>

<section class="comments-block" aria-labelledby={titleId}>
  <header class="comments-head">
    <div>
      <p class="comments-kicker">// {discussionKicker}</p>
      <h2 id={titleId}>{resolvedTitle}</h2>
    </div>
    <p class="comments-count" aria-live="polite">{totalComments} {countLabel}</p>
  </header>

  <p class="comments-description">{resolvedDescription}</p>

  <div class="comments-form-shell" role="group" aria-label={resolvedFormTitle} aria-describedby={titleId}>
    <p class="comments-form-title">{resolvedFormTitle}</p>
    <div class="comments-form-grid">
      <div class="comments-field">{resolvedNamePlaceholder}</div>
      <div class="comments-field">{resolvedMessagePlaceholder}</div>
    </div>
    <button type="button" disabled aria-label={resolvedSubmitLabel}>{resolvedSubmitLabel}</button>
  </div>

  {#if comments.length}
    <ol class="comments-list" aria-label={commentsListLabel}>
      {#each comments as comment}
        <li class="comment-card">
          <article>
            <header class="comment-head">
              <div class="comment-meta">
                <strong>{comment.author}</strong>
                {#if comment.handle}
                  <span>{comment.handle}</span>
                {/if}
                {#if comment.badge}
                  <span class:author-badge={comment.isAuthor} class="comment-badge">{comment.badge}</span>
                {/if}
              </div>
              <time>{comment.date}</time>
            </header>

            <p class="comment-body">{comment.body}</p>
          </article>

          {#if comment.replies?.length}
            <ol class="comment-replies" aria-label={commentsRepliesLabel}>
              {#each comment.replies as reply}
                <li class="comment-reply">
                  <article>
                    <header class="comment-head">
                      <div class="comment-meta">
                        <strong>{reply.author}</strong>
                        {#if reply.handle}
                          <span>{reply.handle}</span>
                        {/if}
                        {#if reply.badge}
                          <span class:author-badge={reply.isAuthor} class="comment-badge">{reply.badge}</span>
                        {/if}
                      </div>
                      <time>{reply.date}</time>
                    </header>

                    <p class="comment-body">{reply.body}</p>
                  </article>
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {/each}
    </ol>
  {:else}
    <p class="comments-empty">{resolvedEmptyLabel}</p>
  {/if}
</section>

<style>
  .comments-block {
    margin: 2.2rem 0;
    padding: 1.1rem;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, var(--card), color-mix(in srgb, var(--card) 82%, transparent));
  }

  .comments-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .comments-kicker,
  .comments-form-title,
  .comments-count,
  button,
  .comment-meta,
  time {
    font-family: var(--mono);
  }

  .comments-kicker {
    margin-bottom: 0.25rem;
    color: var(--accent);
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 {
    color: var(--text);
    font-family: var(--mono);
    font-size: 1rem;
    line-height: 1.3;
  }

  .comments-count {
    color: var(--dimmer);
    font-size: 0.66rem;
    white-space: nowrap;
  }

  .comments-description,
  .comment-body,
  .comments-empty {
    color: var(--muted);
  }

  .comments-description {
    margin-bottom: 1rem;
  }

  .comments-form-shell {
    margin-bottom: 1rem;
    padding: 0.95rem;
    border: 1px solid var(--border-l);
    background: var(--surface);
  }

  .comments-form-title {
    margin-bottom: 0.7rem;
    color: var(--text);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .comments-form-grid {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 0.75rem;
  }

  .comments-field {
    padding: 0.7rem 0.75rem;
    border: 1px dashed var(--border-l);
    color: var(--dimmer);
    font-family: var(--mono);
    font-size: 0.72rem;
  }

  .comments-field:last-child {
    min-height: 5.8rem;
  }

  button {
    min-height: 2.2rem;
    padding: 0.45rem 0.8rem;
    background: transparent;
    border: 1px solid var(--border-l);
    color: var(--dimmer);
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .comments-list,
  .comment-replies {
    display: grid;
    gap: 0.8rem;
    list-style: none;
  }

  .comment-card,
  .comment-reply {
    border: 1px solid var(--border-l);
    background: var(--surface);
  }

  .comment-card {
    padding: 0.95rem;
  }

  .comment-replies {
    margin-top: 0.85rem;
    margin-left: 1rem;
  }

  .comment-reply {
    padding: 0.8rem;
  }

  .comment-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.8rem;
    margin-bottom: 0.45rem;
  }

  .comment-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem 0.45rem;
    min-width: 0;
    color: var(--dimmer);
    font-size: 0.68rem;
  }

  .comment-meta strong {
    color: var(--text);
    font-size: 0.72rem;
  }

  .comment-badge {
    padding: 0.12rem 0.35rem;
    border: 1px solid var(--border-l);
    color: var(--dimmer);
    font-size: 0.58rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .author-badge {
    border-color: var(--accent);
    color: var(--accent);
  }

  time {
    flex-shrink: 0;
    color: var(--dimmer);
    font-size: 0.62rem;
    white-space: nowrap;
  }

  .comment-body,
  .comments-empty {
    font-size: 0.94rem;
    line-height: 1.75;
    overflow-wrap: anywhere;
  }

  .comments-empty {
    padding: 0.9rem 0;
  }

  @media (max-width: 640px) {
    .comments-block,
    .comment-card,
    .comment-reply,
    .comments-form-shell {
      padding-left: 0.9rem;
      padding-right: 0.9rem;
    }

    .comments-head,
    .comment-head {
      flex-direction: column;
      align-items: flex-start;
    }

    .comments-count,
    time {
      white-space: normal;
    }

    .comment-replies {
      margin-left: 0.55rem;
    }
  }
</style>
