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

test('TC-E2E-008: All Things Open giveaway validates the entry', async ({ page }) => {
  await page.goto('/all-things-open');

  await page.getByRole('button', { name: 'Submit', exact: true }).click();

  await expect(
    page.getByText('Enter the URL of your deployed project.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("That doesn't look like a workspace ID.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Say what it does in at least 20 characters.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Enter your name.', { exact: true })).toBeVisible();
  await expect(page.getByText('Enter a valid email.', { exact: true })).toBeVisible();

  const projectUrl = page.getByRole('textbox', { name: 'Project URL', exact: true });
  await projectUrl.fill('not-a-url');
  await projectUrl.blur();
  await expect(page.getByText('Enter a valid http or https URL.', { exact: true })).toBeVisible();

  const workspaceId = page.getByRole('textbox', { name: 'Workspace ID', exact: true });
  await workspaceId.fill('ws_123');
  await workspaceId.blur();
  await expect(
    page.getByText("That doesn't look like a workspace ID.", { exact: true }),
  ).toBeVisible();

  await workspaceId.fill('ws_dYuyGV3qMKve');
  await workspaceId.blur();
  await expect(
    page.getByText("That doesn't look like a workspace ID.", { exact: true }),
  ).toHaveCount(0);

  const description = page.getByRole('textbox', { name: 'What does it do?', exact: true });
  await description.fill('A short note.');
  await expect(page.getByText('13/500', { exact: true })).toBeVisible();
});
