<script lang="ts">
  import { fadeIn } from '$lib/actions/fadeIn';
  import { projects, skillGroups, type Lang, type Messages } from '$lib/data/site';
  import { getAllPostsForLang } from '$lib/data/posts';
  import { ArrowRight, ArrowUpRight, Mail } from '@lucide/svelte';
  import { SiDiscord, SiGithub } from '@icons-pack/svelte-simple-icons';
  import HeroTyping from './HeroTyping.svelte';
  import Terminal from './Terminal.svelte';
  import BlogCard from './BlogCard.svelte';

  type Props = {
    lang: Lang;
    messages: Messages;
  };

  let { lang, messages }: Props = $props();
  const posts = $derived(getAllPostsForLang(lang).slice(0, 5));

  function externalLabel(label: string) {
    return `${label} (${messages.text.externalLinkSuffix})`;
  }
</script>

<main>
  <section id="hero">
    <div class="wrap">
      <div class="hero-grid">
        <div>
          <div class="hero-id">
            <img
              id="avatar"
              src="/images/avatar-144.jpg"
              alt={messages.text.avatarAlt}
              width="72"
              height="72"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <h1 class="hero-name">Álvaro<br /><span class="hl">Duarte</span></h1>
          </div>

          <p class="hero-tag">
            <HeroTyping roles={messages.roles} />
          </p>

          <p class="hero-bio">{messages.text.heroBio}</p>

          <div class="hero-btns">
            <a href="#projects" class="btn btn-p">
              {messages.text.heroButton}
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/alvarofilho"
              target="_blank"
              rel="noreferrer"
              class="btn btn-o"
              aria-label={externalLabel('GitHub')}
              >GitHub <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" /></a
            >
          </div>
        </div>

        <Terminal lines={messages.terminal} />
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section id="skills">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>{messages.text.skillsEyebrow}</p>
      <h2 class="sec-title fi" use:fadeIn>{messages.text.skillsTitle}</h2>
      <div class="skills-cats">
        {#each skillGroups as group}
          <div class="scat fi" use:fadeIn>
            <div class="scat-label">{messages.skillLabels[group.key]}</div>
            <div class="scat-items">
              {#each (group.key === 'practices' ? messages.skillGroups.practices : group.items) as item}
                <span class:soft-tag={'soft' in group && group.soft} class="sk-tag">{item}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section id="projects">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>{messages.text.projectsEyebrow}</p>
      <div class="section-head fi" use:fadeIn>
        <h2 class="sec-title">{messages.text.projectsTitle}</h2>
        <a
          href="https://github.com/alvarofilho?tab=repositories"
          target="_blank"
          rel="noreferrer"
          class="btn btn-o section-cta"
          aria-label={externalLabel(messages.text.projectsCta)}
          >{messages.text.projectsCta}<ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" /></a
        >
      </div>
      <div class="proj-grid">
        {#each projects as project, i}
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            class="pc fi"
            aria-label={externalLabel(`${project.name}: ${messages.projectDescriptions[i]}`)}
            use:fadeIn
          >
            <div class="ph">
              <span class="pn">{project.name}</span>
              <span class="parr" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={2} /></span>
            </div>
            <p class="pd">{messages.projectDescriptions[i]}</p>
            <div class="ptags">
              {#each project.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section id="experience">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>{messages.text.experienceEyebrow}</p>
      <h2 class="sec-title fi" use:fadeIn>{messages.text.experienceTitle}</h2>
      <div class="exp-list">
        <div class="exp-row fi" use:fadeIn>
          <div class="exp-meta">
            <div class="exp-date">{messages.experience.date}</div>
            <div class="exp-loc">{messages.experience.location}</div>
          </div>
          <div>
            <div class="exp-co">Lacuna Software</div>
            <div class="exp-role">{messages.experience.role}</div>
            <ul class="exp-bullets">
              {#each messages.experience.bullets as bullet}
                <li>{bullet}</li>
              {/each}
            </ul>
            <div class="exp-tech">
              {#each messages.experience.tech as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section id="blog">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>{messages.text.blogEyebrow}</p>
      <h2 class="sec-title fi" use:fadeIn>{messages.text.blogTitle}</h2>
      {#if posts.length}
        <div class="blog-list fi" use:fadeIn>
          {#each posts as post, index}
            <BlogCard {post} {index} />
          {/each}
        </div>
        <a href={`/${lang}/blog/`} class="blog-cta-row fi" use:fadeIn>
          <span>
            <span class="blog-cta-main">{messages.text.blogCta}</span>
            <span class="blog-cta-hint">{messages.text.blogHint}</span>
          </span>
          <span class="blog-cta-arr" aria-hidden="true"><ArrowRight size={18} strokeWidth={2} /></span>
        </a>
      {:else}
        <div class="blog-coming fi" use:fadeIn>
          <span class="blog-coming-em">{messages.text.blogEmptyStatus}</span>
          <p class="blog-coming-sub">{messages.text.blogEmptyText}</p>
        </div>
      {/if}
    </div>
  </section>

  <div class="rule"></div>

  <section id="contact">
    <div class="wrap">
      <p class="eyebrow fi" use:fadeIn>{messages.text.contactEyebrow}</p>
      <h2 class="sec-title fi" use:fadeIn>{messages.text.contactTitle}</h2>
      <div class="contact-list fi" use:fadeIn>
        <a
          href="https://linkedin.com/in/alvarofsd"
          target="_blank"
          rel="noreferrer"
          class="cl"
          aria-label={externalLabel('LinkedIn alvarofsd')}
        >
          <span class="cl-left">
            <span class="cl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"
                />
              </svg>
            </span>
            <span><span class="cl-label">LinkedIn</span><span class="cl-handle">alvarofsd</span></span>
          </span>
          <span class="cl-arr" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={2} /></span>
        </a>
        <a href="mailto:eu@alvaro.dev.br" class="cl">
          <span class="cl-left">
            <span class="cl-icon"><Mail size={15} strokeWidth={2} /></span>
            <span><span class="cl-label">Email</span><span class="cl-handle">eu@alvaro.dev.br</span></span>
          </span>
          <span class="cl-arr" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={2} /></span>
        </a>
        <a
          href="https://github.com/alvarofilho"
          target="_blank"
          rel="noreferrer"
          class="cl"
          aria-label={externalLabel('GitHub @alvarofilho')}
        >
          <span class="cl-left">
            <span class="cl-icon"><SiGithub size={15} title="GitHub" /></span>
            <span><span class="cl-label">GitHub</span><span class="cl-handle">@alvarofilho</span></span>
          </span>
          <span class="cl-arr" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={2} /></span>
        </a>
        <div class="cl">
          <span class="cl-left">
            <span class="cl-icon"><SiDiscord size={15} title="Discord" /></span>
            <span><span class="cl-label">Discord</span><span class="cl-handle">alvaroduarte</span></span>
          </span>
        </div>
      </div>
    </div>
  </section>
</main>
