import { test, expect } from '@playwright/test';

test('skip link is the first focusable element and jumps to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('header navigation reaches projects and about', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const menu = page.getByRole('group').locator('summary', { hasText: 'Menu' });
    await menu.focus();
    await menu.press('Enter');
  }
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects');
  if (isMobile) {
    const menu = page.getByRole('group').locator('summary', { hasText: 'Menu' });
    await menu.click();
  }
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
});

test('résumé action points at the PDF with a download name', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /résumé/i }).first();
  await expect(link).toHaveAttribute('href', '/resume.pdf');
  await expect(link).toHaveAttribute('download', 'Suraj_Suresh_Resume.pdf');
});

test('unknown routes show the 404 page with a way home', async ({ page }) => {
  const response = await page.goto('/this-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveURL(/\/$/);
});
