import type { Page } from '@playwright/test';

/** Scrolls through the page so every reveal element has entered the viewport, then waits for animations to finish. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => document.querySelectorAll('[data-reveal]:not(.is-visible)').length === 0 || !document.documentElement.classList.contains('js'));
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
  await page.waitForTimeout(100);
}
