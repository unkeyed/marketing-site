import { expect, test, type Page } from '@playwright/test';

const destinations = [
  { label: 'Blog', path: '/blog' },
  { label: 'Case studies', path: '/case-studies' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Glossary', path: '/glossary' },
  { label: 'Pricing', path: '/pricing' },
];

async function navigateFromMobileHeader(page: Page, destination: (typeof destinations)[number]) {
  const header = page.getByRole('banner');
  await header.getByRole('button', { name: 'Open menu' }).click();
  if (destination.label !== 'Pricing') {
    await header.getByRole('button', { name: 'Resources', exact: true }).click();
  }
  await header.locator(`a[href="${destination.path}"]:visible`).click();
  await page.waitForURL(destination.path);
  await expect(header.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
}

for (const destination of destinations) {
  test(`mobile header ${destination.label} link preserves heading spacing below the sticky header`, async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'The desktop header uses its own navigation.');
    await page.goto('/about');
    await page.getByTestId('consent-banner-root').waitFor();
    await page.getByRole('button', { name: 'Reject All', exact: true }).click();

    await page.goto(destination.path);
    await page.evaluate(() => document.fonts.ready);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const expectedHeading = await heading.innerText();
    const expectedTop = (await heading.boundingBox())!.y;

    await page.goto('/about');
    await page.locator('#page-scroll').evaluate((element) => (element.scrollTop = 500));
    await navigateFromMobileHeader(page, destination);
    await expect(heading).toHaveText(expectedHeading);
    await page.evaluate(() => document.fonts.ready);

    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  });
}

test('mobile header links to the current page close the menu and return to the top', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The desktop header uses its own navigation.');
  await page.goto('/about');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();

  for (const destination of destinations.filter(
    ({ label }) => label === 'Blog' || label === 'Pricing',
  )) {
    await page.goto(destination.path);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const expectedTop = (await heading.boundingBox())!.y;

    await page.locator('#page-scroll').evaluate((element) => (element.scrollTop = 500));
    await navigateFromMobileHeader(page, destination);

    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  }
});
