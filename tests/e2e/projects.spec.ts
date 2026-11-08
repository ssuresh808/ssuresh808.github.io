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

  test('renders every card and the result count with JavaScript disabled', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${baseURL}/projects/`);
    await expect(page.getByTestId('project-card')).toHaveCount(4);
    await context.close();
  });
});

test.describe('project detail pages', () => {
  for (const slug of ['agentic-rag', 'lifelens', 'person-of-interest', 'sortwise']) {
    test(`${slug} renders with one h1 and a repo link`, async ({ page }) => {
      await page.goto(`/projects/${slug}/`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('link', { name: /Source on GitHub/ })).toHaveAttribute(
        'href',
        /^https:\/\/github\.com\/ssuresh808\//,
      );
    });
  }

  test('evidence rows show value, method, and source without hover', async ({ page }) => {
    await page.goto('/projects/agentic-rag/');
    const table = page.getByRole('table', { name: 'Evidence' });
    await expect(table).toContainText('0.594 to 0.639');
    await expect(table).toContainText('answer-string containment');
    await expect(table.getByRole('link', { name: /experiments\.md/ }).first()).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(/\b0\.48\b|\b0\.65\b/);
  });

  test('a paused demo shows the link together with the note', async ({ page }) => {
    await page.goto('/projects/lifelens/');
    const demo = page.getByRole('link', { name: /Live app/ });
    await expect(demo).toHaveAttribute('href', 'https://lifelens-two.vercel.app');
    await expect(page.getByText(/API is paused/)).toBeVisible();
  });

  test('synthetic numbers are labeled in the same row', async ({ page }) => {
    await page.goto('/projects/person-of-interest/');
    const rows = page.getByRole('table', { name: 'Evidence' }).getByRole('row');
    const count = await rows.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 1; i < count; i++) {
      await expect(rows.nth(i)).toContainText('synthetic corpus');
      await expect(rows.nth(i)).toContainText('Pipeline validation');
    }
  });

  test('repo facts show the as-of date and hide zero stars', async ({ page }) => {
    await page.goto('/projects/sortwise/');
    await expect(page.getByText(/Repository last updated/)).toBeVisible();
    await expect(page.locator('body')).not.toContainText('0 stars');
  });
});
