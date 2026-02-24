import fs from 'fs';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';

import { type IAuthorData, type ISlug, type ITableOfContentsItem } from '@/types/common';
import { getComponents } from '@/components/content/get-components';

import {
  rehypeCode,
  remarkAdmonition,
  remarkCodeTab,
  remarkGfm,
  remarkHeading,
  remarkImage,
  remarkNpm,
  remarkSteps,
} from './mdx-plugins';

export interface CompileMdxOptions {
  allowMediaBreakout?: boolean;
  contentWidth?: number;
  // related to IPostData
  relatedPosts?: Array<{
    slug: ISlug;
    title: string;
    authors: IAuthorData[];
    publishedAt: string;
    pathname: string;
  }>;
}

export async function compileMdx(source: string, opts: CompileMdxOptions = {}) {
  const toc: ITableOfContentsItem[] = [];

  const components = getComponents({
    allowMediaBreakout: opts.allowMediaBreakout ?? false,
    contentWidth: opts.contentWidth ?? 704,
    relatedPosts: opts.relatedPosts ?? [],
  });

  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkHeading, { tocRef: toc }],
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

  return { content, frontmatter, toc };
}

/**
 * Removes markdown symbols, HTML tags, emojis, and other special characters from text
 * @param {string} text - The text to clean and normalize
 * @returns {string} The text with all markdown and special characters removed
 */
export function removeMarkdownSymbols(text: string): string {
  const emojiRegex =
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

  return text
    .replace(/\\_/g, '{{UNDERSCORE}}')
    .replace(/```([\s\S]*?)```/g, '') // Remove code blocks
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(emojiRegex, '') // Remove emojis
    .replace(/[\r\n]+/gm, ' ') // Replace line breaks with space
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1') // Replace markdown links with just the text
    .replace(/--+/g, '') // Remove multiple dashes
    .replace(/\|/g, '') // Remove pipe characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/(\*|(?<=\s|^)_(?=\s|$)|~|`|#)/g, '') // Remove markdown symbols
    .replace(/{{UNDERSCORE}}/g, '_') // Restore underscores
    .trim();
}

type TMarkdownDataResponse<T> = {
  data: T;
  content: string;
};

/**
 * Reads and parses markdown file with frontmatter
 * @param filePath - Path to the markdown file
 * @throws {Error} When file cannot be read or parsed
 *
 * @returns Object containing parsed frontmatter data and content
 */
export function readAndParseMarkdown<T>(filePath: string): TMarkdownDataResponse<T> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const result = matter(fileContent) as matter.GrayMatterFile<string>;

    return {
      data: result.data as T,
      content: result.content,
    };
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error);
    throw new Error(`Failed to read markdown file: ${filePath}`);
  }
}
