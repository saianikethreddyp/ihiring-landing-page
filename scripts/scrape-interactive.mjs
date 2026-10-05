// Second pass: expand FAQ (both tabs), feature tabs, hero video, integrations, demo logos, all subpages' full text.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.setDefaultTimeout(4000);
const T = async (fn) => { try { return await fn(); } catch (e) { console.log('skip:', e.message.split('\n')[0]); } };
await page.goto('https://ihiring.ai/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const out = {};

// FAQ: both tabs, open every question, record Q + A
out.faq = {};
const tabs = await page.locator('button:visible', { hasText: /^(General|Core Features)$/ }).all();
for (const tab of tabs) {
  const name = (await tab.innerText()).trim();
  await T(() => tab.scrollIntoViewIfNeeded());
  await T(() => tab.click());
  await page.waitForTimeout(500);
  const qs = await page.locator('button:visible:has(h2)').all();
  const items = [];
  for (const q of qs) {
    const qt = (await q.innerText()).trim();
    if (!qt) continue;
    await T(() => q.scrollIntoViewIfNeeded());
    await T(() => q.click());
    await page.waitForTimeout(450);
    const answer = await q.evaluate((b) => {
      const wrap = b.parentElement;
      return (wrap.innerText || '').replace(b.innerText, '').trim() || (wrap.nextElementSibling?.innerText || '').trim();
    });
    items.push({ q: qt, a: answer });
  }
  out.faq[name] = items.filter((i) => !['Precise Pipeline Management', 'Auto Schedule Anytime'].includes(i.q));
}

// Feature tabs (Precise Pipeline / Auto Schedule), record visible text of each state
out.featureTabs = [];
for (const label of ['Precise Pipeline Management', 'Auto Schedule Anytime']) {
  const b = page.locator('button:visible', { hasText: label }).first();
  await T(() => b.scrollIntoViewIfNeeded());
  await T(() => b.click());
  await page.waitForTimeout(800);
  const sec = page.locator('section', { hasText: 'Let SAM handle' }).first();
  out.featureTabs.push({ label, text: ((await T(() => sec.innerText())) || '').replace(/\s+/g, ' ').trim() });
  await sec.screenshot({ path: `screenshots/feature-tab-${label.split(' ')[0].toLowerCase()}.png` }).catch(() => {});
}

// Dark "Move Smart" integrations section: full text + screenshot at a few moments
const dark = page.locator('section', { hasText: 'Designed to fit every need' }).first();
await T(() => dark.scrollIntoViewIfNeeded());
for (let i = 0; i < 3; i++) { await page.waitForTimeout(1500); await dark.screenshot({ path: `screenshots/integrations-${i}.png` }).catch(() => {}); }
out.integrations = ((await T(() => dark.innerText())) || '').replace(/\s+/g, ' ').trim();
out.integrationImgs = await T(() => dark.evaluate((s) => [...s.querySelectorAll('img,svg')].map((e) => ({ tag: e.tagName, src: e.src || null, label: e.getAttribute('aria-label') || e.getAttribute('alt') }))));

// Testimonials, deduped
out.testimonials = await page.evaluate(() => {
  const m = new Map();
  document.querySelectorAll('span').forEach((s) => {
    const t = s.innerText?.trim();
    if (t && t.length > 60 && t.length < 300 && !m.has(t)) {
      const card = s.closest('div[class*=card],div');
      const spans = [...(card?.parentElement?.querySelectorAll('span') || [])].map((x) => x.innerText.trim()).filter(Boolean);
      const i = spans.indexOf(t);
      m.set(t, { quote: t, name: spans[i + 1] || null, role: spans[i + 2] || null });
    }
  });
  return [...m.values()];
});

// Hero video: play and screenshot, grab gumlet iframe src + try thumbnail
out.heroVideo = await page.evaluate(() => document.querySelector('iframe')?.src || null);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'screenshots/hero-video-frame.png', clip: { x: 230, y: 480, width: 980, height: 420 } }).catch(() => {});

// Original demo logos behind next/image
out.demoLogos = [];
for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const r = await page.request.get(`https://ihiring.ai/demo-${n}.png`);
  if (r.ok()) { await fs.writeFile(`assets/logos/demo-${n}.png`, await r.body()); out.demoLogos.push(`assets/logos/demo-${n}.png`); }
}

// Other candidate asset URLs referenced on the page (public root)
const rootAssets = ['main-logo.svg', 'Logo.svg', 'vector.svg', 'new-like.svg', 'linkedin-logo.svg', 'G2_ihiring_website.svg', 'Document-flow.svg', 'file_flow.svg', 'flow-right-image.svg', 'right-side-flagged.svg', 'right-side-rejected.svg', 'right-side-success.svg', 'work-day.svg', 'robert-hood.svg', 'left-new-2.png', 'left-new-3.png'];
const html = await page.content();
const refs = [...new Set([...html.matchAll(/["'(](\/[A-Za-z0-9_\-./%]+\.(?:png|jpe?g|svg|webp|gif|mp4|webm))/g)].map((m) => m[1]))];
out.referencedAssets = refs;
for (const ref of refs) {
  if (ref.startsWith('/_next/static/media')) continue;
  const r = await page.request.get('https://ihiring.ai' + ref);
  if (r.ok()) {
    const name = ref.split('/').pop();
    const dir = /logo/i.test(name) ? 'logos' : name.endsWith('.svg') ? 'svg' : 'images';
    await fs.writeFile(`assets/${dir}/${name}`, await r.body());
  }
}

// Subpages: full text in reading order
out.subpages = {};
for (const p of ['tips-for-interview', 'contact-us', 'privacy-policy']) {
  await page.goto('https://ihiring.ai/' + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  out.subpages[p] = {
    title: await page.title(),
    text: await page.evaluate(() => document.body.innerText),
    forms: await page.evaluate(() => [...document.querySelectorAll('input,select,textarea,button')].map((i) => ({ tag: i.tagName, type: i.type, name: i.name, placeholder: i.placeholder, text: i.innerText?.trim() }))),
    images: await page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc, alt: i.alt }))),
  };
}
await fs.writeFile('raw/interactive.json', JSON.stringify(out, null, 2));
await browser.close();
console.log(JSON.stringify({ faq: Object.fromEntries(Object.entries(out.faq).map(([k, v]) => [k, v.length])), testimonials: out.testimonials.length, demoLogos: out.demoLogos.length, refs: out.referencedAssets.length }));
