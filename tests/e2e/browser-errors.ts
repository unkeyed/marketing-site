import type { ConsoleMessage, Page } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const baseOrigin = new URL(baseURL).origin;

function isApplicationConsoleError(message: ConsoleMessage): boolean {
  if (message.type() !== 'error') return false;

  const sourceUrl = message.location().url;
  return !sourceUrl || sourceUrl.startsWith(baseOrigin);
}

export function captureBrowserErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (isApplicationConsoleError(message)) {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}
