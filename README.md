# Unkey Website

## What is in this repository?

This repository contains the current Unkey website and its content, including:

- marketing pages
- blog
- glossary
- changelog
- case studies
- legal pages

Routes live in `src/app`, UI components live in `src/components`, and most long-form content lives
in `src/content`.

## Running locally

Requirements:

- Node.js 20+
- pnpm 10+

Create a local env file and start the app:

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The site will be available at `http://localhost:3000`.

Useful commands:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Important notes

- `NEXT_PUBLIC_DEFAULT_SITE_URL` is used for canonical URLs and sitemap generation.
- Most content collections use MDX. If you are adding content, it is easiest to start by copying an
  existing file from the same folder in `src/content`.
- There is no dedicated test suite yet. Before opening a PR, run
  `pnpm lint && pnpm typecheck && pnpm build`.

## How to contribute

Follow our [contributing guide](https://engineering.unkey.com/contributing)
