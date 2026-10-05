import { chromium } from 'playwright';
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
for (const sel of ['text=Everything a recruiter does', 'text=Candidates say it feels']) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const el = page.locator(sel).first();
  console.log(sel, 'opacity:', await el.evaluate((e) => getComputedStyle(e.closest('[style]') ?? e).opacity));
  await page.screenshot({ path: `screenshots/redesign/probe-${sel.length}.png` });
}
await b.close();
