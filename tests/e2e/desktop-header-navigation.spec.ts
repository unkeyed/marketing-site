import { expect, test, type Page } from '@playwright/test';

const destinations = [
  { label: 'Blog', path: '/blog' },
  { label: 'Case studies', path: '/case-studies' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Glossary', path: '/glossary' },
  { label: 'Pricing', path: '/pricing' },
];

async function navigateFromDesktopHeader(page: Page, destination: (typeof destinations)[number]) {
  const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true });
  if (destination.label !== 'Pricing') {
    await nav.getByRole('button', { name: 'Resources', exact: true }).hover();
  }
  await nav.getByRole('link', { name: new RegExp(`^${destination.label}`) }).click();
  await expect(page).toHaveURL(destination.path);
}

test('desktop header navigation preserves heading spacing below the sticky header', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The mobile header has separate navigation coverage.');
  await page.goto('/about');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();

  for (const destination of destinations) {
    await page.goto(destination.path);
    await page.evaluate(() => document.fonts.ready);
    const heading = page.getByRole('heading', { level: 1 });
    const expectedTop = (await heading.boundingBox())!.y;

    await page.goto('/about');
    await page.locator('#page-scroll').evaluate((element) => (element.scrollTop = 500));
    await navigateFromDesktopHeader(page, destination);

    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  }
});

test('desktop header links to the current page return to the top', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The mobile header has separate navigation coverage.');
  await page.goto('/about');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();

  for (const destination of destinations.filter(
    ({ label }) => label === 'Blog' || label === 'Pricing',
  )) {
    await page.goto(destination.path);
    const heading = page.getByRole('heading', { level: 1 });
    const expectedTop = (await heading.boundingBox())!.y;

    await page.locator('#page-scroll').evaluate((element) => (element.scrollTop = 500));
    await navigateFromDesktopHeader(page, destination);

    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  }
});
