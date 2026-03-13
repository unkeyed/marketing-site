import fs from 'node:fs';
import path from 'path';

import { ReactElement } from 'react';
import config from '@/configs/website-config';
import { globSync } from 'glob';

import { ISeoFields } from '@/types/common';
import { compileMdx, readAndParseMarkdown, removeMarkdownSymbols } from '@/lib/markdown';
import { getExcerpt, getFormattedDate, getTimeToRead } from '@/lib/utils';

export const POSTS_PER_PAGE = 20;

const CHANGELOG_DIR_PATH = path.join(process.cwd(), config.changelog.contentDir);
const CHANGELOG_FILE_EXTENSIONS = ['.md', '.mdx'] as const;

export interface IChangelogTag {
  label: string;
  dotColor?:
    | 'blue'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'green'
    | 'red'
    | 'lightblue'
    | 'lime'
    | 'pink'
    | 'gray';
}

const ALLOWED_DOT_COLORS = new Set<NonNullable<IChangelogTag['dotColor']>>([
  'blue',
  'yellow',
  'orange',
  'purple',
  'green',
  'red',
  'lightblue',
  'lime',
  'pink',
  'gray',
]);

function normalizeDotColor(value: unknown): IChangelogTag['dotColor'] | undefined {
  if (typeof value !== 'string') return undefined;
  const normalizedColor = value.trim().toLowerCase();
  return ALLOWED_DOT_COLORS.has(normalizedColor as NonNullable<IChangelogTag['dotColor']>)
    ? (normalizedColor as NonNullable<IChangelogTag['dotColor']>)
    : undefined;
}

function normalizeChangelogTag(tag: string | IChangelogTag): IChangelogTag | null {
  if (typeof tag === 'string') {
    const [rawLabel, rawColor] = tag.split(':', 2).map((value) => value.trim());
    if (!rawLabel) {
      return null;
    }

    const dotColor = normalizeDotColor(rawColor);
    return dotColor ? { label: rawLabel, dotColor } : { label: rawLabel };
  }

  if (!tag || typeof tag !== 'object') {
    return null;
  }

  const label = typeof tag.label === 'string' ? tag.label.trim() : '';
  if (!label) {
    return null;
  }

  const dotColor = normalizeDotColor(tag.dotColor);
  return dotColor ? { label, dotColor } : { label };
}

interface IChangelogPostMetadata {
  title: string;
  slug: string;
  isDraft: boolean;
  publishedAt?: string | Date;
  date?: string | Date;
  tags?: Array<string | IChangelogTag>;
  seo: ISeoFields;
}

interface IGetChangelogPostsOptions {
  prefixHeadingIds?: boolean;
}

export interface IChangelogPost extends Omit<IChangelogPostMetadata, 'publishedAt'> {
  publishedAt: string;
  publishedAtFormatted: string;
  readingTime: string;
  tags: IChangelogTag[];
  content: ReactElement;
}

/**
 * Reusable function to get slugs (relative path without extension)
 */
function getSlugsByPath(baseDir: string, globPattern: string, ignore: string[] = []): string[] {
  const files = globSync(globPattern, {
    cwd: baseDir,
    ignore: ['**/CONTRIBUTING.md', ...ignore],
    absolute: true,
  });

  return files.map((filePath: string) => {
    const relativePath = path.relative(baseDir, filePath);
    return relativePath.replace(/\.(md|mdx)$/, '');
  });
}

function resolveChangelogFilePath(slug: string): string | null {
  for (const ext of CHANGELOG_FILE_EXTENSIONS) {
    const candidatePath = path.join(CHANGELOG_DIR_PATH, `${slug}${ext}`);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return null;
}

async function getChangelogPostBySlug(
  slug: string,
  opts?: IGetChangelogPostsOptions,
): Promise<IChangelogPost | null> {
  try {
    const filePath = resolveChangelogFilePath(slug);
    if (!filePath) return null;

    const { data, content } = readAndParseMarkdown<IChangelogPostMetadata>(filePath);

    if (!data) return null;

    const { title, isDraft = false, publishedAt, date, tags, seo } = data;
    const plainContent = removeMarkdownSymbols(content);
    const normalizedTags: IChangelogTag[] = Array.isArray(tags)
      ? tags
          .map((tag) => normalizeChangelogTag(tag))
          .filter((tag): tag is IChangelogTag => tag !== null)
      : [];

    const safeSlugPrefix = slug.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    const { content: compiledMdx } = await compileMdx(content, {
      headingIdPrefix: opts?.prefixHeadingIds && safeSlugPrefix ? `${safeSlugPrefix}--` : undefined,
    });

    const rawPublishedAt = publishedAt ?? date;
    const publishedDateIso =
      rawPublishedAt instanceof globalThis.Date
        ? rawPublishedAt.toISOString().slice(0, 10)
        : (rawPublishedAt ?? new Date().toISOString().slice(0, 10));

    return {
      slug,
      title,
      isDraft: Boolean(isDraft),
      publishedAt: publishedDateIso,
      publishedAtFormatted: getFormattedDate(publishedDateIso, 'short'),
      readingTime: getTimeToRead(plainContent),
      tags: normalizedTags,
      content: compiledMdx,
      seo: {
        title: seo?.title ?? title,
        description: seo?.description ?? getExcerpt({ content: plainContent, length: 160 }),
        socialImage: seo?.socialImage ?? config.defaultSocialImage,
        noIndex: seo?.noIndex ?? isDraft,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to load changelog post "${slug}":`, message);
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    return null;
  }
}

async function getAllChangelogPosts(opts?: IGetChangelogPostsOptions): Promise<IChangelogPost[]> {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  const slugs = getSlugsByPath(CHANGELOG_DIR_PATH, '**/*.{md,mdx}');

  const posts = await Promise.all(slugs.map((slug) => getChangelogPostBySlug(slug, opts)));

  return posts
    .filter((p): p is IChangelogPost => Boolean(p))
    .filter((p) => !(isProd && p.isDraft))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export interface IPaginatedChangelogResult {
  posts: IChangelogPost[];
  currentPage: number;
  totalPages: number;
  hasNewer: boolean;
  hasOlder: boolean;
}

/**
 * Retrieves a specific page of changelog posts with pagination metadata.
 * @param page - The 1-based page number to retrieve.
 * @returns An object containing the posts for the page and pagination info, or null if the page is invalid.
 */
async function getPaginatedChangelogPosts(page: number): Promise<IPaginatedChangelogResult | null> {
  const allPosts = await getAllChangelogPosts({ prefixHeadingIds: true });
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // Validate page number
  if (page < 1 || page > totalPages) {
    // Indicate an invalid page was requested
    return null;
  }

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  const hasNewer = page > 1;
  const hasOlder = page < totalPages;

  return {
    posts: paginatedPosts,
    currentPage: page,
    totalPages,
    hasNewer,
    hasOlder,
  };
}

export { getChangelogPostBySlug, getAllChangelogPosts, getPaginatedChangelogPosts };
