import { expect, test } from '@playwright/test';

const footerDestinations = [
  { label: 'About', path: '/about' },
  { label: 'Careers', path: '/careers' },
  { label: 'Blog', path: '/blog' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Glossary', path: '/glossary' },
  { label: 'Terms of Service', path: '/policies/terms' },
  { label: 'Privacy Policy', path: '/policies/privacy' },
];

for (const destination of footerDestinations) {
  test(`footer ${destination.label} link preserves heading spacing below the sticky header`, async ({
    page,
  }) => {
    await page.goto(destination.path);
    await page.getByTestId('consent-banner-root').waitFor();
    await page.getByRole('button', { name: 'Reject All', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const expectedHeading = await heading.innerText();
    const expectedTop = (await heading.boundingBox())!.y;

    await page.goto('/');
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: destination.label, exact: true })
      .click();
    await page.waitForURL(destination.path);
    await expect(heading).toHaveText(expectedHeading);
    await page.evaluate(() => document.fonts.ready);
    await expect(heading).toBeVisible();
    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  });
}

test('a footer link to the current page returns to the top', async ({ page }) => {
  await page.goto('/about');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  const expectedTop = (await heading.boundingBox())!.y;

  await page.getByRole('contentinfo').getByRole('link', { name: 'About', exact: true }).click();

  await expect(page).toHaveURL('/about');
  await expect
    .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
    .toBeLessThan(1);
});
