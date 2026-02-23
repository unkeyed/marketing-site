# Unkey

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Learn more](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [VS Code](#vs-code)

## Getting Started

1. Clone this repository

```bash
git clone <repo-url>
```

2. Install dependencies

```bash
npm install
```

## Usage

### Run the website

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

### Build the website

```bash
npm run build
```

### Run the built website

```bash
npm run start
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project Structure

```text
├── public
│   ├── favicon          — Favicon assets (light + dark)
│   ├── og-images        — Open Graph social preview images
│   ├── robots.txt
│   └── hero-*.mp4|webm  — Hero section video assets
├── src
│   ├── app              — Next.js App Router (root layout, page, global styles)
│   ├── components
│   │   ├── pages/home   — Homepage component and section components
│   │   └── ui           — Shared UI primitives (badge, button, card, container)
│   ├── images           — Static images organized by page and section
│   ├── lib              — Utility functions (cn helper)
│   └── types            — TypeScript type declarations
├── next.config.ts       — Next.js configuration (SVG loader, image formats, headers)
├── postcss.config.mjs   — PostCSS configuration for Tailwind CSS v4
├── tsconfig.json        — TypeScript configuration
└── tailwind.config.js   — Tailwind CSS configuration
```

## Code Style

### ESLint

[ESLint](https://eslint.org/) helps find and fix code style issues and force developers to follow the same rules.

```bash
npm run lint
```

### Prettier

[Prettier](https://prettier.io/) helps to format code based on defined rules.

### VS Code

Recommended extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

After installation, enable "ESLint on save" by adding to your VS Code settings.json:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

To enable Prettier, go to Preferences → Settings → search "Format". Set `esbenp.prettier-vscode` as the default formatter and enable "Format On Save".
