import ptMessages from "$lib/i18n/pt.json";
import enMessages from "$lib/i18n/en.json";

export const languageConfig = {
  pt: { label: "PT", name: "Português", htmlLang: "pt-BR", locale: "pt_BR", dateLocale: "pt-BR" },
  en: { label: "EN", name: "English", htmlLang: "en", locale: "en_US", dateLocale: "en" },
} as const;

export type Lang = keyof typeof languageConfig;

export type Messages = {
  htmlLang: string;
  locale: string;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    skills: string;
    projects: string;
    experience: string;
    blog: string;
    contact: string;
  };
  text: {
    heroBio: string;
    workApproach: string;
    profileLocation: string;
    heroButton: string;
    avatarAlt: string;
    externalLinkSuffix: string;
    skillsEyebrow: string;
    projectsEyebrow: string;
    experienceEyebrow: string;
    blogEyebrow: string;
    contactEyebrow: string;
    skillsTitle: string;
    projectsTitle: string;
    projectsCta: string;
    experienceTitle: string;
    contactTitle: string;
    blogTitle: string;
    blogCta: string;
    blogHint: string;
    blogEmptyStatus: string;
    blogEmptyText: string;
    blogSearchPlaceholder: string;
    blogSearchLabel: string;
    blogTagFilter: string;
    blogNoResults: string;
    blogClearFilters: string;
    blogTagSearchPlaceholder: string;
    blogTagSearchLabel: string;
    blogResultsSummary: string;
    blogResultsSummarySingle: string;
    blogRemoveTagLabel: string;
    blogFilterByTagLabel: string;
    blogLoadMore: string;
    blogSelectedTags: string;
    blogPopularTags: string;
    blogAdvancedFilters: string;
    blogHideFilters: string;
    blogPaginationLabel: string;
    blogPreviousPageLabel: string;
    blogNextPageLabel: string;
    blogPageLabel: string;
    blogCurrentPageLabel: string;
    backToBlog: string;
    footer: string;
    codeCopy: string;
    codeCopied: string;
    httpRequest: string;
    httpResponse: string;
    httpMessage: string;
    httpHeaders: string;
    httpBody: string;
    componentShowcaseTitle: string;
    componentShowcaseDescription: string;
    componentShowcaseReference: string;
    componentShowcaseTag: string;
    componentHttpMessageDescription: string;
    componentHttpMessageExampleTitle: string;
    commentsTitle: string;
    commentsDescription: string;
    commentsCountSingle: string;
    commentsCountPlural: string;
    commentsFormTitle: string;
    commentsNamePlaceholder: string;
    commentsMessagePlaceholder: string;
    commentsSubmitLabel: string;
    commentsEmpty: string;
    commentsDiscussionKicker: string;
    commentsListLabel: string;
    commentsRepliesLabel: string;
    postAvailableIn: string;
    postLangsLabel: string;
    postCurrentLangLabel: string;
    postReadInLangLabel: string;
    e404Title: string;
    e404Sub: string;
    e404Cta: string;
    tocTitle: string;
    tocNavLabel: string;
    readingTime: string;
  };
  skillLabels: {
    lang: string;
    frameworks: string;
    database: string;
    tools: string;
    practices: string;
  };
  skillGroups: {
    practices: string[];
  };
  projects: Record<
    ProjectId,
    {
      status: string;
      description: string;
      detail: string;
    }
  >;
  experience: {
    date: string;
    location: string;
    role: string;
    bullets: string[];
    tech: string[];
  };
  roles: string[];
  terminal: TerminalLine[];
  aria: {
    languageButton: string;
    themeToggle: string;
    themeNext: string;
    skipToContent: string;
    primaryNavigation: string;
    homeLink: string;
  };
  language: {
    current: string;
    other: string;
  };
  theme: Record<"dark" | "light" | "system", string>;
  command: {
    profileFile: string;
    missionFile: string;
    workHistoryFile: string;
    readOnly: string;
    systemScope: string;
    missionLead: string;
    missionOutcome: string;
    primaryStack: string;
    currentRole: string;
    focus: string;
    focusArea: string;
    integrationsSystems: string;
    deepDives: string;
    systemReady: string;
    active: string;
    rssOnline: string;
    openChannels: string;
    online: string;
    tableId: string;
    tableTitle: string;
    tableTopic: string;
    tableDate: string;
    blogCommand: string;
    blogFeed: string;
    blogBriefingEyebrow: string;
    blogBriefingTitle: string;
    blogBriefingAccent: string;
    blogBriefingIntro: string;
    blogLatestEntry: string;
    blogOpenNote: string;
    blogNotesEyebrow: string;
    blogNotesLog: string;
    blogSearchCommand: string;
    blogArticleEyebrow: string;
    blogPublished: string;
    blogAuthor: string;
  };
};

export type TerminalLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; modifier?: "hi" | "gr" }
  | { kind: "space" }
  | { kind: "cursor" };

export const languages = Object.keys(languageConfig) as Lang[];

export const siteUrl = "https://alvaro.dev.br";

export const messages: Record<Lang, Messages> = {
  pt: ptMessages as Messages,
  en: enMessages as Messages,
};

export const primaryStack = {
  backend: ".NET",
  frontend: "Angular",
  database: "SQL Server",
} as const;

export const skillGroups = [
  { key: "lang", items: ["C#", "TypeScript", "SQL", "Java", "Python"] },
  {
    key: "frameworks",
    items: [primaryStack.backend, primaryStack.frontend, "SvelteKit", "Tauri", "Flask"],
  },
  { key: "database", items: ["MySQL", "PostgreSQL", primaryStack.database] },
  { key: "tools", items: ["Git", "Git worktrees", "Codex CLI"] },
  { key: "practices", soft: true },
] as const;

export const projects = [
  {
    id: "toolbox",
    name: "Toolbox",
    href: "https://toolbox.alvaro.dev.br",
    tags: ["Angular", "TypeScript", "Tailwind CSS", "DaisyUI", "Web Crypto"],
    featured: true,
  },
  {
    id: "trama",
    name: "Trama",
    href: "https://github.com/alvarofilho/trama",
    tags: ["Angular", "Tauri", "Rust", "SQLite", "Git"],
    featured: false,
  },
  {
    id: "portfolio",
    name: "alvaro.dev.br",
    href: "https://github.com/alvarofilho/alvarofilho.github.io",
    tags: ["SvelteKit", "TypeScript", "MDSvex"],
    featured: false,
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

export const blogTopics = [".NET", "Webhooks", "IA & LLMs", "PKI", "Certificados"];

export function getOtherLang(lang: Lang): Lang {
  const idx = languages.indexOf(lang);
  return languages[(idx + 1) % languages.length];
}

export function isLang(value: string): value is Lang {
  return languages.includes(value as Lang);
}

export function formatDate(date: string, lang: Lang) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(languageConfig[lang].dateLocale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
