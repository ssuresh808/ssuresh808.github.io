import { test, expect } from '@playwright/test';

test('the notes index lists the published note and the header links to it', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const menu = page.getByRole('group').locator('summary', { hasText: 'Menu' });
    await menu.focus();
    await menu.press('Enter');
  }
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Notes' }).click();
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Notes');
  const item = page.getByRole('link', { name: /reranking lowered/i });
  await expect(item).toHaveAttribute('href', '/notes/reranking-metric-mismatch/');
});

test('a note renders as an article with date, body, and a link back to the project', async ({ page }) => {
  await page.goto('/notes/reranking-metric-mismatch/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('reranking lowered');
  await expect(page.locator('article time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  await expect(page.getByRole('table').first()).toContainText('0.520');
  await expect(page.getByRole('link', { name: /Agentic RAG/ }).first()).toHaveAttribute('href', '/projects/agentic-rag/');
  expect(await page.locator('body').innerText()).not.toMatch(/\b0\.48\b|\b0\.65\b/);
});

test('notes appear in the sitemap', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('<loc>https://ssuresh808.github.io/notes/</loc>');
  expect(xml).toContain('<loc>https://ssuresh808.github.io/notes/reranking-metric-mismatch/</loc>');
});
