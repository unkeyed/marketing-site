import { expect, type Page } from '@playwright/test';

/**
 * The offline opt-in banner covers controls along the bottom of the viewport
 * until the visitor records a choice.
 */
export async function rejectConsentBanner(page: Page) {
  const reject = page.getByRole('button', { name: 'Reject All' });
  await reject.waitFor();
  await reject.click();
  await expect(page.getByTestId('consent-banner-root')).toBeHidden();
}
