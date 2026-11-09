import { expect, test } from '@playwright/test';

test('control-plane animations load when their cards approach the viewport', async ({ page }) => {
  const animationRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/rive/home/control-plane/control-plane.riv') {
      animationRequests.push(request.url());
    }
  });

  await page.goto('/');
  // Wait for hydration without scrolling toward the below-fold cards.
  const menu = page.getByRole('button', { name: 'Open menu' });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.getByRole('button', { name: 'Resources', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();
  } else {
    const resources = page.getByRole('button', { name: 'Resources', exact: true });
    await resources.focus();
    await resources.press('Enter');
    await expect(resources).toHaveAttribute('aria-expanded', 'true');
    await resources.press('Escape');
  }

  const card = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Branch Overview', exact: true }) });
  await expect(card.locator('canvas')).toHaveCount(0);
  expect(animationRequests).toEqual([]);

  const loaded = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/rive/home/control-plane/control-plane.riv' &&
      response.ok(),
  );
  await card.scrollIntoViewIfNeeded();
  await loaded;
  await expect(card.locator('canvas')).toBeVisible();
});
