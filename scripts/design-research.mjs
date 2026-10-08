import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

// Capture visual evidence independently of the earlier reference-site research.
// Optional overrides allow an existing browser installation to be reused.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = path.resolve('research/2026-10-06');
fs.mkdirSync(output, { recursive: true });
const sites = {
  ihiring: 'https://ihiring.ai',
  sarvam: 'https://www.sarvam.ai',
  alex: 'https://www.alex.com',
  heymilo: 'https://www.heymilo.ai',
  humanly: 'https://www.humanly.io',
  hirevue: 'https://www.hirevue.com',
  barraiser: 'https://www.barraiser.com',
  intervue: 'https://www.intervue.io',
  perfectly: 'https://www.perfectly.so',
};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const results = {};
for (const [name, url] of Object.entries(sites)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(output, `${name}-desktop.png`) });
    const desktop = await page.evaluate(() => {
      const style = (e) => getComputedStyle(e);
      const visible = (e) => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0;
      const headings = [...document.querySelectorAll('h1,h2,h3')].filter(visible);
      const fonts = {}, colors = {};
      for (const element of document.querySelectorAll('body *')) {
        if (!visible(element)) continue;
        const s = style(element);
        fonts[s.fontFamily] = (fonts[s.fontFamily] || 0) + 1;
        for (const color of [s.color, s.backgroundColor]) {
          if (color !== 'rgba(0, 0, 0, 0)') colors[color] = (colors[color] || 0) + 1;
        }
      }
      const top = (o) => Object.entries(o).sort((a,b) => b[1]-a[1]).slice(0, 10);
      return {
        title: document.title,
        url: location.href,
        headings: headings.slice(0, 45).map(e => ({ text: e.innerText, tag: e.tagName, font: style(e).fontFamily, size: style(e).fontSize, weight: style(e).fontWeight })),
        fonts: top(fonts), colors: top(colors),
        videos: [...document.querySelectorAll('video')].map(e => ({ src: e.currentSrc || e.src, autoplay: e.autoplay, muted: e.muted, loop: e.loop })),
        iframes: [...document.querySelectorAll('iframe')].map(e => e.src),
        runningAnimations: document.getAnimations().slice(0, 20).map(a => ({ state: a.playState, duration: a.effect?.getTiming().duration, iterations: String(a.effect?.getTiming().iterations) })),
        scriptSources: [...document.scripts].map(e => e.src).filter(Boolean),
        height: document.documentElement.scrollHeight,
      };
    });
    // Trigger lazy-loaded sections and capture two actual scroll states.
    for (const [label, y] of [['product', 950], ['story', 2100]]) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(output, `${name}-${label}.png`) });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(output, `${name}-mobile.png`) });
    results[name] = { capturedAt: new Date().toISOString(), desktop, mobile: await page.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth })) };
    console.log(`${name}: ${desktop.title}`);
  } catch (error) {
    results[name] = { url, error: error.message };
    console.log(`${name}: ${error.message.split('\n')[0]}`);
  } finally {
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(output, 'observations.json'), JSON.stringify(results, null, 2));
