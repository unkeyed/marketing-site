import { expect, test } from '@playwright/test';

test('TC-E2E-008: blog search opens a matching article', async ({ page }) => {
  await page.goto('/blog');

  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).fill('ratelimit');

  const result = page.getByRole('link', { name: /How to ratelimit public pages/ });
  await expect(result).toBeVisible();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).press('Enter');

  await expect(page).toHaveURL(/\/blog\/ratelimiting-public$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'How to ratelimit public pages' }),
  ).toBeVisible();
});

test('TC-E2E-009: glossary search opens a matching term', async ({ page }) => {
  await page.goto('/glossary');

  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'What are you searching for?' }).fill('webhook');

  const result = page.getByRole('link', { name: /Webhook/ });
  await expect(result).toBeVisible();
  await result.click();

  await expect(page).toHaveURL(/\/glossary\/webhook$/);
  await expect(page.getByRole('heading', { level: 1, name: /Webhook/ })).toBeVisible();
});
