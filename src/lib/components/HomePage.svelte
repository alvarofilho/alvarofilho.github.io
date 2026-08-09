<script lang="ts">
  import { fadeIn } from '$lib/actions/fadeIn';
  import { contentCatalog } from '$lib/data/posts';
  import { formatDate, projects, skillGroups, type Lang, type Messages } from '$lib/data/site';
  import { ArrowRight, ArrowUpRight, Circle, Mail, MapPin } from '@lucide/svelte';
  import { SiDiscord, SiGithub } from '@icons-pack/svelte-simple-icons';
  import HeroTyping from './HeroTyping.svelte';

  type Props = {
    lang: Lang;
    messages: Messages;
  };

  let { lang, messages }: Props = $props();
  const allPosts = $derived(contentCatalog.getAllPostsForLang(lang));
  const posts = $derived(allPosts.slice(0, 5));

  function externalLabel(label: string) {
    return `${label} (${messages.text.externalLinkSuffix})`;
  }
</script>

<main class="command-home">
  <section class="cmd-overview" aria-labelledby="home-title">
    <article class="cmd-panel cmd-identity">
      <div class="cmd-panel-bar"><span>{messages.command.profileFile}</span><span aria-hidden="true">● ● ●</span></div>
      <div class="cmd-identity-body">
        <img
          src="/images/avatar-144.jpg"
          alt={messages.text.avatarAlt}
          width="112"
          height="112"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
        <div>
          <span class="cmd-prompt">$ whoami</span>
          <h1 id="home-title">Álvaro Duarte</h1>
          <div class="cmd-role"><HeroTyping roles={messages.roles} /></div>
          <span class="cmd-location"><MapPin size={13} aria-hidden="true" /> {messages.experience.location}</span>
        </div>
      </div>
    </article>

    <article class="cmd-panel cmd-mission">
      <div class="cmd-panel-bar"><span>{messages.command.missionFile}</span><span>{messages.command.readOnly}</span></div>
      <div class="cmd-mission-body">
        <span class="cmd-comment">{messages.command.systemScope}</span>
        <h2>{messages.command.missionLead}<br /><em>{messages.command.missionOutcome}</em></h2>
        <p>{messages.text.heroBio}</p>
        <div class="cmd-mission-links">
          <a href="#projects" class="cmd-action">
            {messages.text.heroButton}<ArrowRight size={14} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/alvarofilho"
            target="_blank"
            rel="noreferrer"
            class="cmd-action cmd-action-secondary"
            aria-label={externalLabel('GitHub')}
          >
            <SiGithub size={14} title="GitHub" /> GitHub
          </a>
        </div>
      </div>
    </article>

    <article class="cmd-panel cmd-metric">
      <span>{messages.nav.experience}</span>
      <strong>01</strong>
      <small>{messages.command.currentRole}</small>
    </article>
    <article class="cmd-panel cmd-metric">
      <span>{messages.command.focus}</span>
      <strong>PKI</strong>
      <small>{messages.command.securityTrust}</small>
    </article>
    <article class="cmd-panel cmd-metric">
      <span>{messages.nav.blog}</span>
      <strong>{String(allPosts.length).padStart(2, '0')}</strong>
      <small>{messages.command.deepDives}</small>
    </article>
  </section>

  <section class="cmd-section" id="skills" aria-labelledby="skills-title">
    <div class="cmd-section-head fi" use:fadeIn>
      <div>
        <span>01 / {messages.text.skillsEyebrow}</span>
        <h2 id="skills-title">{messages.text.skillsTitle}</h2>
      </div>
      <span class="cmd-status"><i></i> {messages.command.systemReady}</span>
    </div>
    <div class="cmd-stack-grid fi" use:fadeIn>
      {#each skillGroups as group, index}
        <article class:cmd-stack-wide={group.key === 'practices'}>
          <div><span>0{index + 1}</span><small>{messages.skillLabels[group.key]}</small></div>
          <p>
            {#each (group.key === 'practices' ? messages.skillGroups.practices : group.items) as item}
              <b class:cmd-soft={'soft' in group && group.soft}>{item}</b>
            {/each}
          </p>
        </article>
      {/each}
    </div>
  </section>

  <section class="cmd-section" id="projects" aria-labelledby="projects-title">
    <div class="cmd-section-head fi" use:fadeIn>
      <div>
        <span>02 / {messages.text.projectsEyebrow}</span>
        <h2 id="projects-title">{messages.text.projectsTitle}</h2>
      </div>
      <a
        href="https://github.com/alvarofilho?tab=repositories"
        target="_blank"
        rel="noreferrer"
        aria-label={externalLabel(messages.text.projectsCta)}
      >
        {messages.text.projectsCta}<ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
    <div class="cmd-project-grid">
      {#each projects as project, index}
        <a
          class:cmd-project-wide={'featured' in project && project.featured}
          class="cmd-project fi"
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={externalLabel(`${project.name}: ${messages.projectDescriptions[index]}`)}
          use:fadeIn
        >
          <div class="cmd-project-top"><span>0{index + 1}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
          <h3>{project.name}</h3>
          <p>{messages.projectDescriptions[index]}</p>
          <footer>{#each project.tags as tag}<span>{tag}</span>{/each}</footer>
        </a>
      {/each}
    </div>
  </section>

  <section class="cmd-section" id="experience" aria-labelledby="experience-title">
    <div class="cmd-section-head fi" use:fadeIn>
      <div>
        <span>03 / {messages.text.experienceEyebrow}</span>
        <h2 id="experience-title">{messages.text.experienceTitle}</h2>
      </div>
      <span class="cmd-status"><i></i> {messages.command.active}</span>
    </div>
    <article class="cmd-panel cmd-experience fi" use:fadeIn>
      <div class="cmd-panel-bar"><span>{messages.command.workHistoryFile}</span><span>{messages.experience.date}</span></div>
      <div class="cmd-experience-body">
        <div class="cmd-experience-company">
          <span>01 / {messages.command.currentRole}</span>
          <h3>Lacuna Software</h3>
          <p>{messages.experience.role}</p>
          <small><MapPin size={13} aria-hidden="true" /> {messages.experience.location}</small>
        </div>
        <ul>
          {#each messages.experience.bullets as bullet}<li>{bullet}</li>{/each}
        </ul>
        <div class="cmd-experience-tech">
          {#each messages.experience.tech as tag}<span>{tag}</span>{/each}
        </div>
      </div>
    </article>
  </section>

  <section class="cmd-section" id="blog" aria-labelledby="blog-title">
    <div class="cmd-section-head fi" use:fadeIn>
      <div>
        <span>04 / {messages.text.blogEyebrow}</span>
        <h2 id="blog-title">{messages.text.blogTitle}</h2>
      </div>
      <span class="cmd-status"><i></i> {messages.command.rssOnline}</span>
    </div>
    {#if posts.length}
      <div class="cmd-notes fi" use:fadeIn>
        <div class="cmd-notes-head" aria-hidden="true">
          <span>{messages.command.tableId}</span><span>{messages.command.tableTitle}</span><span>{messages.command.tableTopic}</span><span>{messages.command.tableDate}</span><span></span>
        </div>
        {#each posts as post, index}
          <a href={contentCatalog.getPostPath(post)}>
            <span>0{index + 1}</span>
            <span class="cmd-note-copy"><strong>{post.title}</strong><small>{post.description}</small></span>
            <span class="cmd-note-tags">
              {#each post.tags as tag}<span>{tag}</span>{/each}
              {#each contentCatalog.getAvailableLangs(post) as availableLang}
                <span class:cmd-note-lang-current={availableLang === post.lang}>{availableLang.toUpperCase()}</span>
              {/each}
            </span>
            <time datetime={post.date}>{formatDate(post.date, post.lang)}</time>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        {/each}
      </div>
      <a href={`/${lang}/blog/`} class="cmd-blog-cta fi" use:fadeIn>
        <span><strong>{messages.text.blogCta}</strong><small>{messages.text.blogHint}</small></span>
        <ArrowRight size={18} aria-hidden="true" />
      </a>
    {:else}
      <div class="cmd-panel cmd-empty fi" use:fadeIn><span>{messages.text.blogEmptyStatus}</span><p>{messages.text.blogEmptyText}</p></div>
    {/if}
  </section>

  <section class="cmd-section cmd-contact-section" id="contact" aria-labelledby="contact-title">
    <div class="cmd-section-head fi" use:fadeIn>
      <div>
        <span>05 / {messages.text.contactEyebrow}</span>
        <h2 id="contact-title">{messages.text.contactTitle}</h2>
      </div>
      <span class="cmd-status"><Circle size={7} fill="currentColor" /> {messages.command.openChannels}</span>
    </div>
    <div class="cmd-contact-grid fi" use:fadeIn>
      <a href="mailto:eu@alvaro.dev.br">
        <span><Mail size={16} aria-hidden="true" /> EMAIL</span><strong>eu@alvaro.dev.br</strong><ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <a href="https://github.com/alvarofilho" target="_blank" rel="noreferrer" aria-label={externalLabel('GitHub @alvarofilho')}>
        <span><SiGithub size={16} title="GitHub" /> GITHUB</span><strong>@alvarofilho</strong><ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <a href="https://linkedin.com/in/alvarofsd" target="_blank" rel="noreferrer" aria-label={externalLabel('LinkedIn alvarofsd')}>
        <span>IN LINKEDIN</span><strong>alvarofsd</strong><ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <div><span><SiDiscord size={16} title="Discord" /> DISCORD</span><strong>alvaroduarte</strong></div>
    </div>
  </section>
</main>

<style>
  .command-home{--cmd-line:var(--border);--cmd-panel:color-mix(in srgb,var(--card) 90%,transparent);--cmd-panel-head:color-mix(in srgb,var(--surface) 90%,transparent);width:auto;min-height:100vh;margin-left:var(--home-rail-width);padding:2rem;color:var(--text);font-family:var(--mono)}
  .cmd-panel{background:var(--cmd-panel);border:1px solid var(--cmd-line)}
  .cmd-panel-bar{display:flex;justify-content:space-between;padding:.55rem .8rem;color:var(--dimmer);background:var(--cmd-panel-head);border-bottom:1px solid var(--cmd-line);font-size:.55rem;letter-spacing:.08em}
  .cmd-overview{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:.8rem;padding:0;scroll-margin-top:1rem}
  .cmd-identity-body{display:flex;align-items:center;gap:1.3rem;padding:1.7rem}.cmd-identity img{border:1px solid var(--border-l);filter:grayscale(1) contrast(1.08)}
  .cmd-prompt,.cmd-comment{color:var(--green);font-size:.58rem}.cmd-identity h1{margin:.45rem 0;color:var(--text);font-family:var(--sans);font-size:clamp(1.7rem,3vw,2.3rem);line-height:1;letter-spacing:-.055em}.cmd-role{color:var(--muted);font-size:.68rem}.cmd-location{display:flex;align-items:center;gap:.35rem;margin-top:1.15rem;color:var(--dimmer);font-size:.57rem}
  .cmd-mission{grid-column:span 2}.cmd-mission-body{padding:1.7rem}.cmd-mission h2{margin:.9rem 0;font-family:var(--sans);font-size:clamp(2.2rem,4.5vw,4.6rem);line-height:.86;letter-spacing:-.07em}.cmd-mission h2 em{color:var(--accent);font-style:normal}.cmd-mission p{max-width:700px;color:var(--muted);font-family:var(--sans);font-size:.87rem;line-height:1.6}.cmd-mission-links{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.5rem}.cmd-action{display:flex;align-items:center;gap:.45rem;padding:.6rem .8rem;color:var(--green);border:1px solid color-mix(in srgb,var(--green) 45%,var(--border));font-size:.6rem;text-decoration:none;text-transform:uppercase}.cmd-action:hover{color:var(--bg);background:var(--green)}.cmd-action-secondary{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}.cmd-action-secondary:hover{background:var(--accent)}
  .cmd-metric{display:grid;min-height:170px;padding:1.2rem}.cmd-metric>span,.cmd-metric small{color:var(--dimmer);font-size:.56rem;letter-spacing:.08em;text-transform:uppercase}.cmd-metric strong{align-self:center;font-family:var(--sans);font-size:clamp(2.7rem,5vw,4rem);line-height:1;letter-spacing:-.08em}.cmd-metric small{align-self:end}
  .cmd-section{padding:6.5rem 0 0;scroll-margin-top:1rem}.cmd-section-head{display:flex;align-items:end;justify-content:space-between;gap:2rem;margin-bottom:1.5rem}.cmd-section-head>div>span{color:var(--green);font-size:.58rem;letter-spacing:.12em;text-transform:uppercase}.cmd-section-head h2{margin-top:.45rem;font-family:var(--sans);font-size:clamp(2.2rem,4vw,3rem);line-height:1;letter-spacing:-.055em}.cmd-section-head>a{display:flex;align-items:center;gap:.4rem;color:var(--muted);font-size:.58rem;text-decoration:none;text-transform:uppercase}.cmd-section-head>a:hover{color:var(--accent)}.cmd-status{display:flex;align-items:center;gap:.45rem;color:var(--dimmer);font-size:.55rem}.cmd-status i{width:6px;height:6px;background:var(--green);border-radius:50%;box-shadow:0 0 10px color-mix(in srgb,var(--green) 70%,transparent)}
  .cmd-stack-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--cmd-line);border-left:1px solid var(--cmd-line)}.cmd-stack-grid article{min-height:180px;padding:1.2rem;background:var(--cmd-panel);border-right:1px solid var(--cmd-line);border-bottom:1px solid var(--cmd-line)}.cmd-stack-grid article>div{display:flex;justify-content:space-between;color:var(--dimmer);font-size:.56rem;text-transform:uppercase}.cmd-stack-grid article>div small{color:var(--green)}.cmd-stack-grid p{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:3.5rem}.cmd-stack-grid b,.cmd-project footer span,.cmd-experience-tech span{padding:.3rem .5rem;color:var(--muted);background:var(--tag-bg);border:1px solid var(--border);font-size:.54rem;font-weight:400}.cmd-stack-grid b.cmd-soft{color:var(--dimmer)}.cmd-stack-wide{grid-column:span 4;min-height:auto!important}.cmd-stack-wide p{margin-top:1.5rem}
  .cmd-project-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--cmd-line);border-left:1px solid var(--cmd-line)}.cmd-project{display:flex;flex-direction:column;min-height:310px;padding:1.25rem;background:var(--cmd-panel);border-right:1px solid var(--cmd-line);border-bottom:1px solid var(--cmd-line);text-decoration:none}.cmd-project-wide{grid-column:span 2}.cmd-project-top{display:flex;justify-content:space-between;color:var(--dimmer);font-size:.6rem}.cmd-project h3{margin:auto 0 .7rem;color:var(--text);font-family:var(--sans);font-size:1.5rem;line-height:1;letter-spacing:-.04em}.cmd-project p{max-width:600px;color:var(--muted);font-family:var(--sans);font-size:.76rem;line-height:1.55}.cmd-project footer{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1.2rem;padding:0;border:0}.cmd-project:hover{background:var(--card-h)}.cmd-project:hover h3{color:var(--green)}
  .cmd-experience-body{display:grid;grid-template-columns:.7fr 1.3fr;gap:4rem;padding:2rem}.cmd-experience-company>span{color:var(--green);font-size:.56rem}.cmd-experience-company h3{margin:.7rem 0 .35rem;font-family:var(--sans);font-size:2rem;letter-spacing:-.05em}.cmd-experience-company p{color:var(--muted);font-size:.65rem}.cmd-experience-company small{display:flex;align-items:center;gap:.35rem;margin-top:1.2rem;color:var(--dimmer);font-size:.58rem}.cmd-experience ul{display:grid;gap:.8rem;color:var(--muted);font-family:var(--sans);font-size:.83rem;line-height:1.6}.cmd-experience li::marker{color:var(--green)}.cmd-experience-tech{grid-column:2;display:flex;flex-wrap:wrap;gap:.4rem}
  .cmd-notes{border:1px solid var(--cmd-line)}.cmd-notes-head,.cmd-notes>a{display:grid;grid-template-columns:3rem minmax(260px,1fr) 14rem 8rem 1rem;align-items:center;gap:1rem;padding:.8rem 1rem;border-bottom:1px solid var(--cmd-line);font-size:.6rem}.cmd-notes-head{color:var(--dimmer);background:var(--cmd-panel-head)}.cmd-notes>a{color:var(--text);text-decoration:none}.cmd-notes>a>span,.cmd-notes time{color:var(--muted)}.cmd-note-copy{display:grid;gap:.3rem}.cmd-note-copy strong{font-family:var(--sans);font-size:.82rem}.cmd-note-copy small{color:var(--dimmer);font-family:var(--sans);font-size:.64rem;line-height:1.4}.cmd-note-tags{display:flex;flex-wrap:wrap;gap:.3rem}.cmd-note-tags span{padding:.2rem .35rem;color:var(--muted);background:var(--tag-bg);border:1px solid var(--border);font-size:.5rem}.cmd-note-tags .cmd-note-lang-current{color:var(--green);border-color:color-mix(in srgb,var(--green) 45%,var(--border))}.cmd-notes>a:hover{background:var(--card-h)}.cmd-notes>a:hover strong{color:var(--green)}.cmd-blog-cta{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1rem;color:var(--text);border:1px solid var(--cmd-line);border-top:0;text-decoration:none}.cmd-blog-cta>span{display:grid;gap:.2rem}.cmd-blog-cta strong{font-size:.7rem}.cmd-blog-cta small{color:var(--dimmer);font-size:.58rem}.cmd-blog-cta:hover{color:var(--accent);background:var(--card-h)}.cmd-empty{padding:2rem}.cmd-empty span{color:var(--green);font-size:.62rem}.cmd-empty p{margin-top:.6rem;color:var(--muted);font-family:var(--sans)}
  .cmd-contact-section{padding-bottom:8rem}.cmd-contact-grid{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--cmd-line);border-left:1px solid var(--cmd-line)}.cmd-contact-grid>a,.cmd-contact-grid>div{display:grid;grid-template-columns:1fr auto;gap:1rem;min-height:145px;padding:1.2rem;background:var(--cmd-panel);border-right:1px solid var(--cmd-line);border-bottom:1px solid var(--cmd-line);text-decoration:none}.cmd-contact-grid>a>span,.cmd-contact-grid>div>span{display:flex;align-items:center;gap:.45rem;color:var(--green);font-size:.56rem}.cmd-contact-grid strong{align-self:end;font-family:var(--sans);font-size:1.2rem;letter-spacing:-.03em}.cmd-contact-grid>a>:global(svg:last-child){grid-column:2;grid-row:1 / span 2}.cmd-contact-grid>a:hover{background:var(--card-h)}.cmd-contact-grid>a:hover strong{color:var(--accent)}
  @media(max-width:1050px){.command-home{padding:1.2rem}.cmd-overview{grid-template-columns:1fr 1fr}.cmd-identity,.cmd-mission{grid-column:span 2}.cmd-project-grid{grid-template-columns:1fr 1fr}.cmd-stack-grid{grid-template-columns:1fr 1fr}.cmd-stack-wide{grid-column:span 2}.cmd-notes-head{display:none}.cmd-notes>a{grid-template-columns:2rem minmax(0,1fr) auto;align-items:start}.cmd-notes>a>span:first-child{grid-column:1;grid-row:1 / span 3}.cmd-note-copy{grid-column:2;grid-row:1;min-width:0}.cmd-note-tags{grid-column:2;grid-row:2}.cmd-notes time{grid-column:2;grid-row:3}.cmd-notes>a>:global(svg:last-child){grid-column:3;grid-row:1 / span 3}}
  @media(max-width:720px){.command-home{padding:1rem}.cmd-overview{grid-template-columns:1fr;padding-top:92px}.cmd-identity,.cmd-mission{grid-column:span 1}.cmd-identity-body{align-items:flex-start}.cmd-identity img{width:80px;height:80px}.cmd-mission h2{font-size:2.7rem}.cmd-section{padding-top:4.5rem;scroll-margin-top:100px}.cmd-section-head{align-items:flex-start;flex-direction:column}.cmd-status{align-self:flex-start}.cmd-stack-grid,.cmd-project-grid,.cmd-contact-grid{grid-template-columns:1fr}.cmd-stack-wide,.cmd-project-wide{grid-column:span 1}.cmd-stack-grid article{min-height:150px}.cmd-experience-body{grid-template-columns:1fr;gap:2rem}.cmd-experience-tech{grid-column:1}.cmd-contact-grid>a,.cmd-contact-grid>div{min-height:120px}}
</style>
