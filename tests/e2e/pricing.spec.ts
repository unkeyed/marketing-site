import { expect, test } from '@playwright/test';

test('TC-E2E-004: usage calculator updates the monthly estimate', async ({ page }) => {
  await page.goto('/pricing');

  const calculator = page.getByRole('form', { name: 'Usage cost calculator' });
  const estimate = page.getByRole('region', { name: 'Estimate' });

  await expect(estimate.locator('number-flow-react[title="$188.00"]')).toHaveCount(2);

  await calculator.getByRole('spinbutton', { name: 'Avg active CPU / instance' }).fill('1');

  await expect(estimate.locator('number-flow-react[title="$224.00"]')).toHaveCount(2);
});

test('TC-E2E-005: API management request tier updates its included usage', async ({ page }) => {
  await page.goto('/pricing');

  await page.getByRole('tab', { name: 'Api management' }).click();

  const requestVolume = page
    .getByRole('tabpanel', { name: 'Api management' })
    .getByRole('combobox');
  await expect(requestVolume).toHaveCount(1);
  await requestVolume.click();
  await page.getByRole('option', { name: '50M Requests' }).click();

  await expect(requestVolume).toContainText('50M Requests');
  await expect(page.getByText('50M valid requests / mo', { exact: true })).toBeVisible();
});
