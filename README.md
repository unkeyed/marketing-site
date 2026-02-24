# Project Guide

This document explains how to run, build, and maintain the project locally.

## Technology Stack

- [Next.js](https://nextjs.org/) - application framework and routing
- [Tailwind CSS](https://tailwindcss.com/) - utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - reusable UI component patterns built on Radix primitives

## Requirements

- Node.js 20+
- pnpm 10+

## Getting Started

Run all commands from the project root (this folder):

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`.

If environment variables are required for a specific setup:

```bash
cp .env.example .env
```

## Development Workflow

1. Start the dev server with `pnpm dev`.
2. Add or update routes in `src/app`.
3. Build reusable UI in `src/components/ui`.
4. Build page-specific sections in `src/components/pages/<slug>`
5. Compose pages from those sections inside route files under `src/app`.
6. Run quality checks before committing:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`

## Available Scripts

- `pnpm dev` - start Next.js in development mode
- `pnpm build` - create a production build
- `pnpm start` - run the production server
- `pnpm lint` - run ESLint
- `pnpm lint:fix` - run ESLint with auto-fixes
- `pnpm format` - check formatting with Prettier
- `pnpm format:fix` - format files with Prettier
- `pnpm typecheck` - run TypeScript type checks

## Project Structure

```text
.
├─ public/                    # static assets served as-is
├─ src/
│  ├─ app/                    # Next.js App Router (routes, layouts, not-found)
│  ├─ components/
│  │  ├─ ui/                  # shared UI primitives
│  │  └─ pages/
│  │     ├─ home/             # components used only by the Home page
│  │     └─ <slug>/           # components used only by one specific page
│  ├─ content/                # markdown content grouped by feature/page
│  ├─ configs/                # app and website configuration
│  ├─ constants/              # static constants
│  ├─ contexts/               # React providers/contexts
│  ├─ hooks/                  # reusable React hooks
│  ├─ lib/                    # utilities and framework helpers
│  ├─ styles/                 # global and feature styles
│  └─ types/                  # shared TypeScript types
├─ next.config.ts             # Next.js configuration
├─ postcss.config.mjs         # PostCSS configuration
├─ tailwind.plugins.mjs       # Tailwind plugin setup
├─ eslint.config.mjs          # ESLint configuration
└─ package.json
```

## Website Config

Website-level settings are defined in `src/configs/website-config.ts`.

Use this config for branding, metadata defaults, and repository links. Common fields:

- `projectName` - project name used in UI and metadata
- `metaThemeColors.light` / `metaThemeColors.dark` - browser theme colors
- `defaultSocialImage` - default OG/social preview image
- `githubOrg` / `githubRepo` - repository metadata for links/integrations

Example:

```ts
const config = {
  projectName: '<YOUR_PROJECT_NAME>',
  metaThemeColors: {
    light: '#ffffff',
    dark: '#09090b',
  },
  defaultSocialImage: '/social-previews/index.jpg',
};
```

## Content Directory

Content lives in `src/content` and is organized by folders per section/page type.

Example structure:

```text
src/content/
├─ blog/
├─ docs/
└─ legal/
```

Rules for this project:

- Use Markdown only (`.md` files).
- Keep content grouped by folder (for example: `docs/`, `blog/`, `legal/`).
- Use nested folders when you need hierarchy inside a section.

### Documentation (`/docs`) Conventions

For the `/docs` section, this project follows the same page conventions as FumaDocs. Use the official [FumaDocs page conventions](https://www.fumadocs.dev/docs/page-conventions) as the primary reference when creating or editing docs pages.

## Build and Output

- Run `pnpm build` to generate the production build in `.next/`.
- Run `pnpm start` to serve the compiled build.
- `postbuild` can generate sitemap files and `robots.txt` via `next-sitemap`.
- Generated/runtime directories such as `.next/`, `.turbo/`, and `node_modules/` are not source files.
