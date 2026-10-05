import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('screenshots/redesign', { recursive: true });
const b = await chromium.launch();
const errs = [];
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, reducedMotion: 'reduce' });
  for (const p of ['/', '/demo', '/blog', '/privacy']) {
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errs.push(`${name} ${p}: ${m.text()}`));
    page.on('pageerror', (e) => errs.push(`${name} ${p}: ${e.message}`));
    await page.goto('http://localhost:3100' + p, { waitUntil: 'networkidle' });
    // trigger reveal-on-scroll
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const slug = (p === '/' ? 'home' : p.slice(1));
    await page.screenshot({ path: `screenshots/redesign/${slug}-${name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) errs.push(`${name} ${p}: horizontal overflow`);
    await page.close();
  }
  await ctx.close();
}
console.log(errs.length ? errs.join('\n') : 'no console errors, no overflow');
await b.close();
