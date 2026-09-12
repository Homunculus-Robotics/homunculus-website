import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// design-system/Home.dc.html is the visual authority (design-system/AGENTS.md).
// Since 0.3 the real landing page is /, which has its own copy and sections; the
// frozen parity markup lives at /parity/home and is what this diff compares. The
// guard is on the components, which is all it was ever able to guard.
// The baseline is re-captured from it on every run rather than committed as a
// PNG, so a prototype edit fails this test instead of silently drifting away
// from a stale snapshot.
const PROTOTYPE = pathToFileURL(resolve('design-system/Home.dc.html')).href;
const BASELINE = resolve('tests/e2e/__screenshots__/home-1440.png');
const PARITY = '/parity/home';

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

/** Freeze everything that moves, then wait for the webfonts. */
async function settle(page: Page) {
  await page.addStyleTag({
    content: [
      '*,*::before,*::after{animation:none!important;transition:none!important}',
      // The intro mosaic is a one-shot dissolve held open by `forwards`. Killing
      // animations drops that fill and pins all 460 tiles at opacity 1 — which
      // would hide the hero on both pages and quietly exclude it from the diff.
      // Both the prototype's tiles and MosaicLoader's carry an inline clip-path.
      'span[style*="clip-path"]{display:none!important}',
    ].join(''),
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

test('the parity page at 1440×900 matches design-system/Home.dc.html', async ({ page }) => {
  await page.setViewportSize(DESKTOP);

  await page.goto(PROTOTYPE);
  // The prototype renders through support.js — nothing exists until it runs.
  await page.waitForSelector('h1', { timeout: 15_000 });
  await settle(page);
  mkdirSync(dirname(BASELINE), { recursive: true });
  writeFileSync(BASELINE, await page.screenshot({ fullPage: true }));

  await page.goto(PARITY);
  await settle(page);
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('home-1440.png', {
    maxDiffPixelRatio: 0.01,
  });
});

test('the parity page at 390×844 renders without horizontal overflow', async ({ page }) => {
  // Deliberately not a diff: the prototype has no media queries and overflows
  // at this width (specs/2026-08-21_feature_0.2_design_system_port/plan.md,
  // Risks). The port adds one breakpoint, so the honest check is that it fits.
  await page.setViewportSize(MOBILE);
  await page.goto(PARITY);
  await settle(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
