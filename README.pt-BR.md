# alvaro.dev.br

Portfolio pessoal de Álvaro Duarte, desenvolvido com SvelteKit e publicado como site estatico no GitHub Pages.

English version: [README.md](README.md)

## Stack

- SvelteKit 2
- Svelte 5 com runes
- TypeScript
- MDSvex para posts em `.svx`
- Shiki para highlight de codigo
- Fuse.js para busca do blog
- pnpm como gerenciador de pacotes
- `@sveltejs/adapter-static` para gerar o build estatico

## Requisitos

- Node.js 22
- pnpm 10.33.2

O projeto declara a versao do pnpm em `package.json`:

```json
"packageManager": "pnpm@10.33.2"
```

## Instalacao

```bash
pnpm install
```

Para CI ou instalacoes reproduziveis:

```bash
pnpm install --frozen-lockfile
```

## Scripts

```bash
pnpm run dev
```

Inicia o servidor local em `127.0.0.1`.

```bash
pnpm run check
```

Executa `svelte-check` com TypeScript.

```bash
pnpm run build
```

Gera o site estatico em `build/`.

```bash
pnpm run preview
```

Serve o build gerado para revisao local.

## Estrutura Principal

```text
src/
  content/posts/              # Posts do blog em MDSvex
  lib/
    components/               # Componentes Svelte reutilizaveis
    data/                     # Dados estaticos e helpers
    i18n/                     # Traducoes pt/en
    styles/app.css            # CSS global do projeto
  routes/
    [lang]/                   # Rotas localizadas pt/en
      blog/                   # Blog, posts e drafts
static/                       # Arquivos copiados para a raiz do build
```

## Blog E Drafts

Os posts ficam em `src/content/posts/` e usam frontmatter com campos como `title`, `description`, `date`, `tags`, `lang`, `slug`, `draft` e `translationKey`.

Posts com `draft: true` aparecem nas rotas de drafts:

```text
/pt/blog/drafts/
/en/blog/drafts/
```

## Internacionalizacao

As rotas usam o parametro `[lang]`, com suporte para:

- `pt`
- `en`

Strings de interface ficam em:

```text
src/lib/i18n/pt.json
src/lib/i18n/en.json
```

Ao adicionar uma string nova, atualize os dois arquivos e o tipo correspondente em `src/lib/data/site.ts`.

## Deploy

O deploy roda pelo GitHub Actions em `.github/workflows/static.yml`.

Fluxo atual:

1. Instala pnpm.
2. Instala dependencias com `pnpm install --frozen-lockfile`.
3. Gera o build com `pnpm run build`.
4. Publica a pasta `build/` no GitHub Pages.

O arquivo `static/CNAME` e copiado para `build/CNAME`, que e o formato esperado pelo GitHub Pages para manter o dominio customizado.
