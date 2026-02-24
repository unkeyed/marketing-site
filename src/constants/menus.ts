import type { IMenuSocialItem } from '@/types/common';

export const MENUS = {
  header: [
    { label: 'Resources', href: '/resources', children: [] },
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
