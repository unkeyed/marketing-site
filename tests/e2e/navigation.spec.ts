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
  // The bar mounts after hydration. Opening the menu before that lets the mount
  // close a hover menu that Playwright will not reopen.
  await page.getByTestId('consent-banner-root').waitFor();

  const header = page.getByRole('banner');
  const isMobile = testInfo.project.name === 'mobile-chromium';

  if (isMobile) {
    await header.getByRole('button', { name: 'Open menu' }).click();
    await expect(header.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  }

  const resources = header.getByRole('button', { name: 'Resources', exact: true });
  if (isMobile) {
    await resources.click();
  } else {
    // Hover opens this menu. Playwright's click hovers first, and if that hover
    // already opened the menu the click toggles it closed.
    await resources.hover();
  }
  await expect(header.getByRole('link', { name: /Blog/ })).toBeVisible();
  await expect(header.getByRole('link', { name: /Case studies/ })).toBeVisible();

  if (isMobile) {
    await header.getByRole('button', { name: 'Close menu' }).click();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  }
});

test('desktop keyboard navigation dismisses Resources and restores focus', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.goto('/');
  await page.getByTestId('consent-banner-root').waitFor();

  const header = page.getByRole('banner');
  const resources = header.getByRole('button', { name: 'Resources', exact: true });
  const blog = header.getByRole('link', { name: /Blog/ });

  await resources.focus();
  await page.keyboard.press('Enter');
  await expect(resources).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(blog).toBeFocused();
  await page.keyboard.press('Escape');

  await expect(resources).toHaveAttribute('aria-expanded', 'false');
  await expect(blog).not.toBeVisible();
  await expect(resources).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(header.getByRole('link', { name: 'Pricing', exact: true })).toBeFocused();
});

test('mobile keyboard navigation skips collapsed Resources links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/');
  await page.getByTestId('consent-banner-root').waitFor();

  const header = page.getByRole('banner');
  await header.getByRole('button', { name: 'Open menu' }).click();
  const resources = header.getByRole('button', { name: 'Resources', exact: true });
  const pricing = header.getByRole('link', { name: 'Pricing', exact: true });

  await resources.focus();
  await page.keyboard.press('Tab');
  await expect(pricing).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(resources).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(resources).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(header.getByRole('link', { name: /Blog/ })).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(resources).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Tab');
  await expect(pricing).toBeFocused();
});
