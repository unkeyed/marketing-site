import { aboutContentData } from '@/constants/about';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function GET() {
  const { values, team, investors } = aboutContentData;

  const body = [
    '# About Unkey',
    '',
    'Founded in 2023 by James Perkins and Andreas Thomas, Unkey is building a fast, scalable, and straightforward API management platform.',
    '',
    `Source: ${toAbsoluteSiteUrl('/about')}`,
    '',
    '---',
    '',
    '## Our values',
    '',
    ...values.map((value) => `- **${value.title}** — ${value.description}`),
    '',
    '## The team',
    '',
    team.subtitle,
    '',
    ...team.qaItems.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),
    '## Founders',
    '',
    ...team.founders.map((founder) => `- **${founder.name}** — ${founder.title}`),
    '',
    '## Investors',
    '',
    investors.description,
    '',
    ...investors.list.map(
      (investor) => `- **${investor.name}** — ${investor.role.replace(/[\r\n]+/g, ' ')}`,
    ),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
