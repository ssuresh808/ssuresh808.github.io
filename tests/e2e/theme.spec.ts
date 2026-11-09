import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { settle } from './helpers';

test('follows the system color scheme by default', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(11, 18, 32)'); // dark background token
  await context.close();
});

test('the theme toggle switches and persists the choice', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /switch to dark theme/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: /switch to light theme/i })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /switch to light theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test.describe('dark theme accessibility', () => {
  test.use({ colorScheme: 'dark' });
  for (const route of ['/', '/projects/agentic-rag/', '/projects/lifelens/', '/about/', '/notes/']) {
    test(`${route} has no WCAG 2.2 AA violations in dark mode`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
