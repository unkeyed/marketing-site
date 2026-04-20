# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at localhost:3000
pnpm build        # Production build (runs next-sitemap postbuild)
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier check
pnpm format:fix   # Prettier write
pnpm typecheck    # tsc --noEmit
```

Quality checks before committing: `pnpm lint && pnpm typecheck && pnpm build`

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** with CSS variables for theming (light/dark)
- **shadcn/ui** (new-york style, Radix UI primitives, Lucide icons)
- **MDX** content pipeline: gray-matter → next-mdx-remote → custom remark/rehype plugins → Shiki syntax highlighting
- **pnpm 10** package manager, Node.js 20+

## Architecture

Single Next.js app (not a monorepo).

### Path Aliases

- `@/*` → `src/*`
- `@root/*` → `./*`

### App Router Layout

- `src/app/layout.tsx` — root layout (global styles, dark mode default)
- `src/app/(website)/layout.tsx` — website layout with header/footer
- Routes live under `src/app/(website)/`

### Component Organization

- `src/components/ui/` — shared UI primitives (shadcn/ui, CVA variants)
- `src/components/pages/<slug>/` — page-specific section components
- Page sections use a data-driven pattern: pages import `contentData` objects and pass them as props to pure section components
- Section component files use kebab-case with double-dash variants: `hero--split.tsx`, `features--column.tsx`

### Content Pipeline

- Markdown files (`.md`) live in `src/content/` organized by section (`blog/`, `docs/`, `legal/`)
- Docs follow [FumaDocs page conventions](https://www.fumadocs.dev/docs/page-conventions)
- Custom remark plugins in `src/lib/mdx-plugins/` handle headings, images, code blocks, admonitions, tabs

### Configuration

- `src/configs/website-config.ts` — branding, metadata defaults, repo links
- `src/constants/menus.ts` — navigation structure
- `components.json` — shadcn/ui config

### Page titles

All titles flow through `getMetadata()` in `src/lib/get-metadata.ts`:

- `title: 'Pricing'` → `Pricing | Unkey`
- `tagline: '...'` (homepage / hero pages) → `Unkey | ...`

Pass only the page fragment — don't concat ` | Unkey` yourself. Paginated pages reuse the index title.

## Code Conventions

- **Formatting**: Prettier with 100 char width, single quotes, trailing commas, sorted imports (plugin order: builtins → react/next → third-party → workspace → types → config → lib → hooks → ui → components → styles → relative)
- **Tailwind**: class sorting via prettier-plugin-tailwindcss; use `cn()` from `@/lib/utils` for merging classes
- **ESLint**: no `console.log` (only `error`/`warn`/`info` allowed); `no-explicit-any` is warn; unused vars prefixed with `_` are allowed
- **Types**: `I` prefix for interfaces, `T` prefix for type aliases (defined in `src/types/`)
- **Env vars**: `NEXT_PUBLIC_DEFAULT_SITE_URL` for site base URL
