import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getAllPosts } from '@/lib/blog/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

const LLMS_TXT_PATH = path.join(process.cwd(), 'public', 'llms.txt');

export const dynamic = 'force-static';

export async function GET() {
  const llmsTxt = await readFile(LLMS_TXT_PATH, 'utf8');
  const hiddenPosts = getAllPosts().filter((post) => post.isHidden);
  const hiddenPostLines = hiddenPosts.map((post) => {
    const htmlUrl = toAbsoluteSiteUrl(post.pathname);
    const markdownUrl = toAbsoluteSiteUrl(`${post.pathname}.md`);
    const caption = post.caption ? ` — ${post.caption}` : '';
    return `- [${post.title}](${htmlUrl}) ([Markdown](${markdownUrl}))${caption}`;
  });

  const body = hiddenPostLines.length
    ? [
        llmsTxt.trimEnd(),
        '',
        '## Additional blog articles',
        '',
        'These published articles are excluded from on-site feeds but are available to crawlers and AI agents.',
        '',
        ...hiddenPostLines,
        '',
      ].join('\n')
    : llmsTxt;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
