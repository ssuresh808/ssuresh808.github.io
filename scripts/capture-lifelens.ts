import { chromium, devices } from '@playwright/test';

const url = 'https://lifelens-two.vercel.app/';
const out = 'assets/covers/lifelens-scan.png';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices['iPhone 14'], colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(1500);
  const scanTab = page.getByRole('button', { name: /scan/i }).first();
  if (await scanTab.isVisible().catch(() => false)) {
    await scanTab.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: out, fullPage: false });
  await browser.close();
  console.log(`wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
