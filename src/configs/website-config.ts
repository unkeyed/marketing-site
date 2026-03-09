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
