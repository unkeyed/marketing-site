import { notFound } from 'next/navigation';

import { getAllCaseStudies, getCaseStudyDataBySlug } from '@/lib/case-studies/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const caseStudy = getCaseStudyDataBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const url = toAbsoluteSiteUrl(caseStudy.pathname);
  const authorNames = caseStudy.authors.map((author) => author.name).join(', ');
  const companyOverviewLines =
    caseStudy.companyOverview?.items.map((item) => `${item.label}: ${item.content}`) ?? [];

  const body = [
    `# ${caseStudy.title}`,
    '',
    caseStudy.caption,
    '',
    `Source: ${url}`,
    authorNames ? `Author: ${authorNames}` : '',
    `Published: ${caseStudy.publishedAt}`,
    ...companyOverviewLines,
    '',
    '---',
    '',
    caseStudy.content.trim(),
    '',
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug.current }));
}

export const dynamicParams = false;
