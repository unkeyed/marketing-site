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
  // /docs is rewritten to Mintlify; only compare status, not body.
  const normal = await request.get('/docs/introduction', {
    headers: { 'User-Agent': BROWSER_UA },
    maxRedirects: 0,
  });
  const bot = await request.get('/docs/introduction', {
    headers: { 'User-Agent': BOT_UA },
    maxRedirects: 0,
  });

  expect(bot.status()).toBe(normal.status());
});

test('TC-E2E-012: AI-referred request to homepage returns 200', async ({ request }) => {
  const response = await request.get('/', {
    headers: { 'User-Agent': BROWSER_UA, Referer: 'https://chatgpt.com/' },
  });

  expect(response.status()).toBe(200);
});
