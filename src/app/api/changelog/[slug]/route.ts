import { notFound } from 'next/navigation';

import { getAllChangelogEntries, getChangelogEntryBySlug } from '@/app/(website)/changelog/data';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const entry = await getChangelogEntryBySlug(slug);

  if (!entry || (isProduction && entry.isDraft)) {
    notFound();
  }

  const url = toAbsoluteSiteUrl(`/changelog/${entry.slug}`);

  const body = [
    `# ${entry.title}`,
    '',
    entry.seo.description,
    '',
    `Source: ${url}`,
    `Published: ${entry.publishedAt}`,
    '',
    '---',
    '',
    entry.rawContent.trim(),
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
  const entries = await getAllChangelogEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}
