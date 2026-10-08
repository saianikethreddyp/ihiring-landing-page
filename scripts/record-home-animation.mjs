import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: process.env.QA_VIDEO_DIR || '/var/folders/jf/xycyr1pd3_5gtgj12hjb84x80000gn/T/opencode',
    size: { width: 1440, height: 900 },
  },
});
const page = await context.newPage();
await page.goto(process.env.QA_URL || 'http://127.0.0.1:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.getByRole('button', { name: 'Replay hero animation' }).click();
await page.mouse.move(10, 10);
await page.waitForTimeout(13000);
const video = page.video();
await context.close();
await video.saveAs('screenshots/conversation-engine.webm');
await browser.close();
console.log('Saved a complete live SVG animation cycle to screenshots/conversation-engine.webm');
