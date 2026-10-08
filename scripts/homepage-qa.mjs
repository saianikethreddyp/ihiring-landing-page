import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const baseURL = process.env.QA_URL || 'http://127.0.0.1:3000';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
assert.equal(await page.locator('h1').count(), 1);
assert.equal(await page.locator('.hero-customer-list li').count(), 7);
assert(await page.locator('.hero-proof').evaluate(e => e.getBoundingClientRect().bottom <= innerHeight), 'Customer and review proof must be visible in the desktop first fold');
assert(await page.locator('h1').evaluate(e => getComputedStyle(e).fontFamily.toLowerCase().includes('halant')), 'Hero must use Halant');
await page.screenshot({ path: 'screenshots/revamp-desktop.png' });
await page.screenshot({ path: 'screenshots/revamp-full.png', fullPage: true });
await page.waitForFunction(() => document.querySelector('.conversation-engine')?.dataset.playing === 'true');
const engine = page.locator('.conversation-engine');
const rotation = () => page.locator('.engine-rosette').evaluate(e => getComputedStyle(e).transform);
const frameA = await rotation();
await engine.screenshot({ path: 'screenshots/revamp-animation-frame-1.png' });
await page.waitForTimeout(500);
const frameB = await rotation();
assert.notEqual(frameA, frameB, 'The large SVG must visibly animate on load');
await engine.screenshot({ path: 'screenshots/revamp-animation-frame-2.png' });
await page.getByRole('button', { name: 'Pause hero animation', exact: true }).click();
await page.waitForFunction(() => document.querySelector('.conversation-engine')?.dataset.playing === 'false' && getComputedStyle(document.querySelector('.engine-rosette')).animationPlayState === 'paused');
await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const stopped = await rotation();
await page.waitForTimeout(300);
assert.equal(await rotation(), stopped, 'Pause must freeze the SVG');
const engineControls = page.getByRole('group', { name: 'Explore the conversation engine' });
await engineControls.getByRole('button', { name: /conversation/i }).click();
assert.equal(await engine.getAttribute('data-chapter'), '1');
await engineControls.getByRole('button', { name: /context/i }).click();
assert.equal(await engine.getAttribute('data-chapter'), '2');
await page.getByRole('button', { name: 'Replay hero animation' }).click();
assert.equal(await engine.getAttribute('data-chapter'), '0');
await page.waitForTimeout(4450);
assert.equal(await engine.getAttribute('data-chapter'), '1', 'Autoplay must advance the product story');
for (const name of ['Screen', 'Schedule', 'Understand', 'Interview']) {
  await page.getByRole('tab', { name: new RegExp(name) }).click();
  assert.equal(await page.getByRole('tab', { name: new RegExp(name) }).getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('.journey-demo').count(), 1);
}
await page.getByRole('tab', { name: /Interview/ }).press('ArrowRight');
assert.equal(await page.getByRole('tab', { name: /Understand/ }).getAttribute('aria-selected'), 'true');
assert.equal(await page.locator('.report-example').count(), 1);
await page.locator('#how').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'screenshots/revamp-report.png' });
await page.locator('.story-faq-list summary').first().click();
assert.equal(await page.locator('.story-faq-list details').first().getAttribute('open'), '');
await page.locator('.stack-flow').scrollIntoViewIfNeeded();
await page.waitForFunction(() => !!document.querySelector('.flow-moving'));
assert.equal(await page.locator('.flow-moving').count(), 1, 'ATS SVG starts automatically on entry');
await page.getByRole('button', { name: 'Pause integration flow' }).click();
assert.equal(await page.locator('.flow-moving').count(), 0);
await page.getByRole('button', { name: 'Animate integration flow' }).click();
assert.equal(await page.locator('.flow-moving').count(), 1);
const links = await page.locator('.story-home a[href^="#"]').evaluateAll(anchors => anchors.map(a => ({ href: a.getAttribute('href'), exists: !!document.querySelector(a.getAttribute('href')) })));
assert(links.every(link => link.exists), 'All homepage anchors must resolve');
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: width === 1440 ? 768 : 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  if (dimensions.document > dimensions.viewport) {
    console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].map(e => ({ tag: e.tagName, class: e.className?.baseVal ?? e.className, right: Math.round(e.getBoundingClientRect().right), width: Math.round(e.getBoundingClientRect().width) })).filter(e => e.right > innerWidth && e.width > 0).slice(0, 25)));
    await page.screenshot({ path: 'screenshots/revamp-overflow.png' });
  }
  assert(dimensions.document <= dimensions.viewport, `Horizontal overflow at ${width}: ${JSON.stringify(dimensions)}`);
  if (width === 1440 || width === 390) {
    const fold = await page.evaluate(() => ({ height: innerHeight, proofBottom: document.querySelector('.hero-proof').getBoundingClientRect().bottom, titleSize: getComputedStyle(document.querySelector('h1')).fontSize, heroCopyHeight: document.querySelector('.hero-copy').getBoundingClientRect().height, artHeight: document.querySelector('.conversation-engine').getBoundingClientRect().height }));
    console.log('First fold:', fold);
    assert(fold.proofBottom <= fold.height, `Trust signals must be in the first fold at ${width}px`);
  }
  console.log(`Layout ${width}px: no horizontal overflow`);
  if (width === 390) {
    await page.screenshot({ path: 'screenshots/revamp-mobile.png' });
    await page.screenshot({ path: 'screenshots/revamp-mobile-full.png', fullPage: true });
    await page.getByRole('button', { name: 'Open menu' }).click();
    assert.equal(await page.locator('#mobile-menu').count(), 1);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu').count(), 0);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'How it works' }).click();
    assert.equal(await page.locator('#mobile-menu').count(), 0);
  }
}
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(baseURL, { waitUntil: 'networkidle' });
assert.equal(await engine.getAttribute('data-playing'), 'false');
assert.equal(await page.locator('.engine-rosette').evaluate(e => getComputedStyle(e).animationName), 'none');
await engineControls.getByRole('button', { name: /context/i }).click();
assert.equal(await engine.getAttribute('data-chapter'), '2');
await page.getByRole('link', { name: 'Meet your next interviewer' }).click();
await page.waitForURL('**/demo');
assert.equal(await page.locator('form').count(), 1);
assert.deepEqual(errors, [], 'No uncaught browser errors');
console.log('PASS: first-fold customer/review proof, Halant, actual SVG motion, pause/replay/autoplay, workflow stages, keyboard tabs, automatic ATS motion, FAQ, mobile navigation, anchors, reduced motion, demo route, browser errors');
await browser.close();
