export const DOCS_URL = 'https://www.unkey.com/docs/introduction';
export const APP_URL = 'https://app.unkey.com/';
export const SIGN_UP_URL = 'https://app.unkey.com/auth/sign-up';
export const GITHUB_URL = 'https://github.com/unkeyed/unkey';
export const BOOK_A_CALL_URL =
  'https://unkey.cal.com/unkey/user-interview?utm_source=banner&utm_campaign=oss&slug=unkey&type=user-interview&orgRedirection=true';
export const ENTERPRISE_CONTACT_URL =
  'mailto:support@unkey.dev?subject=Unkey%20Enterprise%20Quote';

const config = {
  projectName: 'unkey',
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  logoAlt: 'unkey',
  logoLink: '/',
  metaThemeColors: {
    light: '#040406',
    dark: '#040406',
  },
  defaultSocialImage: '/social-previews/main.jpg',
  githubOrg: 'unkeyed',
  githubRepo: 'unkey',
  blog: {
    postsPerPage: 8,
    contentWidth: 704,
    // postCardCoverWidth: 302,
    // featuredPostCount: 2,
    // coverAspectRatio: 16 / 9,
    contentDir: 'src/content/blog',
  },
  changelog: {
    // We would prefer of keeping content outside of src folder but it would disable hot reloading.
    contentDir: 'src/content/changelog',
    postsPerPage: 20,
  },
};

export default config;
