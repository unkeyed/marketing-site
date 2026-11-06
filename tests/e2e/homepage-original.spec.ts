import { expect, test } from '@playwright/test';

const HERO_HEADING = 'The Developer Platform for Modern APIs';
const CONTROL_SUBHEAD =
  'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.';
const VARIANT_B_SUBHEAD =
  'Unkey unifies your infrastructure. Deploy APIs instantly, protect them with keys and rate limits, and understand usage in one place.';
const FOUNDER_HREF = 'https://unkey.cal.com/james/sales';
const GITHUB_HREF = 'https://github.com/unkeyed/unkey';

const CRAWLER_USER_AGENTS = [
  'GPTBot/1.2',
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  'OAI-SearchBot/1.4',
  'ClaudeBot/1.0',
  'PerplexityBot/1.0',
  'Mozilla/5.0 (compatible; Google-Extended; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
];

function decodeHtml(value: string): string {
  return value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function assertOriginalHtml(body: string, label: string) {
  const html = decodeHtml(body);
  expect(html, label).toContain(HERO_HEADING);
  expect(html, label).toContain(CONTROL_SUBHEAD);
  expect(html, label).not.toContain(VARIANT_B_SUBHEAD);
  expect(html, label).not.toContain('Get a demo');
  expect(html, label).not.toContain(FOUNDER_HREF);
  expect(html, label).not.toContain('data-hero-variant');
  expect(html, label).not.toContain('View on GitHub');
  expect(html, label).not.toContain(GITHUB_HREF);
  expect(html, label).not.toContain('5.3k');
}

async function assertNoExperimentAssignment(
  response: {
    headers(): Record<string, string>;
    headersArray(): { name: string; value: string }[] | Promise<{ name: string; value: string }[]>;
  },
  label: string,
) {
  expect(response.headers()['x-homepage-hero'], label).toBeUndefined();
  const setCookies = (await response.headersArray())
    .filter((header) => header.name.toLowerCase() === 'set-cookie')
    .map((header) => header.value)
    .join('\n');
  expect(setCookies, label).not.toContain('homepage-hero');
  expect(setCookies, label).not.toContain('vercel-flag-overrides');
}

test('TC-E2E-013: homepage serves the original hero without GitHub promotion', async ({
  page,
}, testInfo) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  if (response) await assertNoExperimentAssignment(response, 'fresh');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO_HEADING);
  await expect(page.getByText(CONTROL_SUBHEAD)).toBeVisible();
  await expect(page.getByText(VARIANT_B_SUBHEAD)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View on GitHub' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Get a demo' })).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Start for free', exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator('main')).not.toHaveAttribute('data-hero-variant', /.+/);
  await expect(page.locator(`a[href="${GITHUB_HREF}"]`)).toHaveCount(0);
  await expect(page.getByText('5.3k')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /stars/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Source Code', exact: true })).toHaveCount(0);

  const header = page.getByRole('banner');
  if (testInfo.project.name === 'mobile-chromium') {
    await page.getByTestId('consent-banner-root').waitFor();
    await header.getByRole('button', { name: 'Open menu' }).click();
  }
  await expect(header.getByRole('link', { name: 'Discord', exact: true })).toBeVisible();
  await expect(header.getByRole('link', { name: /GitHub/ })).toHaveCount(0);

  await page.goto('/changelog');
  const changelogHero = page.locator('section.hero');
  await expect(changelogHero.getByRole('link', { name: 'Twitter', exact: true })).toBeVisible();
  await expect(changelogHero.getByRole('link', { name: 'GitHub', exact: true })).toHaveCount(0);
  await expect(changelogHero.locator(`a[href="${GITHUB_HREF}"]`)).toHaveCount(0);
});

