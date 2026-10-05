// Headless scrape of ihiring.ai -> site.config.json + assets/ + screenshots/
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ORIGIN = 'https://ihiring.ai';
const OUT = path.resolve('.');
const dirs = ['assets/images', 'assets/logos', 'assets/fonts', 'assets/svg', 'assets/icons', 'assets/other', 'screenshots', 'raw'];
for (const d of dirs) await fs.mkdir(path.join(OUT, d), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const downloaded = new Map(); // url -> local path
const netLog = [];

const safeName = (u, ct = '') => {
  const url = new URL(u);
  let base = path.basename(url.pathname) || 'index';
  base = decodeURIComponent(base).replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!path.extname(base)) {
    const ext = ct.includes('svg') ? '.svg' : ct.includes('png') ? '.png' : ct.includes('jpeg') ? '.jpg' : ct.includes('webp') ? '.webp' : ct.includes('woff2') ? '.woff2' : '';
    base += ext;
  }
  if (url.search) base = crypto.createHash('md5').update(url.search).digest('hex').slice(0, 6) + '_' + base;
  return base;
};

const bucket = (u, ct) => {
  if (/font|woff|ttf|otf/.test(ct) || /\.(woff2?|ttf|otf)(\?|$)/.test(u)) return 'fonts';
  if (/svg/.test(ct) || /\.svg(\?|$)/.test(u)) return /logo/i.test(u) ? 'logos' : 'svg';
  if (/logo/i.test(u)) return 'logos';
  if (/icon|favicon/i.test(u)) return 'icons';
  if (/^image\//.test(ct)) return 'images';
  return 'other';
};

async function save(response) {
  try {
    const u = response.url();
    if (u.startsWith('data:') || downloaded.has(u)) return;
    const ct = response.headers()['content-type'] || '';
    const isAsset = /^image\/|font|woff|video\/|application\/pdf/.test(ct) || /\.(png|jpe?g|webp|gif|svg|ico|avif|woff2?|ttf|otf|mp4|webm|pdf)(\?|$)/i.test(u);
    netLog.push({ url: u, status: response.status(), type: ct });
    if (!isAsset || response.status() !== 200) return;
    const body = await response.body();
    const b = bucket(u, ct);
    const name = safeName(u, ct);
    const rel = path.join('assets', b, name);
    await fs.writeFile(path.join(OUT, rel), body);
    downloaded.set(u, rel);
  } catch {}
}

const extract = () => {
  const txt = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
  const cs = (el) => getComputedStyle(el);
  const meta = {};
  document.querySelectorAll('meta').forEach((m) => {
    const k = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('http-equiv');
    if (k) meta[k] = m.getAttribute('content');
  });
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ tag: h.tagName.toLowerCase(), text: txt(h) }));
  const links = [...document.querySelectorAll('a[href]')].map((a) => ({ text: txt(a), href: abs(a.getAttribute('href')), target: a.target || null, aria: a.getAttribute('aria-label') }));
  const buttons = [...document.querySelectorAll('button,[role=button],a.btn,a[class*=button],a[class*=btn]')].map((b) => ({ text: txt(b), href: b.href || null, aria: b.getAttribute('aria-label') }));
  const images = [...document.querySelectorAll('img')].map((i) => ({ src: abs(i.currentSrc || i.src), alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, cls: i.className, inHeader: !!i.closest('header,nav'), inFooter: !!i.closest('footer') }));
  const svgs = [...document.querySelectorAll('svg')].map((s, idx) => ({ idx, inHeader: !!s.closest('header,nav'), inFooter: !!s.closest('footer'), parent: s.parentElement?.tagName, label: s.getAttribute('aria-label') || s.querySelector('title')?.textContent || null, w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height, markup: s.outerHTML.length < 20000 ? s.outerHTML : null }));
  const bgImages = [...document.querySelectorAll('*')].map((el) => ({ el, bg: cs(el).backgroundImage })).filter((x) => x.bg && x.bg !== 'none').map((x) => ({ tag: x.el.tagName.toLowerCase(), cls: String(x.el.className).slice(0, 80), bg: x.bg.slice(0, 400) }));
  const videos = [...document.querySelectorAll('video,iframe')].map((v) => ({ tag: v.tagName.toLowerCase(), src: abs(v.currentSrc || v.src || ''), poster: v.poster || null }));
  const forms = [...document.querySelectorAll('form')].map((f) => ({ action: f.action, method: f.method, fields: [...f.querySelectorAll('input,select,textarea,button')].map((i) => ({ tag: i.tagName.toLowerCase(), type: i.type, name: i.name, placeholder: i.placeholder, label: i.getAttribute('aria-label'), text: i.tagName === 'BUTTON' ? txt(i) : undefined, options: i.tagName === 'SELECT' ? [...i.options].map((o) => o.text) : undefined })) }));

  // Section-level structure with full text, in DOM order
  const sectionEls = [...document.querySelectorAll('header, nav, main > *, main section, body > div > section, section, footer')];
  const seen = new Set();
  const sections = [];
  for (const el of sectionEls) {
    if (seen.has(el) || [...seen].some((s) => s.contains(el) && s !== el && el.tagName !== 'FOOTER' && el.tagName !== 'HEADER')) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.height < 20) continue;
    const st = cs(el);
    sections.push({
      tag: el.tagName.toLowerCase(), id: el.id || null, cls: String(el.className).slice(0, 120),
      top: Math.round(r.top + scrollY), height: Math.round(r.height),
      bg: st.backgroundColor, color: st.color,
      headings: [...el.querySelectorAll('h1,h2,h3,h4')].map((h) => txt(h)),
      text: txt(el),
      links: [...el.querySelectorAll('a[href]')].map((a) => ({ text: txt(a), href: abs(a.getAttribute('href')) })),
      images: [...el.querySelectorAll('img')].map((i) => ({ src: abs(i.currentSrc || i.src), alt: i.alt })),
    });
  }

  // Full visible text, block by block, to guarantee nothing is lost
  const blocks = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  const BLOCK = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BUTTON', 'A', 'SPAN', 'LABEL', 'FIGCAPTION', 'BLOCKQUOTE', 'TD', 'TH', 'DT', 'DD', 'SUMMARY']);
  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (!BLOCK.has(el.tagName)) continue;
    if ([...el.children].some((c) => BLOCK.has(c.tagName) && txt(c) === txt(el))) continue;
    const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
    if (t) blocks.push({ tag: el.tagName.toLowerCase(), text: t, y: Math.round(el.getBoundingClientRect().top + scrollY) });
  }

  // Design tokens
  const colorCount = {}; const fontCount = {}; const sizeCount = {};
  document.querySelectorAll('body *').forEach((el) => {
    const s = cs(el);
    if (!el.childNodes.length) return;
    [s.color, s.backgroundColor, s.borderTopColor].forEach((c) => { if (c && c !== 'rgba(0, 0, 0, 0)') colorCount[c] = (colorCount[c] || 0) + 1; });
    fontCount[s.fontFamily] = (fontCount[s.fontFamily] || 0) + 1;
    sizeCount[s.fontSize + '/' + s.fontWeight] = (sizeCount[s.fontSize + '/' + s.fontWeight] || 0) + 1;
  });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const rootVars = {};
  for (const sheet of document.styleSheets) {
    try { for (const rule of sheet.cssRules) if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') for (const p of rule.style) if (p.startsWith('--')) rootVars[p] = rule.style.getPropertyValue(p).trim(); } catch {}
  }
  const bodyS = cs(document.body);
  const icons = [...document.querySelectorAll('link[rel*=icon],link[rel=manifest],link[rel=apple-touch-icon]')].map((l) => ({ rel: l.rel, href: abs(l.href), sizes: l.sizes?.value }));
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
  const nextData = document.getElementById('__NEXT_DATA__')?.textContent || null;

  return {
    url: location.href, title: document.title, lang: document.documentElement.lang, meta, icons, jsonld, hasNextData: !!nextData,
    headings, sections, blocks, links, buttons, images, svgs, bgImages, videos, forms,
    designTokens: { bodyBg: bodyS.backgroundColor, bodyColor: bodyS.color, bodyFont: bodyS.fontFamily, topColors: top(colorCount, 15), topFonts: top(fontCount, 6), topTypeScale: top(sizeCount, 15), rootVars },
    pageHeight: document.documentElement.scrollHeight,
  };
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0; const step = 500;
      const t = setInterval(() => { window.scrollBy(0, step); y += step; if (y >= document.documentElement.scrollHeight + 600) { clearInterval(t); res(); } }, 250);
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
}

