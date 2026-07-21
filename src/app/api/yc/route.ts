import { ycContentData } from '@/constants/yc';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function GET() {
  const { description, benefits } = ycContentData;

  const body = [
    '# Unkey Y Combinator Program',
    '',
    description,
    '',
    `Source: ${toAbsoluteSiteUrl('/yc')}`,
    '',
    '---',
    '',
    '## Benefits',
    '',
    ...benefits.flatMap((benefit) => [`### ${benefit.title}`, '', benefit.description, '']),
    'Apply on the Y Combinator Program page.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
