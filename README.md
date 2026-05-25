# alvaro.dev.br

Personal portfolio for Álvaro Duarte, built with SvelteKit and deployed as a static GitHub Pages site.

Portuguese version: [README.pt-BR.md](README.pt-BR.md)

## Stack

- SvelteKit 2
- Svelte 5 with runes
- TypeScript
- MDSvex for `.svx` blog posts
- Shiki for code highlighting
- Fuse.js for blog search
- pnpm as the package manager
- `@sveltejs/adapter-static` for static output

## Requirements

- Node.js 22
- pnpm 10.33.2

The pnpm version is declared in `package.json`:

```json
"packageManager": "pnpm@10.33.2"
```

## Installation

```bash
pnpm install
```

For CI or reproducible installs:

```bash
pnpm install --frozen-lockfile
```

## Scripts

```bash
pnpm run dev
```

Starts the local development server at `127.0.0.1`.

```bash
pnpm run check
```

Runs `svelte-check` with TypeScript validation.

```bash
pnpm run build
```

Generates the static site in `build/`.

```bash
pnpm run preview
```

Serves the generated build for local review.

## Project Structure

```text
src/
  content/posts/              # Blog posts written with MDSvex
  lib/
    components/               # Reusable Svelte components
    data/                     # Static data and helpers
    i18n/                     # pt/en translations
    styles/app.css            # Global project styles
  routes/
    [lang]/                   # Localized pt/en routes
      blog/                   # Blog, posts, and drafts
static/                       # Files copied to the build root
```

## Blog And Drafts

Blog posts live in `src/content/posts/` and use frontmatter fields such as `title`, `description`, `date`, `tags`, `lang`, `slug`, `draft`, and `translationKey`.

Posts with `draft: true` are available under the draft routes:

```text
/pt/blog/drafts/
/en/blog/drafts/
```

## Internationalization

Routes use the `[lang]` parameter, with support for:

- `pt`
- `en`

Interface strings live in:

```text
src/lib/i18n/pt.json
src/lib/i18n/en.json
```

When adding a new string, update both JSON files and the corresponding type in `src/lib/data/site.ts`.

## Deployment

Deployment runs through GitHub Actions in `.github/workflows/static.yml`.

Current flow:

1. Install pnpm.
2. Install dependencies with `pnpm install --frozen-lockfile`.
3. Build the static site with `pnpm run build`.
4. Publish the `build/` directory to GitHub Pages.

The `static/CNAME` file is copied to `build/CNAME`, which is the format GitHub Pages expects for preserving the custom domain.
