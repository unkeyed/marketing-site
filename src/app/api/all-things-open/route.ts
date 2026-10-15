import { allThingsOpenContentData } from '@/constants/all-things-open';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export function GET() {
  const { description, benefits } = allThingsOpenContentData;

  const body = [
    '# All Things Open giveaway',
    '',
    description,
    '',
    'Prizes: 1x Nintendo Switch 2, 5x NuPhy Air75 V3, and 5x NuPhy Kick75 keyboards.',
    '',
    `Source: ${toAbsoluteSiteUrl('/all-things-open')}`,
    '',
    '---',
    '',
    '## Prizes',
    '',
    ...benefits.flatMap((benefit) => [`### ${benefit.title}`, '', benefit.description, '']),
    'Deploy a project to Unkey Compute, then submit it on the giveaway page.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
