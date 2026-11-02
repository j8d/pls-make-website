// Design-phase check: screenshots key states, exercises menu + font picker, runs axe.
// Usage: node scripts/preview-check.mjs [baseUrl]   (serve ./site first, e.g. `npm run serve`)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:4173/';
const out = 'artifacts';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const log = (...a) => console.log(...a);
let failures = 0;
const check = (ok, msg) => { log(ok ? 'PASS' : 'FAIL', msg); if (!ok) failures++; };

async function page(opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1440, height: 900 }, reducedMotion: opts.reducedMotion || 'no-preference', javaScriptEnabled: opts.js !== false, deviceScaleFactor: opts.dpr || 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return { p, ctx, errors };
}

async function loadLazy(p) {
  await p.evaluate(() => document.querySelectorAll('#fonts, #fast, #menus').forEach((e) => (e.style.contentVisibility = 'visible')));
  await p.locator('.bleed img').scrollIntoViewIfNeeded();
  await p.waitForFunction(() => { const i = document.querySelector('.bleed img'); return i.complete && i.naturalWidth > 0; });
  await p.evaluate(() => document.fonts.ready);
}

// Desktop default
{
  const { p, ctx, errors } = await page();
  await p.screenshot({ path: `${out}/desktop-1440-hero.png` });
  await loadLazy(p);
  check(await p.evaluate(() => /\.avif$/.test(document.querySelector('.bleed img').currentSrc)), 'BIG picture served as AVIF');
  await p.locator('#big-pictures').scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${out}/desktop-1440-big-picture.png` });
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await p.screenshot({ path: `${out}/desktop-1440-full.png`, fullPage: true });
  const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  check(axe.violations.length === 0, `axe desktop: ${axe.violations.map((v) => `${v.id}(${v.nodes.length})`).join(', ') || 'no violations'}`);

  // Menu via keyboard: focus button, Enter, check focus inside, Esc returns focus.
  await p.keyboard.press('Tab'); // skip link
  await p.keyboard.press('Tab'); // wordmark
  await p.keyboard.press('Tab'); // menu button
  check(await p.evaluate(() => document.activeElement.classList.contains('menu-btn')), 'Tab order reaches menu button third');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(700);
  check(await p.evaluate(() => document.getElementById('menu').open && document.getElementById('menu').contains(document.activeElement)), 'menu opens with focus inside');
  await p.screenshot({ path: `${out}/desktop-1440-menu-open.png` });
  const axeMenu = await new AxeBuilder({ page: p }).include('#menu').analyze();
  check(axeMenu.violations.length === 0, `axe menu: ${axeMenu.violations.map((v) => v.id).join(', ') || 'no violations'}`);
  for (let i = 0; i < 10; i++) await p.keyboard.press('Tab');
  check(await p.evaluate(() => document.getElementById('menu').contains(document.activeElement)), 'focus stays in menu after 10 Tabs');
  await p.keyboard.press('Escape');
  check(await p.evaluate(() => !document.getElementById('menu').open && document.activeElement.classList.contains('menu-btn')), 'Esc closes menu and returns focus to button');

  // Menu link navigates and moves focus to section.
  await p.click('.menu-btn');
  await p.waitForTimeout(600);
  await p.click('#menu a[href="#fonts"]');
  await p.waitForTimeout(300);
  check(await p.evaluate(() => location.hash === '#fonts' && document.activeElement.id === 'fonts' && !document.getElementById('menu').open), 'menu link closes menu, sets hash, focuses #fonts');

  // Font picker persists.
  await p.check('input[value="comic"]');
  check(await p.evaluate(() => document.documentElement.dataset.font === 'comic' && localStorage.getItem('pmw-font') === 'comic'), 'font switch applies + saves');
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/desktop-1440-fonts-comic.png` });
  await p.reload({ waitUntil: 'networkidle' });
  check(await p.evaluate(() => document.documentElement.dataset.font === 'comic' && document.querySelector('input[value="comic"]').checked), 'font choice restored after reload');
  await p.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/desktop-1440-hero-comic.png` });
  await p.check('input[value="8bit"]');
  await p.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/desktop-1440-hero-8bit.png` });
  await p.check('input[value="fancy"]');
  await p.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/desktop-1440-hero-fancy.png` });
  check(errors.length === 0, `desktop console errors: ${errors.join(' | ') || 'none'}`);
  await ctx.close();
}

// Mobile widths
for (const width of [320, 390]) {
  const { p, ctx, errors } = await page({ viewport: { width, height: 800 }, dpr: 2 });
  await p.screenshot({ path: `${out}/mobile-${width}-hero.png` });
  check(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px: no horizontal overflow`);
  await loadLazy(p);
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await p.screenshot({ path: `${out}/mobile-${width}-full.png`, fullPage: true });
  await p.click('.menu-btn');
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/mobile-${width}-menu-open.png` });
  const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  check(axe.violations.length === 0, `axe ${width}px menu-open: ${axe.violations.map((v) => v.id).join(', ') || 'no violations'}`);
  check(errors.length === 0, `${width}px console errors: ${errors.join(' | ') || 'none'}`);
  await ctx.close();
}

// Reduced motion: menu opens with no animation.
{
  const { p, ctx } = await page({ reducedMotion: 'reduce', viewport: { width: 390, height: 800 } });
  await p.click('.menu-btn');
  const anim = await p.evaluate(() => getComputedStyle(document.getElementById('menu')).animationName);
  check(anim === 'none', `reduced motion: menu animation = ${anim}`);
  await ctx.close();
}

// No-JS: inline nav visible, menu button hidden, anchors work, :has() font picker still switches.
{
  const { p, ctx } = await page({ js: false, viewport: { width: 390, height: 800 } });
  check(await p.isVisible('.nav-inline') && !(await p.isVisible('.menu-btn')), 'no-JS: inline nav visible, menu button hidden');
  await p.screenshot({ path: `${out}/nojs-390-hero.png` });
  await p.click('.nav-inline a[href="#big-pictures"]');
  check(p.url().endsWith('#big-pictures'), 'no-JS: anchor nav works');
  await p.check('input[value="fancy"]');
  const fam = await p.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily);
  check(fam.includes('Fraunces'), `no-JS: font picker switches via :has() (${fam.split(',')[0]})`);
  await ctx.close();
}

await browser.close();
log(failures ? `${failures} check(s) failed` : 'all checks passed');
process.exit(failures ? 1 : 0);
