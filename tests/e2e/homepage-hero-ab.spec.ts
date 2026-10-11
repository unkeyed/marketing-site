import { expect, test } from '@playwright/test';

const HERO_HEADING = 'The Developer Platform for Modern APIs';
const CONTROL_SUBHEAD =
  'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.';
const VARIANT_B_SUBHEAD =
  'Unkey unifies your infrastructure. Deploy APIs instantly, protect them with keys and rate limits, and understand usage in one place.';
const GITHUB_HREF = 'https://github.com/unkeyed/unkey';
const FOUNDER_LABEL = 'Get a demo';
const FOUNDER_HREF = 'https://unkey.cal.com/james/sales';

function decodeHtml(value: string): string {
  return value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO_HEADING);
  await expect(page.getByText(CONTROL_SUBHEAD)).toBeVisible();
  await expect(page.getByText(VARIANT_B_SUBHEAD)).toHaveCount(0);
  const github = page.locator('main > section').getByRole('link', { name: 'View on GitHub' });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute('href', GITHUB_HREF);
  await expect(page.getByRole('link', { name: FOUNDER_LABEL })).toHaveCount(0);
  await expect(page.locator('main')).toHaveAttribute('data-hero-variant', 'a');
});

test('TC-E2E-014: homepage hero variant B changes only the subhead', async ({ page, baseURL }) => {
  await page
    .context()
    .addCookies([
      { name: 'homepage-hero-variant', value: 'b', url: baseURL ?? 'http://127.0.0.1:3100' },
    ]);

  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  expect(response?.headers()['x-homepage-hero']).toBe('b');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO_HEADING);
  await expect(page.getByText(VARIANT_B_SUBHEAD)).toBeVisible();
  await expect(page.getByText(CONTROL_SUBHEAD)).toHaveCount(0);
  const founder = page.locator('main > section').getByRole('link', { name: FOUNDER_LABEL });
  await expect(founder).toBeVisible();
  await expect(founder).toHaveAttribute('href', FOUNDER_HREF);
  await expect(founder).toHaveAttribute('target', '_blank');
  await expect(founder).toHaveAttribute('rel', 'noopener');
  await expect(
    page.locator('main > section').getByRole('link', { name: 'View on GitHub' }),
  ).toHaveCount(0);
  await expect(page.locator('main')).toHaveAttribute('data-hero-variant', 'b');

  await page.reload();
  await expect(page.getByText(VARIANT_B_SUBHEAD)).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('data-hero-variant', 'b');
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
    const body = decodeHtml(await response.text());

    expect(response.status(), userAgent).toBe(200);
    expect(response.headers()['x-homepage-hero'], userAgent).toBe('b');
    expect(body, userAgent).toContain('data-hero-variant="b"');
    expect(body, userAgent).toContain(VARIANT_B_SUBHEAD);
    expect(body, userAgent).toContain(FOUNDER_HREF);
    expect(body, userAgent).toContain(FOUNDER_LABEL);
    expect(body, userAgent).not.toContain(CONTROL_SUBHEAD);
  }
});

test('TC-E2E-016: crawler markdown uses the variant B heading and subhead', async ({ request }) => {
  const response = await request.get('/index.md', { headers: { 'User-Agent': 'GPTBot/1.2' } });
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(body.startsWith(`# ${HERO_HEADING}\n`)).toBeTruthy();
  expect(body).toContain(`> ${VARIANT_B_SUBHEAD}`);
  expect(body).not.toContain(CONTROL_SUBHEAD);
  expect(body).not.toContain('Unkey unifies API deployment');
});
