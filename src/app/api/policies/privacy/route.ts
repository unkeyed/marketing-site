import { notFound } from 'next/navigation';

import { getLegalPageRawBySlug } from '@/lib/legal/pages';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export async function GET() {
  const page = getLegalPageRawBySlug('privacy');

  if (!page) {
    notFound();
  }

  const body = [
    `# ${page.title}`,
    '',
    `Source: ${toAbsoluteSiteUrl('/policies/privacy')}`,
    `Last updated: ${page.updatedAt}`,
    '',
    '---',
    '',
    page.content,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
