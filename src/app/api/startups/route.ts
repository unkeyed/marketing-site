import { startupsContentData } from '@/constants/startups';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function GET() {
  const { description, benefits } = startupsContentData;

  const body = [
    '# Unkey Startups Program',
    '',
    description,
    '',
    `Source: ${toAbsoluteSiteUrl('/startups')}`,
    '',
    '---',
    '',
    '## Benefits',
    '',
    ...benefits.flatMap((benefit) => [`### ${benefit.title}`, '', benefit.description, '']),
    'Apply on the Startups Program page.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
