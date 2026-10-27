import { cookies } from 'next/headers';
import { allThingsOpenContentData } from '@/constants/all-things-open';

import {
  getGiveawayWindowState,
  GIVEAWAY_NOW_COOKIE,
  GIVEAWAY_WINDOW_COPY,
  giveawayWindowError,
  resolveGiveawayNow,
} from '@/lib/giveaway-window';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import { submitGiveawayEntry } from '@/app/(website)/all-things-open/actions';

export const dynamic = 'force-dynamic';

async function currentWindowState() {
  const jar = await cookies();
  const now = resolveGiveawayNow(jar.get(GIVEAWAY_NOW_COOKIE)?.value);
  return getGiveawayWindowState(now);
}

export async function GET() {
  const { description, benefits } = allThingsOpenContentData;
  const state = await currentWindowState();
  const status = giveawayWindowError(state) ?? 'Entries are open.';

  const body = [
    '# All Things Open giveaway',
    '',
    description,
    '',
    GIVEAWAY_WINDOW_COPY,
    '',
    status,
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
      'Cache-Control': 'private, no-store',
    },
  });
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => ({}));
  const result = await submitGiveawayEntry(payload);
  const state = await currentWindowState();
  const status = state === 'open' ? (result.status === 'success' ? 200 : 400) : 403;

  return Response.json(result, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
