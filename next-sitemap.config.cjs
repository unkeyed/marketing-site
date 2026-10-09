const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

// Content sections whose items live in `src/content/<dir>` and are served at `<route>/<slug>`.
// `frontmatterSlug` mirrors sections whose loader lets a `slug` field override the filename.
const CONTENT_SECTIONS = [
  { route: '/blog', dir: 'src/content/blog' },
  { route: '/case-studies', dir: 'src/content/case-studies' },
  { route: '/changelog', dir: 'src/content/changelog' },
  { route: '/glossary', dir: 'src/content/glossary', frontmatterSlug: true },
  { route: '/policies', dir: 'src/content/policies' },
];

function toIsoDate(value) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

// Map each content page path to its real last-modified date from frontmatter. Prefers an
// explicit `updatedAt`, then the publish date.
function collectLastmods() {
  const lastmods = new Map();

  for (const { route, dir, frontmatterSlug } of CONTENT_SECTIONS) {
    const absDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }

    let newest;
    for (const file of fs.readdirSync(absDir)) {
      if (!/\.mdx?$/.test(file)) {
        continue;
      }
      const { data } = matter(fs.readFileSync(path.join(absDir, file), 'utf-8'));
      const lastmod = toIsoDate(data.updatedAt ?? data.publishedAt ?? data.date);
      if (!lastmod) {
        continue;
      }
      const fileSlug = file.replace(/\.mdx?$/, '');
      const slug = (frontmatterSlug && data.slug?.trim()) || fileSlug;
      lastmods.set(`${route}/${slug.toLowerCase()}`, lastmod);
      if (!newest || lastmod > newest) {
        newest = lastmod;
      }
    }

    // A section's index page changes whenever its newest item does.
    if (newest) {
      lastmods.set(route, newest);
    }
  }

  return lastmods;
}

const lastmods = collectLastmods();

// Changelog entries pulled from GitHub at build time have no local file, but their slug
// starts with the publish date.
function resolveLastmod(pagePath) {
  if (lastmods.has(pagePath)) {
    return lastmods.get(pagePath);
  }
  const changelogDate = pagePath.match(/^\/changelog\/(\d{4}-\d{2}-\d{2})/);
  return changelogDate ? toIsoDate(changelogDate[1]) : undefined;
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://www.unkey.com',
  generateRobotsTxt: true,
  // Route handlers back the `.md` twins via rewrites; they are not pages to index.
  exclude: ['/api/*'],
  // The default stamps every URL with the build time, which tells crawlers the whole site
  // changed on every deploy. Use real content dates, and omit lastmod where there is none.
  autoLastmod: false,
  transform: async (config, pagePath) => ({
    loc: pagePath,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: resolveLastmod(pagePath),
    alternateRefs: config.alternateRefs ?? [],
  }),
};
