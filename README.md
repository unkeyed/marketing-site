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

## License
 
This repository uses a three-layer license split. Different parts of the
project carry different terms.
 
- **Source code** is licensed under the **GNU Affero General Public License
  v3.0**. See [`LICENSE`](./LICENSE).
- **Content** (blog posts, case studies, glossary, marketing copy, and
  non-brand imagery) is licensed under **CC BY-NC-ND 4.0** with supplemental
  terms. See [`LICENSE-CONTENT`](./LICENSE-CONTENT).
- **Unkey trademarks**, including the name and logo, are reserved. See
  [`TRADEMARKS.md`](./TRADEMARKS.md).
For a full explanation of how the three layers interact, see
[`LICENSING.md`](./LICENSING.md).
 
If you fork this repository to build your own project, you must remove or
replace all Unkey branding and content before publishing or hosting your
fork.
 
For commercial licensing or permission requests, contact legal@unkey.com.
