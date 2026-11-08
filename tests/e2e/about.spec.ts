import { test, expect } from '@playwright/test';

test('about page carries the full experience, education, training, and skills', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('About');
  await expect(page.locator('#experience')).toContainText('FitBUX');
  await expect(page.locator('#experience')).toContainText('CloudWatch');
  await expect(page.locator('#education')).toContainText('Expected Spring 2028');
  await expect(page.locator('#education')).toContainText('Relevant coursework');
  await expect(page.locator('#training')).toContainText('ByteByteGo');
  await expect(page.locator('#training')).toContainText('SupportVectors');
  await expect(page.locator('#skills').getByRole('link', { name: 'FAISS' })).toHaveAttribute(
    'href',
    '/projects/person-of-interest/',
  );
  await expect(page.locator('#skills').getByRole('link', { name: 'SQL' })).toHaveAttribute(
    'href',
    '/about/#experience-fitbux',
  );
});

test('the experience anchor from the home page lands on the timeline', async ({ page }) => {
  await page.goto('/about/#experience-fitbux');
  await expect(page.locator('#experience-fitbux')).toBeInViewport();
});

test('no phone number is rendered on the about page', async ({ page }) => {
  await page.goto('/about/');
  expect(await page.locator('body').innerText()).not.toMatch(/\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}/);
});
