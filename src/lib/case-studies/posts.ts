import path from 'path';

import { authors as authorsList } from '@/content/blog/taxonomy/authors';
import { globSync } from 'glob';

import { ICaseStudy, ICaseStudyData, INewCaseStudyFrontmatter } from '@/types/case-study';
import { getAllPosts } from '@/lib/blog/posts';
import { compileMdx, readAndParseMarkdown, removeMarkdownSymbols } from '@/lib/markdown';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import { getExcerpt, getTimeToRead } from '@/lib/utils';

const CASE_STUDIES_DIR_PATH = path.join(process.cwd(), 'src/content/case-studies');

function getCaseStudySlugs(): string[] {
  const files = globSync('*.mdx', {
    cwd: CASE_STUDIES_DIR_PATH,
    ignore: ['**/CONTRIBUTING.md'],
    absolute: true,
  });

  return files.map((filePath: string) => {
    const relativePath = path.relative(CASE_STUDIES_DIR_PATH, filePath);
    return relativePath.replace(/\.mdx?$/, '');
  });
}

function getCaseStudyDataBySlug(slug: string): ICaseStudyData | null {
  try {
    const filePath = path.join(CASE_STUDIES_DIR_PATH, `${slug}.mdx`);
    const { data, content } = readAndParseMarkdown<INewCaseStudyFrontmatter>(filePath);

    if (!data) {
      console.error(`Case study not found: ${slug}`);
      return null;
    }

    const { title, date, image, description, author, companyOverview } = data;
    const publishedAt = date ? new Date(date).toISOString() : new Date().toISOString();
    const normalizedImage = image?.trim();

    const matchedAuthor = authorsList.find((item) => item.id === author);
    if (!matchedAuthor) {
      throw new Error(`Unknown author "${author}".`);
    }

    const plainContent = removeMarkdownSymbols(content);
    const readingTime = getTimeToRead(plainContent);

    return {
      slug: { current: slug },
      pathname: `/case-studies/${slug}`,
      title,
      authors: [matchedAuthor],
      cover: normalizedImage,
      publishedAt,
      caption: description ?? '',
      content,
      readingTime,
      companyOverview: companyOverview
        ? {
            logoSrc: companyOverview.logo.src,
            logoAlt: companyOverview.logo.alt,
            logoWidth: companyOverview.logo.width,
            logoHeight: companyOverview.logo.height,
            items: companyOverview.items,
          }
        : undefined,
      seo: {
        title,
        description: description ?? getExcerpt({ content: plainContent, length: 160 }),
        socialImage:
          normalizedImage && normalizedImage.startsWith('http')
            ? normalizedImage
            : normalizedImage
              ? toAbsoluteSiteUrl(normalizedImage)
              : toAbsoluteSiteUrl(`/api/og?template=blog&title=${encodeURIComponent(title)}`),
        noIndex: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching case study by slug: ${slug}`, error);
    return null;
  }
}

async function getCaseStudyBySlug(slug: string): Promise<ICaseStudy | null> {
  try {
    const caseStudyData = getCaseStudyDataBySlug(slug);

    if (!caseStudyData) {
      return null;
    }

    const relatedPosts = getAllPosts();
    const { content: compiledMdx, toc: tableOfContents } = await compileMdx(caseStudyData.content, {
      relatedPosts,
    });

    return {
      ...caseStudyData,
      content: compiledMdx,
      tableOfContents,
    };
  } catch (error) {
    console.error(`Error compiling case study by slug: ${slug}`, error);
    return null;
  }
}

function getAllCaseStudies(): ICaseStudyData[] {
  const slugs = getCaseStudySlugs();
  const caseStudies = slugs.map((slug) => getCaseStudyDataBySlug(slug));

  return caseStudies
    .filter((item): item is ICaseStudyData => Boolean(item))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export { getAllCaseStudies, getCaseStudyBySlug, getCaseStudyDataBySlug };
