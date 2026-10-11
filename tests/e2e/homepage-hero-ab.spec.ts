import { expect, test } from '@playwright/test';

const CONTROL_HEADING = 'The Developer Platform for Modern APIs';
const CONTROL_SUBHEAD =
  'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.';

const VARIANT_B = {
  heading: "Deploy your API, protect it, and see who's using it",
  subhead:
    'Unkey is infrastructure for APIs. Push your code from GitHub, decide who can call it, and see every request.',
  paragraph:
    "Hosting, API keys, rate limiting, and analytics live in one platform. Keys and rate limits are checked at the edge, and you don't run a gateway or a monitoring stack yourself.",
} as const;

function decodeHtml(value: string): string {
  return value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function headingText(html: string): string | null {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return null;
  return decodeHtml(
    match[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

test('TC-E2E-013: homepage hero variant A keeps the current copy', async ({ page, baseURL }) => {
  await page
    .context()
    .addCookies([
      { name: 'homepage-hero-variant', value: 'a', url: baseURL ?? 'http://127.0.0.1:3100' },
    ]);

  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  expect(response?.headers()['x-homepage-hero']).toBe('a');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CONTROL_HEADING);
  await expect(page.getByText(CONTROL_SUBHEAD)).toBeVisible();
  await expect(page.getByText(VARIANT_B.heading)).toHaveCount(0);
  await expect(page.getByText(VARIANT_B.paragraph)).toHaveCount(0);
  await expect(page.locator('main')).toHaveAttribute('data-hero-variant', 'a');
});

test('TC-E2E-014: homepage hero variant B shows the new copy', async ({ page, baseURL }) => {
  await page
    .context()
    .addCookies([
      { name: 'homepage-hero-variant', value: 'b', url: baseURL ?? 'http://127.0.0.1:3100' },
    ]);

  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  expect(response?.headers()['x-homepage-hero']).toBe('b');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(VARIANT_B.heading);
  await expect(page.getByText(VARIANT_B.subhead)).toBeVisible();
  await expect(page.getByText(VARIANT_B.paragraph)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: CONTROL_HEADING })).toHaveCount(0);
  await expect(page.locator('main')).toHaveAttribute('data-hero-variant', 'b');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(VARIANT_B.heading);
});

test('TC-E2E-015: crawler user agents get variant B in the HTML', async ({ request }) => {
  const userAgents = [
    'GPTBot/1.2',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
    'OAI-SearchBot/1.4',
    'ClaudeBot/1.0',
    'PerplexityBot/1.0',
    'Mozilla/5.0 (compatible; Google-Extended; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  ];

  for (const userAgent of userAgents) {
    const response = await request.get('/', { headers: { 'User-Agent': userAgent } });
    const html = await response.text();

    expect(response.status(), userAgent).toBe(200);
    expect(response.headers()['x-homepage-hero'], userAgent).toBe('b');
    const body = decodeHtml(html);
    expect(headingText(html), userAgent).toBe(VARIANT_B.heading);
    expect(body, userAgent).toContain(VARIANT_B.subhead);
    expect(body, userAgent).toContain(VARIANT_B.paragraph);
    expect(html, userAgent).toContain('data-hero-variant="b"');
  }
});