test('TC-E2E-014: stale experiment cookies and query overrides still serve the original', async ({
  page,
  baseURL,
}) => {
  const origin = baseURL ?? 'http://127.0.0.1:3100';
  const cases = [
    { label: 'preview cookie b', path: '/', cookie: 'homepage-hero-variant=b' },
    { label: 'preview cookie a', path: '/', cookie: 'homepage-hero-variant=a' },
    {
      label: 'visitor cookie',
      path: '/',
      cookie: 'homepage-hero-visitor=visitor-that-used-to-bucket-b',
    },
    {
      label: 'flags override cookie',
      path: '/',
      cookie:
        'vercel-flag-overrides=' + encodeURIComponent(JSON.stringify({ 'homepage-hero': 'b' })),
    },
    {
      label: 'combined cookies',
      path: '/',
      cookie:
        'homepage-hero-variant=b; homepage-hero-visitor=abc; vercel-flag-overrides=%7B%22homepage-hero%22%3A%22b%22%7D',
    },
    {
      label: 'flags query',
      path:
        '/?vercel-flag-overrides=' + encodeURIComponent(JSON.stringify({ 'homepage-hero': 'b' })),
    },
    {
      label: 'base64 flags query',
      path:
        '/?vercel-flag-overrides=' +
        Buffer.from(JSON.stringify({ 'homepage-hero': 'b' })).toString('base64url'),
    },
    { label: 'homepage-hero query', path: '/?homepage-hero=b' },
    { label: 'variant query', path: '/?variant=b' },
  ];

  for (const item of cases) {
    await page.context().clearCookies();
    if (item.cookie) {
      const cookies = item.cookie.split('; ').map((pair) => {
        const separator = pair.indexOf('=');
        return {
          name: decodeURIComponent(pair.slice(0, separator)),
          value: decodeURIComponent(pair.slice(separator + 1)),
          url: origin,
        };
      });
      await page.context().addCookies(cookies);
    }

    const response = await page.goto(item.path);
    expect(response?.ok(), item.label).toBeTruthy();
    if (response) await assertNoExperimentAssignment(response, item.label);
    const body = await response?.text();
    assertOriginalHtml(body ?? '', item.label);
    await expect(page.getByText(CONTROL_SUBHEAD), item.label).toBeVisible();
    await expect(page.getByText(VARIANT_B_SUBHEAD), item.label).toHaveCount(0);
  }
});

test('TC-E2E-015: crawlers receive the original homepage, not the experiment', async ({
  request,
}) => {
  for (const userAgent of CRAWLER_USER_AGENTS) {
    const response = await request.get('/', {
      headers: {
        'User-Agent': userAgent,
        Cookie: 'homepage-hero-variant=b; homepage-hero-visitor=bot-visitor',
      },
    });
    expect(response.status(), userAgent).toBe(200);
    await assertNoExperimentAssignment(response, userAgent);
    assertOriginalHtml(await response.text(), userAgent);
  }
});

test('TC-E2E-016: homepage markdown stays original and retired experiment URLs redirect to it', async ({
  request,
}) => {
  for (const userAgent of ['Mozilla/5.0', 'GPTBot/1.2']) {
    const response = await request.get('/index.md', {
      headers: { 'User-Agent': userAgent, Cookie: 'homepage-hero-variant=b' },
    });
    const body = await response.text();

    expect(response.status(), userAgent).toBe(200);
    expect(body.startsWith(`# ${HERO_HEADING}\n`), userAgent).toBeTruthy();
    expect(body, userAgent).toContain(`> ${CONTROL_SUBHEAD}`);
    expect(body, userAgent).not.toContain(VARIANT_B_SUBHEAD);
    expect(body, userAgent).not.toContain('View on GitHub');
    expect(body, userAgent).not.toContain(GITHUB_HREF);
    expect(body, userAgent).not.toContain(FOUNDER_HREF);
  }

  const negotiated = await request.get('/', {
    headers: { Accept: 'text/markdown', 'User-Agent': 'GPTBot/1.2' },
    maxRedirects: 0,
  });
  expect(negotiated.status()).toBe(307);
  expect(new URL(negotiated.headers().location ?? '', 'http://127.0.0.1:3100').pathname).toBe(
    '/index.md',
  );

  const indexB = await request.get('/index-b.md', { maxRedirects: 0 });
  expect(indexB.status()).toBe(308);
  expect(new URL(indexB.headers().location ?? '', 'http://127.0.0.1:3100').pathname).toBe(
    '/index.md',
  );

  const followed = await request.get('/index-b.md', { headers: { 'User-Agent': 'GPTBot/1.2' } });
  const followedBody = await followed.text();
  expect(followed.status()).toBe(200);
  expect(followedBody).toContain(`> ${CONTROL_SUBHEAD}`);
  expect(followedBody).not.toContain(VARIANT_B_SUBHEAD);

  const variantPage = await request.get('/hero-variant/b', { maxRedirects: 0 });
  expect(variantPage.status()).toBe(308);
  expect(new URL(variantPage.headers().location ?? '', 'http://127.0.0.1:3100').pathname).toBe('/');

  const variantApi = await request.get('/api/home-variant-b', { maxRedirects: 0 });
  expect(variantApi.status()).toBe(308);
  expect(new URL(variantApi.headers().location ?? '', 'http://127.0.0.1:3100').pathname).toBe(
    '/api/home',
  );
});
