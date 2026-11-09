import { expect, test } from '@playwright/test';

import { captureBrowserErrors } from './browser-errors';

test('UUID article hydrates with a valid, contained introductory code block', async ({
  page,
  isMobile,
}) => {
  const browserErrors = captureBrowserErrors(page);
  await page.addInitScript(() => {
    const copies: string[] = [];
    Object.defineProperty(window, '__uuidCopies', { value: copies });
    document.execCommand = (command) => {
      if (command !== 'copy') return false;
      copies.push(window.getSelection()?.toString() ?? '');
      return true;
    };
  });
  await page.setViewportSize({ width: isMobile ? 320 : 1440, height: 900 });
  await page.goto('/blog/uuid-ux');

  await expect(page.getByRole('heading', { level: 1, name: 'The UX of UUIDs' })).toBeVisible();
  const firstCodeBlock = page.locator('.code-block').first();
  await expect(firstCodeBlock.locator('pre code')).toHaveText(
    'https://company.com/resource/c6b10dd3-1dcf-416c-8ed8-ae561807fcaf',
  );
  await page.getByTestId('consent-banner-root').waitFor();
  await page.evaluate(() => document.fonts.ready);

  for (const caption of [
    '/internal/ids/src/index.ts',
    'somewhere.ts',
    'setting the key length and a prefix using @unkey/api',
  ]) {
    await expect(page.locator('.code-block').getByText(caption, { exact: true })).toBeVisible();
  }

  const multilineBlock = page.locator('.code-block').nth(1);
  const multilineCode = await multilineBlock.locator('pre').innerText();
  await firstCodeBlock.getByRole('button', { name: 'Copy', exact: true }).click();
  await multilineBlock.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, '__uuidCopies')))
    .toEqual(['https://company.com/resource/c6b10dd3-1dcf-416c-8ed8-ae561807fcaf', multilineCode]);

  expect(await firstCodeBlock.evaluate((element) => element.closest('p') !== null)).toBe(false);
  expect(browserErrors).toEqual([]);
});
