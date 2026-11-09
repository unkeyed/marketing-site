import { expect, test } from '@playwright/test';

import { captureBrowserErrors } from './browser-errors';

test('TC-E2E-008: blog search opens a matching article', async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  await page.goto('/blog');

  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).fill('ratelimit');

  const result = page.getByRole('link', { name: /How to ratelimit public pages/ });
  await expect(result).toBeVisible();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).press('Enter');

  await page.waitForURL(/\/blog\/ratelimiting-public$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'How to ratelimit public pages' }),
  ).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test('TC-E2E-009: glossary search opens a matching term', async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  await page.goto('/glossary');

  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).fill('webhook');

  const result = page.getByRole('link', { name: /Webhook/ });
  await expect(result).toBeVisible();
  await result.click();

  await page.waitForURL(/\/glossary\/webhook$/);
  await expect(page.getByRole('heading', { level: 1, name: /Webhook/ })).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test('search keyboard navigation keeps the first and last results visible', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch search uses manual scrolling.');
  const browserErrors = captureBrowserErrors(page);
  await page.goto('/glossary');
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Search', exact: true });
  await expect(dialog).toHaveAccessibleDescription(
    'Search the available content and choose a result to open it.',
  );
  const input = dialog.getByRole('textbox');
  await input.fill('api');
  const results = dialog.getByRole('link');
  await expect(results.first()).toBeVisible();
  const resultCount = await results.count();
  expect(resultCount).toBeGreaterThan(5);

  for (let index = 1; index < resultCount; index += 1) {
    await input.press('ArrowDown');
  }
  await expect(results.last()).toBeInViewport({ ratio: 1 });

  for (let index = 1; index < resultCount; index += 1) {
    await input.press('ArrowUp');
  }
  await expect(results.first()).toBeInViewport({ ratio: 1 });
  const destination = await results.first().getAttribute('href');
  await input.press('Enter');
  await page.waitForURL((url) => url.pathname === destination);
  expect(browserErrors).toEqual([]);
});

test('search recovers from no results and restores focus when dismissed', async ({ page }) => {
  const browserErrors = captureBrowserErrors(page);
  await page.goto('/glossary');
  const trigger = page.getByRole('button', { name: 'Search', exact: true });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Search', exact: true });
  const input = dialog.getByRole('textbox');
  await input.fill('no-such-glossary-result');
  await expect(dialog.getByText('No results found.', { exact: true })).toBeVisible();
  await input.press('ArrowDown');
  await input.press('ArrowUp');
  await input.press('Enter');
  await expect(dialog).toBeVisible();

  await input.fill('webhook');
  await expect(dialog.getByRole('link')).toHaveCount(1);
  await expect(dialog.getByRole('link', { name: /Webhook/ })).toBeVisible();
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(browserErrors).toEqual([]);
});
