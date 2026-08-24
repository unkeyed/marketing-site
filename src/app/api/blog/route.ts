import { getVisiblePosts } from '@/lib/blog/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getVisiblePosts();

  const lines = posts.map((post) => {
    const htmlUrl = toAbsoluteSiteUrl(post.pathname);
    const mdUrl = toAbsoluteSiteUrl(`${post.pathname}.md`);
    const caption = post.caption ? ` — ${post.caption}` : '';
    return `- [${post.title}](${htmlUrl}) ([Markdown](${mdUrl}))${caption}`;
  });

  const body = [
    '# Unkey Blog',
    '',
    'Articles on API development, security, observability, and product updates.',
    '',
    `Source: ${toAbsoluteSiteUrl('/blog')}`,
    '',
    'Append `.md` to any post URL to receive the raw markdown source.',
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
