import { expect, test } from '@playwright/test';

test('long code filenames fit a narrow article while code remains horizontally scrollable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/blog/high-frequency-usage-billing');
  await page.evaluate(() => document.fonts.ready);

  const filename = page
    .locator('.code-block > div:first-child')
    .filter({ hasText: 'aggregate_active_keys_monthly_by_workspace_id.pipe' });
  await expect(filename).toHaveCount(1);
  await filename.scrollIntoViewIfNeeded();

  const textFits = await filename.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const textBounds = range.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return textBounds.left >= box.left && textBounds.right <= box.right;
  });
  expect(textFits).toBe(true);

  const codeViewport = page.locator('.code-block [data-slot="scroll-area-viewport"]').last();
  expect(
    await codeViewport.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
      return element.scrollWidth > element.clientWidth && element.scrollLeft > 0;
    }),
  ).toBe(true);
  expect(
    await page.locator('#page-scroll').evaluate((element) => {
      element.scrollLeft = 100;
      return element.scrollWidth <= element.clientWidth && element.scrollLeft === 0;
    }),
  ).toBe(true);
});

test('Glossary separator does not widen a desktop scrollport narrower than its viewport', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'This regression models the space used by a classic desktop scrollbar.');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/glossary');
  await page.evaluate(() => document.fonts.ready);

  // Overlay-scrollbar hosts need the same scrollport/viewport width difference as Windows.
  const scrollport = page.locator('#page-scroll');
  await scrollport.evaluate((element) => {
    element.style.width = 'calc(100% - 15px)';
  });

  for (const scrollTop of [0, 800]) {
    await scrollport.evaluate((element, top) => (element.scrollTop = top), scrollTop);
    await expect
      .poll(() => scrollport.evaluate((element) => element.scrollWidth <= element.clientWidth))
      .toBe(true);
  }
});
