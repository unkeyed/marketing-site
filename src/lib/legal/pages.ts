import path from 'path';

import config from '@/configs/website-config';
import { globSync } from 'glob';

import { type ILegalPage, type ILegalPageData } from '@/types/legal';
import { compileMdx, readAndParseMarkdown, removeMarkdownSymbols } from '@/lib/markdown';
import { getExcerpt } from '@/lib/utils';

// Directory containing markdown legal pages
const LEGAL_DIR_PATH = path.join(process.cwd(), config.legal.contentDir);

function getSlugsByPath(globPattern: string, ignore: string[] = []): string[] {
  const files = globSync(globPattern, {
    cwd: LEGAL_DIR_PATH,
    ignore: ['**/CONTRIBUTING.md', ...ignore],
    absolute: true,
  });

  return files.map((filePath: string) => {
    const relativePath = path.relative(LEGAL_DIR_PATH, filePath);
    return relativePath.replace(/\.md$/, '');
  });
}

/**
 * Reads and constructs a single legal page object from markdown by slug.
 *
 * @param {string} slug               File slug (without extension).
 * @returns {ILegalPageWithTableOfContents | null}
 */
async function getLegalPageBySlug(slug: string): Promise<ILegalPage | null> {
  try {
    const filePath = path.join(LEGAL_DIR_PATH, `${slug}.md`);

    const { data, content } = readAndParseMarkdown<ILegalPageData>(filePath);

    if (!data) {
      console.error(`Legal page not found: ${slug}`);
      return null;
    }

    const plainContent = removeMarkdownSymbols(content);
    const { title, seo, updatedAt, isDraft = false } = data;
    const { content: compiledMdx, toc: tableOfContents } = await compileMdx(content);

    const page = {
      title,
      slug: { current: slug },
      isDraft: Boolean(isDraft),
      updatedAt: updatedAt ?? new Date().toISOString().slice(0, 10),
      content: compiledMdx,
      tableOfContents,
      seo: {
        title: seo?.title ?? title,
        description: seo?.description ?? getExcerpt({ content: plainContent, length: 160 }),
        socialImage: seo?.socialImage ?? config.defaultSocialImage,
        noIndex: seo?.noIndex ?? isDraft,
      },
    };

    return page;
  } catch (error) {
    console.error(`Error fetching legal page by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Returns metadata (without TOC) for **all** legal markdown pages.
 * The array is sorted alphabetically by title so that navigation remains stable.
 *
 * @returns {ILegalPageData[]} Array of pages.
 */
async function getAllLegalPages(): Promise<ILegalPageData[]> {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  const slugs = getSlugsByPath('**/*.md');

  const pages = await Promise.all(slugs.map((slug) => getLegalPageBySlug(slug)));

  return pages
    .filter((page): page is ILegalPage => page !== null)
    .filter((page) => !(isProd && page.isDraft));
}

export { getAllLegalPages, getLegalPageBySlug };
