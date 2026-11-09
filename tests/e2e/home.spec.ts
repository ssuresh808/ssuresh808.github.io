import { test, expect } from '@playwright/test';

test('hero states who, what, and what is being sought', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Suraj Suresh');
  await expect(page.getByText('I build and evaluate AI systems end to end.')).toBeVisible();
  await expect(page.getByText(/Summer 2027 internships and to full-time roles/)).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('heading', { level: 2 })).toHaveText('Open to Summer 2027 internships and full-time roles');
  await expect(page.getByRole('link', { name: 'See projects' })).toHaveAttribute('href', '/projects/');
  await expect(page.getByRole('link', { name: /Download résumé/ })).toHaveAttribute('href', '/resume.pdf');
});

test('exactly three featured cards link to their case studies', async ({ page }) => {
  await page.goto('/');
  const cards = page.getByTestId('project-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Agentic RAG');
  await expect(cards.nth(1)).toContainText('LifeLens');
  await expect(cards.nth(2)).toContainText('Person of Interest');
  await cards.nth(0).getByRole('link').click();
  await expect(page).toHaveURL(/\/projects\/agentic-rag\/$/);
});

test('home shows experience, skills with evidence links, and education', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Machine Learning Intern')).toBeVisible();
  await expect(page.getByText('Jun 2023 to May 2024')).toBeVisible();
  await expect(page.getByRole('link', { name: /Qdrant/ })).toHaveAttribute('href', '/projects/agentic-rag/');
  await expect(page.getByText('University of Colorado Boulder')).toBeVisible();
  await expect(page.getByText('4.0/4.0')).toBeVisible();
});

test('no phone number is rendered anywhere on the home page', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}/);
});
