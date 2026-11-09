import { test, expect } from '@playwright/test';

test('sections and cards fade in as they enter the viewport', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.getByTestId('project-card').first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toHaveClass(/is-visible/);
  await expect(firstCard).toHaveCSS('opacity', '1');
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills [data-reveal]').first()).toHaveClass(/is-visible/);
});

test('content is fully visible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  const card = page.getByTestId('project-card').first();
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS('opacity', '1');
  await context.close();
});

test('reduced motion shows everything immediately with no transition', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  const far = page.locator('#education [data-reveal]').first();
  const styles = await far.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { opacity: cs.opacity, transition: cs.transitionDuration };
  });
  expect(styles.opacity).toBe('1');
  expect(styles.transition.split(',').every((d) => parseFloat(d) < 0.02)).toBe(true);
  await context.close();
});
