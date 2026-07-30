import { expect, test } from '@playwright/test';

import { captureBrowserErrors } from './browser-errors';

const criticalRoutes = [
  {
    name: 'homepage',
    path: '/',
    heading: 'The Developer Platform for Modern APIs',
  },
  {
    name: 'pricing',
    path: '/pricing',
    heading: 'Start for free, scale as you go with predictable usage-based pricing.',
  },
  {
    name: 'startups application',
    path: '/startups',
    heading: '$1,000 in credits every month for your startup',
  },
  {
    name: 'YC application',
    path: '/yc',
    heading: '$1,000 in credits every month for current YC batch',
  },
  {
    name: 'blog',
    path: '/blog',
    heading: 'How to ship, protect, and scale modern APIs',
  },
  {
    name: 'glossary',
    path: '/glossary',
    heading: 'API glossary',
  },
] as const;

for (const route of criticalRoutes) {
  test(`TC-E2E-001: ${route.name} renders without application errors`, async ({ page }) => {
    const browserErrors = captureBrowserErrors(page);

    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    expect(response?.ok(), `${route.path} did not load successfully`).toBeTruthy();
    await expect(page).not.toHaveTitle('');
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await expect(page.locator('[data-nextjs-dialog-overlay]')).toHaveCount(0);
    expect(browserErrors).toEqual([]);
  });
}
