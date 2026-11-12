import { expect, test, type Page, type Route } from '@playwright/test';

import type { PlainSubmissionResult } from '../../src/lib/plain';

const applications = [
  { name: 'startups', path: '/startups' },
  { name: 'YC', path: '/yc' },
] as const;

async function fillApplication(page: Page, path: string) {
  await page.getByRole('textbox', { name: 'Full Name', exact: false }).fill('Example Applicant');
  await page.getByRole('textbox', { name: 'Email', exact: false }).fill('applicant@example.com');
  if (path === '/yc') {
    await page.getByRole('textbox', { name: 'YC Batch', exact: false }).fill('W26');
  } else {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Techstars', exact: true }).click();
  }
  await page.getByRole('textbox', { name: 'Workspace ID', exact: true }).fill('ws_example');
  await page.getByRole('textbox', { name: 'Migrating From', exact: true }).fill('Our old platform');
  await page
    .getByRole('textbox', { name: 'More Info', exact: true })
    .fill('Please keep this note.');
}

async function expectApplicationValues(page: Page, path: string) {
  await expect(page.getByRole('textbox', { name: 'Full Name', exact: false })).toHaveValue(
    'Example Applicant',
  );
  await expect(page.getByRole('textbox', { name: 'Email', exact: false })).toHaveValue(
    'applicant@example.com',
  );
  await expect(page.getByRole('textbox', { name: 'Workspace ID', exact: true })).toHaveValue(
    'ws_example',
  );
  await expect(page.getByRole('textbox', { name: 'Migrating From', exact: true })).toHaveValue(
    'Our old platform',
  );
  await expect(page.getByRole('textbox', { name: 'More Info', exact: true })).toHaveValue(
    'Please keep this note.',
  );
  if (path === '/yc') {
    await expect(page.getByRole('textbox', { name: 'YC Batch', exact: false })).toHaveValue('W26');
  } else {
    await expect(page.getByRole('combobox')).toHaveText('Techstars');
  }
}

async function returnActionResult(route: Route, result: PlainSubmissionResult) {
  // Respond with an action-only Flight payload, so tests never reach the real submission service.
  await route.fulfill({
    contentType: 'text/x-component',
    body: `0:${JSON.stringify({ a: result })}\n`,
  });
}

for (const application of applications) {
  test(`${application.name} application retains input after a network failure and can retry`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    let attempts = 0;
    await page.route(`**${application.path}`, async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      attempts++;
      if (attempts === 1) return route.abort('connectionfailed');
      return returnActionResult(route, { status: 'success', submitted: true });
    });
    await page.goto(application.path);
    await fillApplication(page, application.path);
    const submit = page.getByRole('button', { name: 'Submit', exact: true });
    await submit.click();

    await expect(page.locator('form').getByRole('alert')).toHaveText(
      'Could not submit your application. Please try again.',
    );
    await expectApplicationValues(page, application.path);
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect(page.locator('form').getByRole('status')).toHaveText(
      "Thank you for your submission! We'll be in touch soon.",
    );
    await expect(page.locator('form').getByRole('alert')).toHaveCount(0);
    await expect(page.getByRole('textbox', { name: 'Full Name', exact: false })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'More Info', exact: true })).toHaveValue('');
    expect(attempts).toBe(2);
    expect(errors).toEqual([]);
  });

  test(`${application.name} application displays returned errors without stale success feedback`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    let attempts = 0;
    await page.route(`**${application.path}`, async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      attempts++;
      return returnActionResult(
        route,
        attempts === 1
          ? { status: 'success', submitted: true }
          : { status: 'error', errors: ['Please check your application and try again.'] },
      );
    });
    await page.goto(application.path);
    await fillApplication(page, application.path);
    const submit = page.getByRole('button', { name: 'Submit', exact: true });
    await submit.click();
    await expect(page.locator('form').getByRole('status')).toHaveText(
      "Thank you for your submission! We'll be in touch soon.",
    );
    await fillApplication(page, application.path);
    await submit.click();

    await expect(page.locator('form').getByRole('alert')).toHaveText(
      'Please check your application and try again.',
    );
    await expect(page.locator('form').getByRole('status')).toHaveCount(0);
    await expectApplicationValues(page, application.path);
    await expect(submit).toBeEnabled();
    expect(attempts).toBe(2);
    expect(errors).toEqual([]);
  });
}