async function scrapePage(url, slug) {
  const page = await ctx.newPage();
  page.on('response', save);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log('goto warn', e.message));
  await page.waitForTimeout(1500);
  await autoScroll(page);
  const data = await page.evaluate(extract);
  const html = await page.content();
  await fs.writeFile(path.join(OUT, 'raw', `${slug}.html`), html);
  await page.screenshot({ path: path.join(OUT, 'screenshots', `${slug}-desktop-full.png`), fullPage: true }).catch(() => {});
  await page.screenshot({ path: path.join(OUT, 'screenshots', `${slug}-desktop-fold.png`) }).catch(() => {});
  // per-section crops for the home page
  if (slug === 'home') {
    let i = 0;
    for (const s of data.sections.slice(0, 25)) {
      i++;
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, s.top - 20));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, 'screenshots', `home-section-${String(i).padStart(2, '0')}-${s.tag}.png`), clip: { x: 0, y: 0, width: 1440, height: 900 } }).catch(() => {});
    }
  }
  const m = await ctx.newPage();
  await m.setViewportSize({ width: 390, height: 844 });
  m.on('response', save);
  await m.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await autoScroll(m);
  await m.screenshot({ path: path.join(OUT, 'screenshots', `${slug}-mobile-full.png`), fullPage: true }).catch(() => {});
  await m.close();
  await page.close();
  return data;
}

