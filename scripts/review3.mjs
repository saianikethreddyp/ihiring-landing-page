import { chromium } from 'playwright';
const b = await chromium.launch(); const errs = [];
const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
d.on('pageerror', (e) => errs.push(e.message)); d.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await d.goto('http://localhost:3100/', { waitUntil: 'networkidle' }); await d.waitForTimeout(1200);
await d.screenshot({ path: 'screenshots/v3/01-hero.png' });
await d.evaluate(() => window.scrollTo(0, 1010)); await d.waitForTimeout(800); await d.screenshot({ path: 'screenshots/v3/02-trusted.png' });
for (const [sel, n] of [['#stack', '03-integrations'], ['#how', '04-night'], ['#who', '06-who']]) { await d.locator(sel).scrollIntoViewIfNeeded(); await d.waitForTimeout(900); await d.screenshot({ path: `screenshots/v3/${n}.png` }); }
await d.locator('section:has-text("Interviews without")').first().scrollIntoViewIfNeeded(); await d.waitForTimeout(1200); await d.screenshot({ path: 'screenshots/v3/05-global.png' });
await d.locator('#product').scrollIntoViewIfNeeded(); const top = await d.evaluate(() => document.querySelector('#product').getBoundingClientRect().top + scrollY);
await d.evaluate((y) => window.scrollTo(0, y + 2500), top); await d.waitForTimeout(900); await d.screenshot({ path: 'screenshots/v3/04b-chapter-report.png' });
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await m.goto('http://localhost:3100/', { waitUntil: 'networkidle' }); await m.waitForTimeout(800);
await m.locator('section:has-text("Interviews without")').first().scrollIntoViewIfNeeded(); await m.waitForTimeout(900); await m.screenshot({ path: 'screenshots/v3/m-global.png' });
await m.locator('#stack').scrollIntoViewIfNeeded(); await m.waitForTimeout(700); await m.screenshot({ path: 'screenshots/v3/m-stack.png' });
console.log('overflow', await m.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'errors', errs.length ? errs : 'none');
await b.close();
