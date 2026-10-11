import { NextResponse, type NextRequest } from 'next/server';
import { homepageFlags } from '@/flags';
import { evaluate, serialize } from 'flags/next';

import { isCrawlerUserAgent } from '@/lib/crawler';
import { HOMEPAGE_HERO_VISITOR_COOKIE, HOMEPAGE_HERO_VISITOR_HEADER } from '@/lib/homepage-hero';

const VISITOR_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function requestForFlags(request: NextRequest): {
  flagsRequest: Request;
  newVisitorId: string | null;
} {
  if (isCrawlerUserAgent(request.headers.get('user-agent'))) {
    return { flagsRequest: request, newVisitorId: null };
  }

  const existing = request.cookies.get(HOMEPAGE_HERO_VISITOR_COOKIE)?.value;
  if (existing) {
    return { flagsRequest: request, newVisitorId: null };
  }

  const visitorId = crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set(HOMEPAGE_HERO_VISITOR_HEADER, visitorId);

  return {
    flagsRequest: new Request(request.url, { method: request.method, headers }),
    newVisitorId: visitorId,
  };
}

/**
 * Rewrites `/` to a statically generated variant page. The variant code is in
 * the rewritten path, so each variant is its own CDN object. `x-middleware-cache:
 * no-cache` keeps this proxy decision from being stored as the `/` response.
 */
export async function rewriteHomepage(request: NextRequest) {
  const { flagsRequest, newVisitorId } = requestForFlags(request);
  const values = await evaluate(homepageFlags, flagsRequest);
  const variant = values[0];
  const code = await serialize(homepageFlags, values);

  const url = request.nextUrl.clone();
  url.pathname = `/hero-variant/${code}`;

  const response = NextResponse.rewrite(url);
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('x-homepage-hero', variant);

  if (newVisitorId) {
    response.cookies.set(HOMEPAGE_HERO_VISITOR_COOKIE, newVisitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_MAX_AGE_SECONDS,
    });
  }

  return response;
}
