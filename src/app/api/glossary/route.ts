import { getAllGlossaryTerms } from '@/lib/glossary/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export async function GET() {
  const terms = getAllGlossaryTerms();

  const lines = terms.map((term) => {
    const htmlUrl = toAbsoluteSiteUrl(term.pathname);
    const mdUrl = toAbsoluteSiteUrl(`${term.pathname}.md`);
    const description = term.description ? ` — ${term.description}` : '';
    return `- [${term.term}](${htmlUrl}) ([Markdown](${mdUrl}))${description}`;
  });

  const body = [
    '# Unkey Glossary',
    '',
    'Clear definitions for API and platform terms.',
    '',
    `Source: ${toAbsoluteSiteUrl('/glossary')}`,
    '',
    'Append `.md` to any glossary term URL to receive the raw markdown source.',
    '',
    '---',
    '',
    ...lines,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
