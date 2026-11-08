import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test('sitemap lists every published route and nothing else', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const route of [
    '/',
    '/projects/',
    '/about/',
    '/projects/agentic-rag/',
    '/projects/lifelens/',
    '/projects/person-of-interest/',
    '/projects/sortwise/',
  ]) {
    expect(xml).toContain(`<loc>https://ssuresh808.github.io${route}</loc>`);
  }
  expect(xml).not.toContain('/notes');
  expect((xml.match(/<loc>/g) ?? []).length).toBe(7);
});

test('robots allows crawling and names the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://ssuresh808.github.io/sitemap.xml');
});

test('home carries title, description, canonical, Open Graph, and Person JSON-LD', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Suraj Suresh');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI systems end to end/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ssuresh808.github.io/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@type']).toBe('Person');
  expect(ld.sameAs).toEqual(['https://github.com/ssuresh808', 'https://www.linkedin.com/in/suraj-suresh-profile/']);
  expect(JSON.stringify(ld)).not.toMatch(/\d{3}[ .-]\d{3}[ .-]\d{4}/);
});

test('project pages have unique titles and canonical URLs', async ({ page }) => {
  await page.goto('/projects/lifelens/');
  await expect(page).toHaveTitle(/^LifeLens, a multimodal assistant PWA, Suraj Suresh$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://ssuresh808.github.io/projects/lifelens/',
  );
});

test('the exported 404 page exists at the root for GitHub Pages', () => {
  expect(fs.existsSync('out/404.html')).toBe(true);
});
