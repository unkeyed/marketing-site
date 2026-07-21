import { getAllCaseStudies } from '@/lib/case-studies/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

export async function GET() {
  const caseStudies = getAllCaseStudies();

  const lines = caseStudies.map((caseStudy) => {
    const htmlUrl = toAbsoluteSiteUrl(caseStudy.pathname);
    const mdUrl = toAbsoluteSiteUrl(`${caseStudy.pathname}.md`);
    const caption = caseStudy.caption ? ` — ${caseStudy.caption}` : '';
    return `- [${caseStudy.title}](${htmlUrl}) ([Markdown](${mdUrl}))${caption}`;
  });

  const body = [
    '# Unkey Case Studies',
    '',
    'How teams build and scale on Unkey.',
    '',
    `Source: ${toAbsoluteSiteUrl('/case-studies')}`,
    '',
    'Append `.md` to any case study URL to receive the raw markdown source.',
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
