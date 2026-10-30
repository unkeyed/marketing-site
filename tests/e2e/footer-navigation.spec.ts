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

test('footer navigation preserves the page heading spacing below the sticky header', async ({
  page,
}) => {
  for (const destination of footerDestinations) {
    await page.goto(destination.path);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const expectedTop = (await heading.boundingBox())!.y;

    await page.goto('/');
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: destination.label, exact: true })
      .click();
    await expect(page).toHaveURL(destination.path);
    await expect(heading).toBeVisible();
    await expect
      .poll(async () => Math.abs((await heading.boundingBox())!.y - expectedTop))
      .toBeLessThan(1);
  }
});

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
