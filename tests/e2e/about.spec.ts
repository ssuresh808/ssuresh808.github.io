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

test('anchor targets are not hidden under the sticky header', async ({ page }) => {
  await page.goto('/about/');
  await page.evaluate(() => document.getElementById('experience-fitbux')?.scrollIntoView());
  await page.waitForFunction(() => window.scrollY > 0);
  const header = await page.locator('header').boundingBox();
  const target = await page.locator('#experience-fitbux').boundingBox();
  expect(header && target && target.y >= header.y + header.height).toBe(true);
});

test('skill evidence labels are short project names, not full titles', async ({ page }) => {
  await page.goto('/about/');
  const labels = page.locator('#skills li span.text-xs');
  const count = await labels.count();
  expect(count).toBeGreaterThan(10);
  for (let i = 0; i < count; i++) {
    const text = (await labels.nth(i).textContent())?.trim() ?? '';
    expect(text.length, `label "${text}" is too long`).toBeLessThanOrEqual(20);
  }
  await expect(page.locator('#skills li', { hasText: 'Qdrant' }).locator('span.text-xs')).toHaveText('Agentic RAG');
});

test('the FitBUX entry on the about page tells the fuller story; the home page keeps the short version', async ({ page }) => {
  await page.goto('/about/');
  const entry = page.locator('#experience-fitbux');
  await expect(entry).toContainText('Elastic Beanstalk');
  await expect(entry).toContainText('Tkinter');
  await expect(entry).toContainText('Vertex AI');
  await expect(entry).toContainText(/belongs to FitBUX/);
  await expect(entry.getByRole('heading', { level: 4 }).first()).toBeVisible();
  await page.goto('/');
  await expect(page.locator('#experience-fitbux')).not.toContainText('service account');
});
