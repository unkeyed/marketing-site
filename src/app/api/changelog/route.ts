import { getAllChangelogEntries } from '@/app/(website)/changelog/data';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

export async function GET() {
  const entries = await getAllChangelogEntries();

  const lines = entries.map((entry) => {
    const htmlUrl = toAbsoluteSiteUrl(`/changelog/${entry.slug}`);
    const mdUrl = toAbsoluteSiteUrl(`/changelog/${entry.slug}.md`);
    const description = entry.seo.description ? ` — ${entry.seo.description}` : '';
    return `- [${entry.title}](${htmlUrl}) ([Markdown](${mdUrl})) · ${entry.publishedAt}${description}`;
  });

  const body = [
    '# Unkey Changelog',
    '',
    'Unkey product updates and changes.',
    '',
    `Source: ${toAbsoluteSiteUrl('/changelog')}`,
    '',
    'Append `.md` to any changelog entry URL to receive the raw markdown source.',
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
