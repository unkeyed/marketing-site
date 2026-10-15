import { expect, test, type Page } from '@playwright/test';

import { GIVEAWAY_NOW_COOKIE } from '../../src/lib/giveaway-window';

const GIVEAWAY_BEFORE = '2026-10-18T15:00:00.000Z';
const GIVEAWAY_OPEN = '2026-10-21T16:00:00.000Z';
const GIVEAWAY_CLOSED = '2026-10-24T04:00:00.000Z';

async function setGiveawayClock(page: Page, iso: string) {
  await page.context().addCookies([
    {
      name: GIVEAWAY_NOW_COOKIE,
      value: iso,
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
}

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
  await setGiveawayClock(page, GIVEAWAY_OPEN);
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

test('TC-E2E-017: All Things Open rules link opens the official rules', async ({ page }) => {
  await setGiveawayClock(page, GIVEAWAY_OPEN);
  await page.goto('/all-things-open');

  const rulesLink = page.getByRole('link', { name: 'official rules', exact: true });
  await expect(rulesLink).toHaveAttribute('href', '/all-things-open/rules');
  await rulesLink.click();

  await expect(page).toHaveURL(/\/all-things-open\/rules$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'All Things Open Giveaway: Official Rules' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'privacy policy', exact: true })).toHaveAttribute(
    'href',
    '/policies/privacy',
  );
  await expect(page.getByRole('link', { name: 'support@unkey.com', exact: true })).toHaveAttribute(
    'href',
    'mailto:support@unkey.com',
  );
  await expect(
    page.getByRole('link', { name: 'unkey.com/all-things-open', exact: true }),
  ).toHaveAttribute('href', '/all-things-open');

  const privacy = await page.request.get('/policies/privacy');
  expect(privacy.ok()).toBeTruthy();
});

test('TC-E2E-018: giveaway entry window shows before, open, and closed', async ({ page }) => {
  await setGiveawayClock(page, GIVEAWAY_BEFORE);
  await page.goto('/all-things-open');
  await expect(page.getByText('Entries open Oct 19 at 12:00am ET.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
  const beforePost = await page.request.post('/api/all-things-open', { data: {} });
  expect(beforePost.status()).toBe(403);
  await expect(beforePost.json()).resolves.toMatchObject({
    status: 'error',
    errors: ['Entries open Oct 19 at 12:00am ET.'],
  });

  await setGiveawayClock(page, GIVEAWAY_OPEN);
  await page.goto('/all-things-open');
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
  await expect(
    page.getByText(
      'Entries open Monday, October 19, 2026 at 12:00am ET and close Friday, October 23, 2026 at 11:59pm ET.',
    ),
  ).toBeVisible();
  const openPost = await page.request.post('/api/all-things-open', { data: {} });
  expect(openPost.status()).toBe(400);
  const openBody = (await openPost.json()) as { errors?: string[] };
  expect(openBody.errors?.join(' ')).not.toContain('Entries closed');
  expect(openBody.errors?.join(' ')).not.toContain('Entries open Oct 19');

  await setGiveawayClock(page, GIVEAWAY_CLOSED);
  await page.goto('/all-things-open');
  await expect(page.getByText('Entries closed', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
  const closedPost = await page.request.post('/api/all-things-open', { data: {} });
  expect(closedPost.status()).toBe(403);
  await expect(closedPost.json()).resolves.toMatchObject({
    status: 'error',
    errors: ['Entries closed'],
  });
});
