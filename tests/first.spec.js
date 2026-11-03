import { test, expect } from '@playwright/test';

test('Playwright site title check', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});