import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('screenshots/v2', { recursive: true });
const b = await chromium.launch();
const errs = [];
const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
d.on('console', (m) => m.type() === 'error' && errs.push(m.text())); d.on('pageerror', (e) => errs.push(e.message));
await d.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await d.waitForTimeout(1200);
await d.screenshot({ path: 'screenshots/v2/01-hero.png' });
await d.waitForTimeout(9000);
await d.evaluate(() => window.scrollTo(0, 880)); await d.waitForTimeout(900);
await d.screenshot({ path: 'screenshots/v2/02-hero-interview.png' });
const stops = [['#how', '03-night'], ['#product', '04-chapters'], ['#who', '05-who'], ['#why', '06-why'], ['#faq', '07-faq']];
for (const [sel, name] of stops) {
  await d.locator(sel).scrollIntoViewIfNeeded(); await d.waitForTimeout(900);
  await d.screenshot({ path: `screenshots/v2/${name}.png` });
}
// chapters: scroll through to get each panel
await d.locator('#product').scrollIntoViewIfNeeded();
const top = await d.evaluate(() => document.querySelector('#product').getBoundingClientRect().top + scrollY);
for (const [k, off] of [[2, 1500], [3, 2400], [4, 3300]]) { await d.evaluate((y) => window.scrollTo(0, y), top + off); await d.waitForTimeout(900); await d.screenshot({ path: `screenshots/v2/04-chapters-${k}.png` }); }
await d.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await d.waitForTimeout(800);
await d.screenshot({ path: 'screenshots/v2/08-footer.png' });
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
m.on('pageerror', (e) => errs.push('m:' + e.message));
await m.goto('http://localhost:3100/', { waitUntil: 'networkidle' }); await m.waitForTimeout(1200);
await m.screenshot({ path: 'screenshots/v2/m-01.png' });
await m.evaluate(() => window.scrollTo(0, 900)); await m.waitForTimeout(800); await m.screenshot({ path: 'screenshots/v2/m-02.png' });
const ov = await m.evaluate(() => document.documentElement.scrollWidth > innerWidth);
console.log('mobile overflow:', ov, '| errors:', errs.length ? errs : 'none');
await b.close();
