import { expect, test } from '@playwright/test';

test('touch tooltips toggle from the state before pointer focus changes it', async ({
  page,
  isMobile,
}) => {
  test.skip(
    !isMobile,
    'This regression models coarse-pointer event ordering on real mobile devices.',
  );
  await page.goto('/pricing');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();
  const trigger = page
    .getByRole('form', { name: 'Usage cost calculator' })
    .locator('[data-slot="tooltip-trigger"]')
    .first();
  const tooltip = page.getByRole('tooltip');
  await trigger.scrollIntoViewIfNeeded();

  // Actual Android traces focus the button after pointerup, before the synthesized click.
  await trigger.dispatchEvent('pointerdown', { pointerType: 'touch', button: 0, buttons: 1 });
  await trigger.dispatchEvent('pointerup', { pointerType: 'touch', button: 0, buttons: 0 });
  await trigger.focus();
  await trigger.dispatchEvent('click');
  await expect(tooltip).toBeVisible();

  await trigger.dispatchEvent('pointerdown', { pointerType: 'touch', button: 0, buttons: 1 });
  await trigger.dispatchEvent('pointerup', { pointerType: 'touch', button: 0, buttons: 0 });
  await trigger.dispatchEvent('click');
  await expect(tooltip).not.toBeVisible();
});

test('pricing tooltips keep stable state across pointer detection and user interaction', async ({
  page,
  isMobile,
}) => {
  const stateWarnings: string[] = [];
  page.on('console', (message) => {
    if (
      /Tooltip is changing from (uncontrolled to controlled|controlled to uncontrolled)/.test(
        message.text(),
      )
    ) {
      stateWarnings.push(message.text());
    }
  });
  await page.goto('/pricing');
  await page.getByTestId('consent-banner-root').waitFor();
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();

  const calculator = page.getByRole('form', { name: 'Usage cost calculator' });
  const trigger = calculator.locator('[data-slot="tooltip-trigger"]').first();
  const tooltip = page.getByRole('tooltip');
  await trigger.scrollIntoViewIfNeeded();

  if (isMobile) {
    await trigger.tap();
    await expect(tooltip).toBeVisible();
    await trigger.tap();
    await expect(tooltip).not.toBeVisible();
    await trigger.tap();
    await expect(tooltip).toBeVisible();
    await page.getByRole('heading', { name: 'Calculator', exact: true }).tap();
    await expect(tooltip).not.toBeVisible();
  } else {
    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible();
    await trigger.focus();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible();
  }

  expect(stateWarnings).toEqual([]);
});
