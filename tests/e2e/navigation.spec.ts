import { expect, test } from '@playwright/test';

const APP_URL = 'https://app.unkey.com/';
const SIGN_UP_URL = 'https://app.unkey.com/auth/sign-up';

test('TC-E2E-002: primary conversion links preserve their destinations', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  const startForFreeLinks = page.getByRole('main').getByRole('link', {
    name: 'Start for free',
    exact: true,
  });
  await expect(startForFreeLinks).toHaveCount(2);

  for (let index = 0; index < (await startForFreeLinks.count()); index += 1) {
    await expect(startForFreeLinks.nth(index)).toHaveAttribute('href', APP_URL);
  }

  const header = page.getByRole('banner');
  if (testInfo.project.name === 'mobile-chromium') {
    await header.getByRole('button', { name: 'Open menu' }).click();
  }

  await expect(header.getByRole('link', { name: 'Login', exact: true })).toHaveAttribute(
    'href',
    APP_URL,
  );
  await expect(header.getByRole('link', { name: 'Sign Up', exact: true })).toHaveAttribute(
    'href',
    SIGN_UP_URL,
  );
});

test('TC-E2E-003: responsive navigation exposes resource links', async ({ page }, testInfo) => {
  await page.goto('/');

  const header = page.getByRole('banner');
  const isMobile = testInfo.project.name === 'mobile-chromium';

  if (isMobile) {
    await header.getByRole('button', { name: 'Open menu' }).click();
    await expect(header.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  }

  await header.getByRole('button', { name: 'Resources', exact: true }).click();
  await expect(header.getByRole('link', { name: /Blog/ })).toBeVisible();
  await expect(header.getByRole('link', { name: /Case studies/ })).toBeVisible();

  if (isMobile) {
    await header.getByRole('button', { name: 'Close menu' }).click();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  }
});
