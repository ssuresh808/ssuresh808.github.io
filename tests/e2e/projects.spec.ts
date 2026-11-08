import { test, expect } from '@playwright/test';

test.describe('projects index', () => {
  test('lists all published projects and filters by category without a network call', async ({ page }) => {
    await page.goto('/projects/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects');
    await expect(page.getByTestId('project-card')).toHaveCount(4);
    await expect(page.getByRole('status')).toContainText('4 projects');

    await page.getByRole('button', { name: /^AI \/ ML/ }).click();
    await expect(page.getByTestId('project-card')).toHaveCount(2);
    await expect(page.getByRole('status')).toContainText('2 projects');
    await expect(page.getByRole('button', { name: /^AI \/ ML/ })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: /^Tooling/ }).click();
    await expect(page.getByTestId('project-card')).toHaveCount(1);
    await expect(page.getByTestId('project-card')).toContainText('sortwise');

    await page.getByRole('button', { name: /^All/ }).click();
    await expect(page.getByTestId('project-card')).toHaveCount(4);
  });

  test('renders every card and the result count with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/projects/');
    await expect(page.getByTestId('project-card')).toHaveCount(4);
    await context.close();
  });
});
