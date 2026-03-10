import path from 'path';

import { globSync } from 'glob';
import slugify from 'slugify';

import type { IBlogSearchItem } from '@/types/blog';
import type {
  IGlossaryFaqItem,
  IGlossaryLetterGroup,
  IGlossaryTakeaways,
  IGlossaryTerm,
  IGlossaryTermData,
  INewGlossaryFrontmatter,
} from '@/types/glossary';
import { getAllPosts } from '@/lib/blog/posts';
import { compileMdx, readAndParseMarkdown, removeMarkdownSymbols } from '@/lib/markdown';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import { getExcerpt } from '@/lib/utils';

const GLOSSARY_DIR_PATH = path.join(process.cwd(), 'src/content/glossary');
const GLOSSARY_SEARCH_SUGGESTIONS_LIMIT = 8;
const GLOSSARY_SEARCH_CONTENT_MAX_LENGTH = 3000;

interface IGlossarySourceEntry {
  filePath: string;
  fileSlug: string;
  resolvedSlug: string;
}

function getGlossarySourceEntries(): IGlossarySourceEntry[] {
  const files = globSync('*.mdx', {
    cwd: GLOSSARY_DIR_PATH,
    ignore: ['**/CONTRIBUTING.md'],
    absolute: true,
  });

  return files.map((filePath: string) => {
    const relativePath = path.relative(GLOSSARY_DIR_PATH, filePath);
    const fileSlug = relativePath.replace(/\.mdx?$/, '');
    const { data } = readAndParseMarkdown<INewGlossaryFrontmatter>(filePath);
    const resolvedSlug = (data?.slug?.trim() || fileSlug).toLowerCase();

    return {
      filePath,
      fileSlug,
      resolvedSlug,
    };
  });
}

function getGlossarySlugs(): string[] {
  return Array.from(new Set(getGlossarySourceEntries().map((entry) => entry.resolvedSlug)));
}

function getGlossaryTermAnchorId(letter: string, term: string): string {
  return `term-${letter.toLowerCase()}-${slugify(term, { lower: true, strict: true })}`;
}

function getGlossaryDataBySlug(slug: string): IGlossaryTermData | null {
  try {
    const normalizedSlug = slug.trim().toLowerCase();
    const glossaryEntry = getGlossarySourceEntries().find(
      (entry) => entry.resolvedSlug === normalizedSlug || entry.fileSlug === normalizedSlug,
    );

    if (!glossaryEntry) {
      console.error(`Glossary term not found: ${slug}`);
      return null;
    }

    const filePath = glossaryEntry.filePath;
    const { data, content } = readAndParseMarkdown<INewGlossaryFrontmatter>(filePath);

    if (!data) {
      console.error(`Glossary term not found: ${slug}`);
      return null;
    }

    const term = (data.term || data.title || slug).trim();
    const title = (data.title || term).trim();
    const h1 = (data.h1 || term).trim();
    const letter = term.charAt(0).toUpperCase();
    const plainContent = removeMarkdownSymbols(content);
    const description = (
      data.description || getExcerpt({ content: plainContent, length: 180 })
    ).trim();
    const tldr = (data.takeaways?.tldr || description).trim();
    const takeaways: IGlossaryTakeaways = {
      tldr,
      didYouKnow: data.takeaways?.didYouKnow,
      usageInAPIs: data.takeaways?.usageInAPIs,
      bestPractices: data.takeaways?.bestPractices,
      historicalContext: data.takeaways?.historicalContext,
      recommendedReading: data.takeaways?.recommendedReading,
      definitionAndStructure: data.takeaways?.definitionAndStructure,
    };
    const faq: IGlossaryFaqItem[] = (data.faq ?? [])
      .filter((item): item is IGlossaryFaqItem => Boolean(item?.question && item?.answer))
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }));

    const anchorId = getGlossaryTermAnchorId(letter, term);

    return {
      slug: glossaryEntry.resolvedSlug,
      title,
      h1,
      term,
      description,
      tldr,
      takeaways,
      faq,
      anchorId,
      letter,
      content,
      pathname: `/glossary/${glossaryEntry.resolvedSlug}`,
      seo: {
        title,
        description,
        socialImage: toAbsoluteSiteUrl(`/api/og?template=blog&title=${encodeURIComponent(term)}`),
        noIndex: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching glossary term by slug: ${slug}`, error);
    return null;
  }
}

async function getGlossaryTermBySlug(slug: string): Promise<IGlossaryTerm | null> {
  try {
    const glossaryTermData = getGlossaryDataBySlug(slug);

    if (!glossaryTermData) {
      return null;
    }

    const relatedPosts = getAllPosts();
    const { content: compiledMdx, toc: tableOfContents } = await compileMdx(
      glossaryTermData.content,
      {
        relatedPosts,
      },
    );

    return {
      ...glossaryTermData,
      content: compiledMdx,
      tableOfContents,
    };
  } catch (error) {
    console.error(`Error compiling glossary term by slug: ${slug}`, error);
    return null;
  }
}

function getAllGlossaryTerms(): IGlossaryTermData[] {
  const slugs = getGlossarySlugs();
  const terms = slugs.map((slug) => getGlossaryDataBySlug(slug));

  return terms
    .filter((term): term is IGlossaryTermData => Boolean(term))
    .sort((a, b) => a.term.localeCompare(b.term));
}

function getGlossaryGroups(): IGlossaryLetterGroup[] {
  const grouped = new Map<string, IGlossaryTermData[]>();

  for (const term of getAllGlossaryTerms()) {
    const letter = /^[A-Z]$/.test(term.letter) ? term.letter : '#';
    const group = grouped.get(letter) ?? [];
    group.push(term);
    grouped.set(letter, group);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, terms]) => ({
      letter,
      terms: terms.map((term) => ({
        anchorId: term.anchorId,
        term: term.term,
        description: term.description,
        pathname: term.pathname,
      })),
    }));
}

function getGlossarySearchItems(): IBlogSearchItem[] {
  return getAllGlossaryTerms().map((term) => {
    const plainContent = removeMarkdownSymbols(term.content);
    const searchableText =
      plainContent.length > GLOSSARY_SEARCH_CONTENT_MAX_LENGTH
        ? plainContent.slice(0, GLOSSARY_SEARCH_CONTENT_MAX_LENGTH)
        : plainContent;

    return {
      id: term.slug,
      title: term.term,
      description: term.description,
      url: term.pathname,
      category: 'glossary',
      searchableText,
    };
  });
}

function getGlossarySearchSuggestions(
  limit = GLOSSARY_SEARCH_SUGGESTIONS_LIMIT,
): IBlogSearchItem[] {
  return getGlossarySearchItems().slice(0, limit);
}

export { getAllGlossaryTerms, getGlossaryDataBySlug, getGlossaryGroups };
export { getGlossarySearchItems, getGlossarySearchSuggestions, getGlossaryTermBySlug };
