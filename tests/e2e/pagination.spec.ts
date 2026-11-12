import { expect, test } from '@playwright/test';

const paginatedRoutes = ['/blog', '/changelog'];

for (const route of paginatedRoutes) {
  test(`${route} rejects malformed and noncanonical page numbers`, async ({ request }) => {
    for (const pageNumber of ['2junk', '2.5', '02', '2e0', '0', '1', '-2', '999999']) {
      const response = await request.get(`${route}/page/${pageNumber}`);
      expect(response.status(), `${route}/page/${pageNumber}`).toBe(404);
    }
    const validPage = await request.get(`${route}/page/2`);
    expect(validPage.status()).toBe(200);
    const canonical = (await validPage.text()).match(/rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical).toBeDefined();
    expect(new URL(canonical!).pathname).toBe(`${route}/page/2`);
  });
}

for (const route of ['/blog']) {
  test(`${route} has a labeled pagination list with working keyboard links`, async ({ page }) => {
    await page.goto(route);
    const pagination = page.getByRole('navigation', { name: 'Pagination', exact: true });
    await expect(pagination).toHaveCount(1);
    await expect(pagination.getByRole('list')).toHaveCount(1);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
    await expect(pagination.getByRole('link', { name: 'Previous page', exact: true })).toHaveCount(
      0,
    );

    const lastPagePath = await pagination
      .getByRole('link', { name: /^Page \d+$/ })
      .last()
      .getAttribute('href');
    const nextPage = pagination.getByRole('link', { name: 'Next page', exact: true });
    await expect(nextPage).toHaveAttribute('href', `${route}/page/2`);
    await nextPage.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${route}/page/2$`));
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
    await expect(
      pagination.getByRole('link', { name: 'Previous page', exact: true }),
    ).toHaveAttribute('href', route);

    if (lastPagePath !== `${route}/page/2`) {
      const pageNumber = lastPagePath?.split('/').pop();
      const lastPage = pagination.getByRole('link', { name: `Page ${pageNumber}`, exact: true });
      await lastPage.focus();
      await page.keyboard.press('Enter');
    }
    await expect(page).toHaveURL(new RegExp(`${lastPagePath}$`));
    await expect(pagination.getByRole('link', { name: 'Next page', exact: true })).toHaveCount(0);
    await expect(pagination.getByRole('listitem').first()).toBeVisible();
  });
}

// Category pagination must apply the same URL validation as the main blog feed.
test('category pagination rejects invalid and out-of-range pages', async ({ request }) => {
  for (const pageNumber of ['2junk', '2.5', '02', '2e0', '0', '1', '-2', '999999']) {
    const response = await request.get(`/blog/category/engineering/page/${pageNumber}`);
    expect(response.status()).toBe(404);
  }
  expect((await request.get('/blog/category/engineering')).status()).toBe(200);
});
