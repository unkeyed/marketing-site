import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

const RULES_PATH = path.join(process.cwd(), 'src/content/giveaway/official-rules.md');

export const dynamic = 'force-static';

export async function GET() {
  const rules = await readFile(RULES_PATH, 'utf8');

  const body = [
    '# All Things Open Giveaway: Official Rules',
    '',
    `Source: ${toAbsoluteSiteUrl('/all-things-open/rules')}`,
    '',
    '---',
    '',
    rules.trim(),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
