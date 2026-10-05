import { chromium } from 'playwright';
import fs from 'node:fs';
const sites = { alex: 'https://www.alex.com/', perfectly: 'https://www.perfectly.so/', prism: 'https://tryprism.com/', contrario: 'https://www.contrario.ai/', candidately: 'https://www.candidately.com/' };
const b = await chromium.launch();
const out = {};
for (const [k, url] of Object.entries(sites)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3500);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `research/${k}-fold.png` });
    await p.screenshot({ path: `research/${k}-full.png`, fullPage: true }).catch(() => {});
    out[k] = await p.evaluate(() => {
      const cs = (e) => getComputedStyle(e);
      const t = (e) => (e.innerText || '').replace(/\s+/g, ' ').trim();
      const fonts = {}, colors = {};
      document.querySelectorAll('body *').forEach((e) => { if (!e.childNodes.length) return; const s = cs(e); fonts[s.fontFamily.split(',')[0]] = (fonts[s.fontFamily.split(',')[0]] || 0) + 1; [s.color, s.backgroundColor].forEach((c) => { if (c && !/rgba\(0, 0, 0, 0\)/.test(c)) colors[c] = (colors[c] || 0) + 1; }); });
      const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
      const h1 = document.querySelector('h1');
      return {
        title: document.title, h1: h1 && t(h1), h1Style: h1 && { size: cs(h1).fontSize, weight: cs(h1).fontWeight, ls: cs(h1).letterSpacing, lh: cs(h1).lineHeight, font: cs(h1).fontFamily.split(',')[0] },
        bodyBg: cs(document.body).backgroundColor, fonts: top(fonts, 4), colors: top(colors, 8),
        headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName + ': ' + t(h)).slice(0, 40),
        buttons: [...new Set([...document.querySelectorAll('a,button')].filter((e) => cs(e).borderRadius !== '0px' && t(e).length > 2 && t(e).length < 30).map((e) => t(e)))].slice(0, 12),
        radius: [...document.querySelectorAll('button,a[class*=btn],a[class*=button]')].slice(0, 3).map((e) => cs(e).borderRadius),
        height: document.documentElement.scrollHeight,
      };
    });
  } catch (e) { out[k] = { error: e.message.split('\n')[0] }; }
  await ctx.close();
}
fs.writeFileSync('research/summary.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
await b.close();
