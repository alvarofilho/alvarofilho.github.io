(() => {
  const DEFAULT_LANG = "en";
  const I18N_PATH = "i18n";
  const SUPPORTED_LANGS = new Set(["pt", "en"]);
  const META_SELECTORS = {
    description: [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ],
    title: ['meta[property="og:title"]', 'meta[name="twitter:title"]'],
  };
  const THEME_MODES = ["system", "dark", "light"];
  const THEME_ICON = {
    system: "◐",
    dark: "☾",
    light: "☀",
  };
  const SYSTEM_THEME_QUERY = window.matchMedia("(prefers-color-scheme: light)");

  const translations = new Map();
  let currentLang = getInitialLang();
  let currentMessages;
  let currentThemeMode = normalizeThemeMode(localStorage.getItem("theme"));
  let typingTimeoutId;
  let terminalTimeoutId;

  document.addEventListener("DOMContentLoaded", initApp);

  async function initApp() {
    try {
      await initLanguage();
    } catch (error) {
      console.error(error);
    }

    initTheme();
    initHeroTyping();
    initTerminal();
    initFadeIns();
    initActiveNav();
  }

  function normalizeLang(lang) {
    return SUPPORTED_LANGS.has(lang) ? lang : null;
  }

  function normalizeThemeMode(mode) {
    return THEME_MODES.includes(mode) ? mode : "system";
  }

  function getMessages() {
    return currentMessages;
  }

  async function loadMessages(lang) {
    const normalizedLang = normalizeLang(lang) || DEFAULT_LANG;
    if (translations.has(normalizedLang)) {
      return translations.get(normalizedLang);
    }

    const response = await fetch(`${I18N_PATH}/${normalizedLang}.json`);
    if (!response.ok) {
      throw new Error(`Could not load ${normalizedLang} translations`);
    }

    const messages = await response.json();
    translations.set(normalizedLang, messages);
    return messages;
  }

  function initTheme() {
    setTheme(currentThemeMode, { persist: false });

    document.getElementById("theme-btn")?.addEventListener("click", () => {
      setTheme(getNextThemeMode());
    });

    SYSTEM_THEME_QUERY.addEventListener("change", () => {
      if (currentThemeMode === "system") {
        applyResolvedTheme();
      }
    });
  }

  function setTheme(mode, options = { persist: true }) {
    currentThemeMode = normalizeThemeMode(mode);

    if (options.persist) {
      localStorage.setItem("theme", currentThemeMode);
    }

    applyResolvedTheme();
  }

  function getNextThemeMode() {
    const currentIndex = THEME_MODES.indexOf(currentThemeMode);
    return THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
  }

  function getResolvedTheme(mode = currentThemeMode) {
    if (mode === "system") {
      return SYSTEM_THEME_QUERY.matches ? "light" : "dark";
    }

    return mode;
  }

  function applyResolvedTheme() {
    document.documentElement.dataset.themeMode = currentThemeMode;
    document.documentElement.dataset.theme = getResolvedTheme();
    updateThemeButton();
  }

  async function initLanguage() {
    document.getElementById("lang-btn")?.addEventListener("click", async () => {
      await setLang(getNextLang());
    });

    localStorage.removeItem("langMode");
    await setLang(currentLang, { persist: false, refreshAnimations: false });
  }

  function getInitialLang() {
    return normalizeLang(localStorage.getItem("lang")) || getSystemLang();
  }

  function getSystemLang() {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const supportedLanguage = languages.find((lang) => {
      const normalized = lang?.toLowerCase();
      return normalized?.startsWith("pt") || normalized?.startsWith("en");
    });

    if (supportedLanguage?.toLowerCase().startsWith("en")) {
      return "en";
    }

    return DEFAULT_LANG;
  }

  function getNextLang() {
    return currentLang === "pt" ? "en" : "pt";
  }

  async function setLang(lang, options = { persist: true, refreshAnimations: true }) {
    const requestedLang = normalizeLang(lang) || DEFAULT_LANG;
    const nextMessages = await getMessagesWithFallback(requestedLang);
    const langChanged = currentLang !== nextMessages.lang;

    currentLang = nextMessages.lang;
    currentMessages = nextMessages.messages;

    if (options.persist) {
      localStorage.setItem("lang", currentLang);
    }

    applyStaticTranslations();
    updateLanguageButton();
    updateThemeButton();

    if (options.refreshAnimations && langChanged) {
      initHeroTyping();
      initTerminal();
    }
  }

  async function getMessagesWithFallback(lang) {
    try {
      return { lang, messages: await loadMessages(lang) };
    } catch (error) {
      console.warn(error);
      if (lang === DEFAULT_LANG) {
        throw error;
      }

      return { lang: DEFAULT_LANG, messages: await loadMessages(DEFAULT_LANG) };
    }
  }

  function applyStaticTranslations() {
    const messages = getMessages();
    if (!messages) {
      return;
    }

    document.documentElement.lang = messages.htmlLang;
    document.title = messages.meta.title;

    setMetaContents(META_SELECTORS.title, messages.meta.title);
    setMetaContents(META_SELECTORS.description, messages.meta.description);

    document.querySelectorAll("[data-t]").forEach((element) => {
      const value = messages.text[element.dataset.t];
      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-list]").forEach((list) => {
      const items = messages.lists[list.dataset.i18nList];
      if (Array.isArray(items)) {
        renderList(list, items);
      }
    });
  }

  function setMetaContents(selectors, content) {
    selectors.forEach((selector) => {
      document.querySelector(selector)?.setAttribute("content", content);
    });
  }

  function renderList(list, items) {
    list.replaceChildren(
      ...items.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }),
    );
  }

  function updateLanguageButton() {
    const button = document.getElementById("lang-btn");
    const messages = getMessages();
    if (!button || !messages) {
      return;
    }

    button.textContent = currentLang.toUpperCase();
    button.setAttribute("aria-label", messages.aria.langButton);
    button.title = `${messages.language.current}: ${currentLang.toUpperCase()}`;
  }

  function updateThemeButton() {
    const button = document.getElementById("theme-btn");
    const messages = getMessages();
    if (!button || !messages) {
      return;
    }

    const resolvedTheme = getResolvedTheme();
    const currentLabel = messages.theme[currentThemeMode];
    const nextLabel = messages.theme[getNextThemeMode()];

    button.textContent = THEME_ICON[currentThemeMode];
    button.dataset.mode = currentThemeMode;
    button.setAttribute("aria-label", `${messages.theme.toggle}: ${currentLabel}. ${messages.theme.next}: ${nextLabel}.`);
    button.title = `${currentLabel} (${resolvedTheme})`;
  }

  function initHeroTyping() {
    const textElement = document.getElementById("ttext");
    const messages = getMessages();
    if (!textElement || !messages) {
      return;
    }

    window.clearTimeout(typingTimeoutId);
    textElement.textContent = "";

    const roles = messages.roles;
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeRole = () => {
      const currentRole = roles[roleIndex];
      textElement.textContent = deleting
        ? currentRole.slice(0, charIndex - 1)
        : currentRole.slice(0, charIndex + 1);

      charIndex += deleting ? -1 : 1;

      let delay = deleting ? 42 : 72;
      if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        delay = 2400;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 360;
      }

      typingTimeoutId = window.setTimeout(typeRole, delay);
    };

    typingTimeoutId = window.setTimeout(typeRole, 900);
  }

  function initTerminal() {
    const terminal = document.getElementById("term-body");
    const messages = getMessages();
    if (!terminal || !messages) {
      return;
    }

    window.clearTimeout(terminalTimeoutId);
    terminal.replaceChildren();

    const lines = messages.terminal;
    let lineIndex = 0;

    const renderNextLine = () => {
      const line = lines[lineIndex++];
      if (!line) {
        return;
      }

      if (line.kind === "space") {
        terminal.append(createTerminalSpacer());
        terminalTimeoutId = window.setTimeout(renderNextLine, 70);
        return;
      }

      if (line.kind === "cursor") {
        terminal.append(createTerminalCursor());
        return;
      }

      if (line.kind === "cmd") {
        renderCommandLine(terminal, line.text, renderNextLine);
        return;
      }

      terminal.append(createOutputLine(line));
      terminalTimeoutId = window.setTimeout(renderNextLine, 95);
    };

    terminalTimeoutId = window.setTimeout(renderNextLine, 1300);
  }

  function createTerminalSpacer() {
    const spacer = document.createElement("div");
    spacer.className = "tspace";
    return spacer;
  }

  function createTerminalCursor() {
    const line = document.createElement("div");
    const prompt = document.createElement("span");
    const cursor = document.createElement("span");

    line.className = "tl";
    prompt.className = "tp";
    cursor.className = "tcursor";
    prompt.textContent = "$";

    line.append(prompt, cursor);
    return line;
  }

  function createOutputLine({ text, modifier }) {
    const line = document.createElement("div");
    const output = document.createElement("span");

    line.className = "tl";
    output.className = modifier ? `to ${modifier}` : "to";
    output.textContent = text;
    line.append(output);

    return line;
  }

  function renderCommandLine(terminal, command, onComplete) {
    const line = document.createElement("div");
    const prompt = document.createElement("span");
    const text = document.createElement("span");

    line.className = "tl";
    prompt.className = "tp";
    text.className = "tc";
    prompt.textContent = "$";
    line.append(prompt, text);
    terminal.append(line);

    let index = 0;
    const typeCharacter = () => {
      if (index < command.length) {
        text.textContent += command[index++];
        terminalTimeoutId = window.setTimeout(typeCharacter, 52);
        return;
      }

      terminalTimeoutId = window.setTimeout(onComplete, 140);
    };

    terminalTimeoutId = window.setTimeout(typeCharacter, 60);
  }

  function initFadeIns() {
    const elements = document.querySelectorAll(".fi");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("on"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -36px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
  }

  function initActiveNav() {
    const links = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { threshold: 0.35 },
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
