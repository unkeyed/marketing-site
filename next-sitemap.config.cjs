const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const matter = require('gray-matter');

// Content sections whose items live in `src/content/<dir>` and are served at `<route>/<slug>`.
// `frontmatterSlug` mirrors sections whose loader lets a `slug` field override the filename.
// `indexFiles` are the listing route's own source, used when that route has no item date.
const CONTENT_SECTIONS = [
  {
    route: '/blog',
    dir: 'src/content/blog',
    indexFiles: ['src/app/(website)/blog/(list)/page.tsx'],
  },
  {
    route: '/case-studies',
    dir: 'src/content/case-studies',
    indexFiles: ['src/app/(website)/case-studies/page.tsx'],
  },
  {
    route: '/changelog',
    dir: 'src/content/changelog',
    indexFiles: ['src/app/(website)/changelog/page.tsx'],
  },
  {
    route: '/glossary',
    dir: 'src/content/glossary',
    frontmatterSlug: true,
    indexFiles: ['src/app/(website)/glossary/page.tsx'],
  },
  { route: '/policies', dir: 'src/content/policies' },
];

// Routes with no markdown document. lastmod is the newest git commit of the page
// module plus the constants it renders. Shared chrome (header, footer, CTA) is omitted
// so one edit does not stamp every page.
const STATIC_PAGES = [
  {
    route: '/',
    files: [
      'src/app/(website)/hero-variant/[code]/page.tsx',
      'src/constants/home.ts',
      'src/lib/homepage-hero.ts',
    ],
  },
  {
    route: '/about',
    files: ['src/app/(website)/about/page.tsx', 'src/constants/about.ts'],
  },
  {
    route: '/pricing',
    files: ['src/app/(website)/pricing/page.tsx', 'src/constants/pricing.tsx'],
  },
  {
    route: '/startups',
    files: ['src/app/(website)/startups/page.tsx', 'src/constants/startups.ts'],
  },
  {
    route: '/yc',
    files: ['src/app/(website)/yc/page.tsx', 'src/constants/yc.ts'],
  },
];

// Page modules for content routes. A later edit to the page module counts; the commit
// that first added it does not replace the document's own date.
const CONTENT_PAGE_FILES = {
  '/policies/privacy': ['src/app/(website)/policies/privacy/page.tsx'],
  '/policies/terms': ['src/app/(website)/policies/terms/page.tsx'],
};

const SHALLOW_CLONE_WARNING =
  '[sitemap] Shallow git clone detected. Commit dates on the shallow boundary are ignored: ' +
  'git reports every file that was not touched inside the fetched history as modified by that ' +
  'boundary commit, so those dates are wrong. Vercel clones with `git clone --depth=10` unless ' +
  'VERCEL_DEEP_CLONE=true is set on the Vercel project (Production and Preview). This repo does ' +
  'not set that variable. Content frontmatter dates are still used. A page with neither a content ' +
  'date nor a commit inside the fetched history omits lastmod. Build time is never used.';

