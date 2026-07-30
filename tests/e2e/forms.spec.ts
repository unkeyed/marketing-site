import { expect, test } from '@playwright/test';

const applicationForms = [
  {
    name: 'startups',
    path: '/startups',
    requiredErrors: [
      'Name must be at least 3 characters',
      'Please enter a valid email',
      'Please select your VC or accelerator',
    ],
  },
  {
    name: 'YC',
    path: '/yc',
    requiredErrors: [
      'Name must be at least 3 characters',
      'Please enter a valid email',
      'YC batch must be at least 3 characters',
    ],
  },
] as const;

for (const application of applicationForms) {
  test(`TC-E2E-006: ${application.name} application validates required fields`, async ({
    page,
  }) => {
    await page.goto(application.path);

    await page.getByRole('button', { name: 'Submit', exact: true }).click();

    for (const error of application.requiredErrors) {
      await expect(page.getByText(error, { exact: true })).toBeVisible();
    }
  });

  test(`TC-E2E-007: ${application.name} application rejects an invalid workspace ID`, async ({
    page,
  }) => {
    await page.goto(application.path);

    const workspaceId = page.getByRole('textbox', { name: 'Workspace ID', exact: true });
    await workspaceId.fill('workspace-123');
    await workspaceId.blur();

    await expect(
      page.getByText("Workspace ID must start with 'ws_'", { exact: true }),
    ).toBeVisible();
  });
}
