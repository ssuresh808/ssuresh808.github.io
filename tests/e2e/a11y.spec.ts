import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/projects/', '/projects/agentic-rag/', '/projects/lifelens/', '/about/'];

for (const route of routes) {
  test(`${route} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test.describe('320px viewport', () => {
  test.use({ viewport: { width: 320, height: 700 } });
  for (const route of ['/', '/projects/', '/projects/agentic-rag/', '/projects/person-of-interest/', '/about/']) {
    test(`${route} does not scroll horizontally`, async ({ page }) => {
      await page.goto(route);
      // documentElement.scrollWidth counts the contents of overflow:auto children in Chromium,
      // so assert what a person experiences: the viewport cannot be scrolled sideways and the
      // body fits the viewport. Tables scroll inside their own labeled wrapper.
      const result = await page.evaluate(() => {
        window.scrollTo(10_000, 0);
        return {
          scrollX: window.scrollX,
          bodyWidth: document.body.scrollWidth,
          viewport: document.documentElement.clientWidth,
        };
      });
      expect(result.scrollX).toBe(0);
      expect(result.bodyWidth).toBeLessThanOrEqual(result.viewport);
    });
  }
});

test('reduced motion does not hide content', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('project-card').first()).toBeVisible();
  await context.close();
});
