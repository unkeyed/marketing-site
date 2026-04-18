import type { ReactElement } from 'react';

import { compileMDX } from 'next-mdx-remote/rsc';

import {
  getAllChangelogPosts,
  getChangelogPostBySlug,
  IChangelogPost,
  IChangelogTag,
  POSTS_PER_PAGE,
} from '@/lib/changelog/posts';
import {
  rehypeCode,
  remarkAdmonition,
  remarkCodeTab,
  remarkGfm,
  remarkHeading,
  remarkImage,
  remarkNpm,
  remarkSteps,
} from '@/lib/mdx-plugins';
import { getFormattedDate, getTimeToRead } from '@/lib/utils';
import { getComponents } from '@/components/content/get-components';

import { changelogMdxComponents } from './components/changelog-mdx-components';

const GITHUB_REPO = 'unkeyed/unkey';
const CHANGELOG_PATH = 'docs/product/changelog';
const REVALIDATE_SECONDS = 60 * 60 * 24; // 1 day

const GITHUB_TAGS: IChangelogTag[] = [{ label: 'Product', dotColor: 'blue' }];

interface GitHubContentEntry {
  type: string;
  name: string;
  download_url: string;
}

function parseFrontmatter(source: string): {
  title: string;
  description?: string;
} {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { title: '' };
  }

  const fm = match[1];

  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '').trim() : undefined;
  };

  return { title: get('title') ?? '', description: get('description') };
}

async function fetchRawChangelogs(): Promise<
  Array<{ slug: string; date: string; title: string; description?: string; source: string }>
> {
  try {
    const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CHANGELOG_PATH}`,
      {
        headers,
        next: { revalidate: REVALIDATE_SECONDS, tags: ['changelogs'] },
      },
    );
    if (!res.ok) {
      return [];
    }

    const entries = (await res.json()) as GitHubContentEntry[];
    const mdxFiles = entries.filter((f) => f.type === 'file' && f.name.endsWith('.mdx'));

    const results = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const raw = await fetch(file.download_url, {
            next: { revalidate: REVALIDATE_SECONDS, tags: ['changelogs'] },
          });
          if (!raw.ok) {
            console.error(`Failed to fetch changelog file ${file.name}: ${raw.status}`);
            return null;
          }
          const source = (await raw.text()).replace(/^noindex:\s*.+$/m, '');
          const date = file.name.slice(0, -4); // YYYY-MM-DD from filename
          const { title, description } = parseFrontmatter(source);
          return { slug: date, date, title, description, source };
        } catch (err) {
          console.error(`Failed to process changelog file ${file.name}:`, err);
          return null;
        }
      }),
    );

    return results.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  } catch (err) {
    console.error('Failed to fetch product changelogs:', err);
    return [];
  }
}

async function compileGitHubChangelogMdx(
  source: string,
  { headingIdPrefix }: { headingIdPrefix?: string } = {},
): Promise<ReactElement> {
  const baseComponents = getComponents({ contentWidth: 704 });
  const components = {
    ...baseComponents,
    ...changelogMdxComponents,
  } as Record<string, unknown>;

  const { content } = await compileMDX({
    source,
    components: components as Parameters<typeof compileMDX>[0]['components'],
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkHeading, { tocRef: [], idPrefix: headingIdPrefix }],
          [remarkImage, { useImport: false }],
          remarkAdmonition,
          remarkSteps,
          remarkNpm,
          remarkCodeTab,
        ],
        rehypePlugins: [rehypeCode],
      },
    },
  });

  return content;
}

async function buildGithubPost(
  entry: { slug: string; date: string; title: string; description?: string; source: string },
  opts: { headingIdPrefix?: boolean } = {},
): Promise<IChangelogPost> {
  const safeSlugPrefix = entry.slug.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  const content = await compileGitHubChangelogMdx(entry.source, {
    headingIdPrefix: opts.headingIdPrefix && safeSlugPrefix ? `${safeSlugPrefix}--` : undefined,
  });

  return {
    slug: entry.slug,
    title: entry.title || entry.slug,
    isDraft: false,
    publishedAt: entry.date,
    publishedAtFormatted: getFormattedDate(entry.date, 'short'),
    readingTime: getTimeToRead(entry.source.replace(/^---[\s\S]*?---/, '')),
    tags: GITHUB_TAGS,
    content,
    seo: {
      title: entry.title || entry.slug,
      description: entry.description ?? '',
      socialImage: '/social-previews/main.jpg',
      noIndex: false,
    },
  };
}

export async function getAllChangelogEntries(opts?: {
  prefixHeadingIds?: boolean;
}): Promise<IChangelogPost[]> {
  const [localPosts, githubRaw] = await Promise.all([
    getAllChangelogPosts({ prefixHeadingIds: opts?.prefixHeadingIds }),
    fetchRawChangelogs(),
  ]);

  const localSlugs = new Set(localPosts.map((p) => p.slug));
  const uniqueGithubEntries = githubRaw.filter((entry) => !localSlugs.has(entry.slug));

  const githubPosts = await Promise.all(
    uniqueGithubEntries.map((entry) =>
      buildGithubPost(entry, { headingIdPrefix: opts?.prefixHeadingIds }),
    ),
  );

  return [...localPosts, ...githubPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getChangelogEntryBySlug(slug: string): Promise<IChangelogPost | null> {
  const localPost = await getChangelogPostBySlug(slug);
  if (localPost) {
    return localPost;
  }

  const githubRaw = await fetchRawChangelogs();
  const entry = githubRaw.find((e) => e.slug === slug);
  if (!entry) {
    return null;
  }

  return buildGithubPost(entry);
}

export interface IPaginatedChangelogEntries {
  posts: IChangelogPost[];
  currentPage: number;
  totalPages: number;
  hasNewer: boolean;
  hasOlder: boolean;
}

export async function getPaginatedChangelogEntries(
  page: number,
): Promise<IPaginatedChangelogEntries | null> {
  const allPosts = await getAllChangelogEntries({ prefixHeadingIds: true });
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));

  if (page < 1 || page > totalPages) {
    return null;
  }

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    currentPage: page,
    totalPages,
    hasNewer: page > 1,
    hasOlder: page < totalPages,
  };
}

export { POSTS_PER_PAGE };
