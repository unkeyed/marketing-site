import { BOOK_A_CALL_URL, DOCS_URL, GITHUB_URL } from '@/configs/website-config';

import type { IFooterMenuSection, IMenuSocialItem } from '@/types/common';

export const MENUS = {
  header: [
    {
      label: 'Resources',
      href: '/',
      children: [
        {
          label: 'Blog',
          href: '/blog',
          description: 'Read product updates and insights',
          icon: '/icons/header/blog.svg',
        },
        /*
        {
          label: 'Case studies',
          href: '/case-studies',
          description: 'Practical results from real deployments',
          icon: '/icons/header/case-studies.svg',
        },
        */
        {
          label: 'Changelog',
          href: '/changelog',
          description: 'Track what shipped, improved, and fixed',
          icon: '/icons/header/changelog.svg',
        },
        {
          label: 'Templates',
          href: '/templates',
          description: 'Starter kits to ship faster',
          icon: '/icons/header/templates.svg',
        },
        {
          label: 'Glossary',
          href: '/glossary',
          description: 'Clear definitions for API terms',
          icon: '/icons/header/glossary.svg',
        },
      ],
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: DOCS_URL },
  ],
  footer: {
    description: 'Build better APIs faster',
    copyright: '© 2026 Unkey Inc. All rights reserved.',
    main: [
      {
        title: 'Company',
        items: [
          { label: 'About', href: '/about' },
          { label: 'Careers', href: '/careers' },
          { label: 'Source Code', href: GITHUB_URL },
          { label: 'Status Page', href: 'https://status.unkey.com' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { label: 'Blog', href: '/blog' },
          { label: 'Changelog', href: '/changelog' },
          { label: 'Templates', href: '/templates' },
          { label: 'Docs', href: DOCS_URL },
          { label: 'Glossary', href: '/glossary' },
          // { label: 'Case Studies', href: '/case-studies' },
        ],
      },
      {
        title: 'Connect',
        items: [
          { label: 'X (Twitter)', href: 'https://x.com/unkeydev' },
          { label: 'Discord', href: 'https://unkey.com/discord' },
          { label: 'OSS Friends', href: '/oss-friends' },
          { label: 'Book a Call', href: BOOK_A_CALL_URL },
        ],
      },
      {
        title: 'Legal',
        items: [
          { label: 'Terms of Service', href: '/policies/terms' },
          { label: 'Privacy Policy', href: '/policies/privacy' },
        ],
      },
    ] satisfies IFooterMenuSection[],
    social: [
      {
        href: 'https://x.com/unkeydev',
        label: 'Follow us on X',
        icon: 'twitter',
      },
      {
        href: GITHUB_URL,
        label: 'Follow us on GitHub',
        icon: 'github',
      },
      {
        href: 'https://unkey.com/discord',
        label: 'Join our Discord',
        icon: 'discord',
      },
    ] satisfies IMenuSocialItem[],
  },
};