// Crawl: home first, then every internal link discovered (depth 2, capped)
const pages = {};
const queue = [[ORIGIN + '/', 'home']];
const visited = new Set();
while (queue.length && visited.size < 25) {
  const [url, slug] = queue.shift();
  const key = url.replace(/#.*$/, '').replace(/\/$/, '');
  if (visited.has(key)) continue;
  visited.add(key);
  console.log('scraping', url);
  const data = await scrapePage(url, slug);
  pages[slug] = data;
  for (const l of data.links) {
    try {
      const u = new URL(l.href);
      if (u.origin !== ORIGIN) continue;
      const k = (u.origin + u.pathname).replace(/\/$/, '');
      if (visited.has(k) || queue.some(([q]) => q.replace(/\/$/, '') === k)) continue;
      if (/\.(png|jpe?g|svg|pdf|webp|ico)$/i.test(u.pathname)) continue;
      queue.push([u.origin + u.pathname, (u.pathname.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home')]);
    } catch {}
  }
}

// Extra: robots, sitemap, llms
const extras = {};
for (const p of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/manifest.json', '/site.webmanifest']) {
  try { const r = await ctx.request.get(ORIGIN + p); if (r.ok()) extras[p] = (await r.text()).slice(0, 20000); } catch {}
}

// External links grouped
const external = new Set();
Object.values(pages).forEach((p) => p.links.forEach((l) => { try { if (new URL(l.href).origin !== ORIGIN) external.add(l.href); } catch {} }));

const config = {
  site: { origin: ORIGIN, scrapedAt: new Date().toISOString(), pagesScraped: Object.keys(pages) },
  pages,
  externalLinks: [...external],
  extras,
  assets: Object.fromEntries(downloaded),
  network: netLog,
};
await fs.writeFile(path.join(OUT, 'site.config.json'), JSON.stringify(config, null, 2));
await browser.close();
console.log('DONE. pages:', Object.keys(pages).length, 'assets:', downloaded.size);
