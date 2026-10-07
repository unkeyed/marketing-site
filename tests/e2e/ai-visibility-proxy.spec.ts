import { expect, test } from '@playwright/test';

const BOT_UA = 'OAI-SearchBot/1.4';
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function titleOf(html: string): string | null {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
}

test('TC-E2E-010: AI bot request to homepage is served unchanged', async ({ request }) => {
  const normal = await request.get('/', { headers: { 'User-Agent': BROWSER_UA } });
  const bot = await request.get('/', { headers: { 'User-Agent': BOT_UA } });

  expect(normal.status()).toBe(200);
  expect(bot.status()).toBe(200);

  const normalTitle = titleOf(await normal.text());
  expect(normalTitle).not.toBeNull();
  expect(titleOf(await bot.text())).toBe(normalTitle);
});

test('TC-E2E-011: AI bot request to docs gets the same status as a browser', async ({
  request,
}) => {
  // /docs is rewritten to Mintlify. The canonical URL is 200 for browsers and
  // AI bots, so a split here would mean this app treated them differently.
  // Moved paths such as /docs/introduction are not that check: Mintlify answers
  // HTML clients with a permanent 308 to the new URL, and answers agents it
  // negotiates to markdown (OAI-SearchBot, PerplexityBot) with a temporary 307
  // to the .md twin. 307 is the correct negotiation status — a 308 would cache
  // that markdown redirect as a permanent move.
  const userAgents = [BROWSER_UA, 'GPTBot/1.2', 'ClaudeBot/1.0', 'PerplexityBot/1.0', BOT_UA];

  const responses = await Promise.all(
    userAgents.map(async (userAgent) => {
      const response = await request.get('/docs', {
        headers: { 'User-Agent': userAgent },
        maxRedirects: 0,
      });
      return { userAgent, status: response.status() };
    }),
  );

  for (const { userAgent, status } of responses) {
    expect(status, userAgent).toBe(200);
  }
});

test('TC-E2E-012: AI-referred request to homepage returns 200', async ({ request }) => {
  const response = await request.get('/', {
    headers: { 'User-Agent': BROWSER_UA, Referer: 'https://chatgpt.com/' },
  });

  expect(response.status()).toBe(200);
});
