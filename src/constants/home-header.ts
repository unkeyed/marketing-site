import { APP_URL, GITHUB_URL, SIGN_UP_URL } from '@/configs/website-config';

export const homeHeaderLinks = {
  social: [
    { id: 'discord', label: 'Discord', href: 'https://unkey.com/discord' },
    { id: 'github', label: 'GitHub', href: GITHUB_URL, metric: '5.3k' },
  ],
  auth: [
    { id: 'login', label: 'Login', href: APP_URL },
    { id: 'signUp', label: 'Sign Up', href: SIGN_UP_URL },
  ],
} as const;
