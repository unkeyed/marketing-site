import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';
const isLocalBaseUrl = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(baseURL);
const shouldStartWebServer = isLocalBaseUrl && process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== '1';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results/playwright',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: shouldStartWebServer
    ? {
        command:
          process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'pnpm dev --hostname 127.0.0.1 --port 3100',
        url: baseURL,
        // Empty values win over `.env`, so e2e runs never POST to the real ai-visibility ingest.
        env: { AI_VIS_INGEST_URL: '', AI_VIS_INGEST_SECRET: '' },
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