function toIsoDate(value) {
  if (!value) {
    return undefined;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function laterDate(current, next) {
  if (!next) {
    return current;
  }
  if (!current) {
    return next;
  }
  return Date.parse(next) > Date.parse(current) ? next : current;
}

function readGit(args) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// Per-file newest commit. `added` means that newest commit introduced the file, so it is
// not evidence that an older frontmatter date is stale (the marketing content was imported
// in one commit). `boundary` means the commit is the root of a shallow clone; git attributes
// every untouched file to that commit, so the date must not be used.
function collectGitFiles() {
  let shallow = true;
  try {
    shallow = readGit(['rev-parse', '--is-shallow-repository']).trim() === 'true';
  } catch {
    console.warn('[sitemap] git is unavailable. lastmod will use content dates only.');
    return new Map();
  }

  let boundaryCommits = new Set();
  if (shallow) {
    console.warn(SHALLOW_CLONE_WARNING);
    try {
      boundaryCommits = new Set(
        readGit(['rev-list', '--max-parents=0', 'HEAD'])
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      );
    } catch {
      console.warn('[sitemap] Could not read the shallow boundary. Ignoring all git dates.');
      return new Map();
    }
  }

  let output;
  try {
    output = readGit([
      '-c',
      'core.quotepath=false',
      'log',
      '--format=COMMIT %H %cI',
      '--name-status',
      '--diff-filter=AMDRT',
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[sitemap] git log failed. lastmod will use content dates only. ${message}`);
    return new Map();
  }

  const files = new Map();
  let current = null;

  for (const line of output.split('\n')) {
    const commit = line.match(/^COMMIT ([0-9a-f]{40}) (\S+)$/);
    if (commit) {
      current = {
        iso: toIsoDate(commit[2]),
        boundary: boundaryCommits.has(commit[1]),
      };
      continue;
    }
    if (!current?.iso || !line.includes('\t')) {
      continue;
    }

    const parts = line.split('\t');
    const status = parts[0] ?? '';
    const filePath = parts[parts.length - 1];
    if (!filePath || files.has(filePath)) {
      continue;
    }

    files.set(filePath, {
      iso: current.iso,
      added: status.startsWith('A'),
      boundary: current.boundary,
    });
  }

  return files;
}

function gitLastmod(gitFiles, relPath, allowAdd) {
  const git = gitFiles.get(relPath);
  if (!git?.iso || git.boundary) {
    return undefined;
  }
  if (git.added && !allowAdd) {
    return undefined;
  }
  return git.iso;
}

// Frontmatter wins when the only git commit is the one that added the file. A later
// commit that did not refresh `updatedAt` / `date` replaces that stale frontmatter date.
// `/glossary/mime-types` is the example: frontmatter still says 2024-11-15, but the file
// was edited after it was imported.
function contentFileLastmod(gitFiles, relPath, contentDate) {
  const editedAt = gitLastmod(gitFiles, relPath, false);
  if (contentDate && editedAt && Date.parse(editedAt) > Date.parse(contentDate)) {
    return { iso: editedAt, source: 'git' };
  }
  if (contentDate) {
    return { iso: contentDate, source: 'content' };
  }
  const addedOrEdited = gitLastmod(gitFiles, relPath, true);
  return addedOrEdited ? { iso: addedOrEdited, source: 'git' } : undefined;
}

function frontmatterDate(data) {
  return toIsoDate(data.updatedAt ?? data.publishedAt ?? data.date);
}

function collectLastmods() {
  const gitFiles = collectGitFiles();
  const lastmods = new Map();
  const sources = { content: 0, git: 0 };

  function setRoute(route, result) {
    if (!result?.iso) {
      return;
    }
    const previous = lastmods.get(route);
    if (!previous || Date.parse(result.iso) > Date.parse(previous.iso)) {
      lastmods.set(route, result);
    }
  }

  for (const section of CONTENT_SECTIONS) {
    const absDir = path.join(process.cwd(), section.dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }

    let newestItem;
    for (const file of fs.readdirSync(absDir)) {
      if (!/\.mdx?$/.test(file)) {
        continue;
      }
      const relPath = path.posix.join(section.dir, file);
      const { data } = matter(fs.readFileSync(path.join(absDir, file), 'utf8'));
      const result = contentFileLastmod(gitFiles, relPath, frontmatterDate(data));
      if (!result) {
        continue;
      }
      const fileSlug = file.replace(/\.mdx?$/, '');
      const slug = (section.frontmatterSlug && data.slug?.trim()) || fileSlug;
      setRoute(`${section.route}/${slug.toLowerCase()}`, result);
      if (!newestItem || Date.parse(result.iso) > Date.parse(newestItem.iso)) {
        newestItem = result;
      }
    }

    if (section.indexFiles?.length) {
      if (newestItem) {
        setRoute(section.route, newestItem);
        for (const indexFile of section.indexFiles) {
          const editedAt = gitLastmod(gitFiles, indexFile, false);
          if (editedAt) {
            setRoute(section.route, { iso: editedAt, source: 'git' });
          }
        }
      } else {
        for (const indexFile of section.indexFiles) {
          setRoute(section.route, contentFileLastmod(gitFiles, indexFile, undefined));
        }
      }
    }
  }

  for (const [route, files] of Object.entries(CONTENT_PAGE_FILES)) {
    for (const file of files) {
      const editedAt = gitLastmod(gitFiles, file, false);
      if (editedAt) {
        setRoute(route, { iso: editedAt, source: 'git' });
      }
    }
  }

  for (const page of STATIC_PAGES) {
    for (const file of page.files) {
      setRoute(page.route, contentFileLastmod(gitFiles, file, undefined));
    }
  }

  for (const result of lastmods.values()) {
    sources[result.source] += 1;
  }
  console.info(
    `[sitemap] lastmod from content dates: ${sources.content}; from git commits: ${sources.git}.`,
  );

  return lastmods;
}

const lastmods = collectLastmods();

// Changelog entries pulled from GitHub at build time have no local file, but their slug
// starts with the publish date.
function resolveLastmod(pagePath) {
  const normalized = pagePath.length > 1 ? pagePath.replace(/\/+$/, '') : pagePath;
  const known = lastmods.get(normalized);
  if (known) {
    return known.iso;
  }
  const changelogDate = normalized.match(/^\/changelog\/(\d{4}-\d{2}-\d{2})/);
  return changelogDate ? toIsoDate(changelogDate[1]) : undefined;
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://www.unkey.com',
  generateRobotsTxt: true,
  // Route handlers back the `.md` twins via rewrites; they are not pages to index.
  exclude: ['/api/*', '/hero-variant/*'],
  additionalPaths: async (config) => [await config.transform(config, '/')],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/hero-variant/' },
    ],
  },
  // The default stamps every URL with the build time, which tells crawlers the whole site
  // changed on every deploy. Use content dates or per-file git commits, and omit lastmod
  // where neither exists.
  autoLastmod: false,
  transform: async (config, pagePath) => ({
    loc: pagePath,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: resolveLastmod(pagePath),
    alternateRefs: config.alternateRefs ?? [],
  }),
};
