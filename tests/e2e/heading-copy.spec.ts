import { expect, test } from '@playwright/test';

import { captureBrowserErrors } from './browser-errors';

test('section copy controls support keyboard access without hijacking heading links', async ({
  page,
  isMobile,
}) => {
  const browserErrors = captureBrowserErrors(page);
  const invalidKeyframes: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('Invalid keyframe value')) invalidKeyframes.push(message.text());
  });
  await page.addInitScript(() => {
    const copies: string[] = [];
    Object.defineProperty(window, '__headingCopies', { value: copies });
    document.execCommand = (command) => {
      if (command !== 'copy') return false;
      copies.push(window.getSelection()?.toString() ?? '');
      return true;
    };
  });
  await page.setViewportSize({ width: isMobile ? 320 : 1440, height: 900 });
  await page.goto('/blog/uuid-ux');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();
  await page.mouse.move(0, 0);

  const heading = page.locator('.content h2[id]').first();
  const button = heading.getByRole('button', { name: 'Copy link to section' });
  await expect(button).toHaveAttribute('type', 'button');
  await expect
    .poll(() => button.evaluate((element) => getComputedStyle(element).opacity))
    .toBe('0');

  for (let index = 0; index < 60; index += 1) {
    await page.keyboard.press('Tab');
    if (await button.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(button).toBeFocused();
  await expect
    .poll(() => button.evaluate((element) => getComputedStyle(element).opacity))
    .toBe('1');

  const destination = `${page.url()}#${await heading.getAttribute('id')}`;
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, '__headingCopies')))
    .toEqual([destination, destination]);

  // Exercise link-containing MDX headings without adding a public fixture route.
  await heading.evaluate((element) => {
    const link = document.createElement('a');
    link.href = '#copying-uuids-is-annoying';
    link.textContent = 'Related section';
    element.prepend(link);
  });
  await heading.getByRole('link', { name: 'Related section' }).click();
  await page.waitForURL((url) => url.hash === '#copying-uuids-is-annoying');
  expect(await page.evaluate(() => Reflect.get(window, '__headingCopies'))).toEqual([
    destination,
    destination,
  ]);

  await expect
    .poll(() => button.evaluate((element) => getComputedStyle(element).opacity))
    .toBe('0');
  expect(invalidKeyframes).toEqual([]);
  expect(browserErrors).toEqual([]);
});
