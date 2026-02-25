import type { IMenuSocialItem } from '@/types/common';

export const MENUS = {
  header: [
    {
      label: 'Resources',
      href: '/resources',
      children: [
        {
          label: 'Blog',
          href: '/blog',
          description: 'Read product updates and insights',
          icon: '/icons/header/blog.svg',
        },
        {
          label: 'Case studies',
          href: '/case-studies',
          description: 'Practical results from real deployments',
          icon: '/icons/header/case-studies.svg',
        },
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
    { label: 'Docs', href: '/docs' },
  ],
  footer: {
    main: [],
    social: [
      {
        href: 'https://twitter.com/yourusername',
        label: 'Follow us on Twitter',
        icon: 'twitter',
      },
      {
        href: 'https://github.com/yourusername',
        label: 'Follow us on GitHub',
        icon: 'github',
      },
      {
        href: 'https://linkedin.com/in/yourusername',
        label: 'Follow us on LinkedIn',
        icon: 'linkedin',
      },
    ] as IMenuSocialItem[],
  },
};
