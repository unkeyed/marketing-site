import { APP_URL, SIGN_UP_URL } from '@/configs/website-config';

export const homeHeaderLinks = {
  social: [{ id: 'discord', label: 'Discord', href: 'https://unkey.com/discord' }],
  auth: [
    { id: 'login', label: 'Login', href: APP_URL },
    { id: 'signUp', label: 'Sign Up', href: SIGN_UP_URL },
  ],
} as const;
