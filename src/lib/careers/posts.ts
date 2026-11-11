import path from 'path';

import { globSync } from 'glob';

import type { ICareerData, ICareerFrontmatter } from '@/types/career';
import { readAndParseMarkdown } from '@/lib/markdown';

const CAREERS_DIR_PATH = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src/content/careers');

export function getAllCareers(): ICareerData[] {
  return globSync('*.md', { cwd: CAREERS_DIR_PATH })
    .sort()
    .map((filename) => {
      const { data, content } = readAndParseMarkdown<ICareerFrontmatter>(
        path.join(CAREERS_DIR_PATH, filename),
      );
      const slug = filename.replace(/\.md$/, '');

      return {
        ...data,
        slug,
        pathname: `/careers/${slug}`,
        applicationUrl: `mailto:jobs@unkey.com?subject=${encodeURIComponent(`Application for ${data.title}`)}`,
        content,
      };
    })
    .filter((career) => career.visible === true);
}

export function getCareerBySlug(slug: string): ICareerData | undefined {
  const career = getAllCareers().find((career) => career.slug === slug);
  if (!career) return undefined;

  const { content: about } = readAndParseMarkdown(path.join(CAREERS_DIR_PATH, 'shared/about.md'));
  const { content: details } = readAndParseMarkdown(
    path.join(CAREERS_DIR_PATH, 'shared/details.md'),
  );

  return {
    ...career,
    content: [about, career.content, details, `[apply]: <${career.applicationUrl}>`].join('\n\n'),
  };
}
