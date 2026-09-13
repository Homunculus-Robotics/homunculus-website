import { expect, test } from '@playwright/test';

const SITE = 'https://homunculusrobotics.com';

test('the German page keeps every internal link on /de/', async ({ page }) => {
  await page.goto('/de/');
  const hrefs = await page.locator('header nav a, footer nav a').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href') ?? ''),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) expect(href).toMatch(/^\/de(\/|$)/);
  await expect(page.locator('header nav a').first()).toHaveText('Sandkasten');
  await expect(page.locator('header nav a').first()).toHaveAttribute('href', '/de/sandbox/');
});

test('the Sandbox page is its own page, in both locales', async ({ page }) => {
  for (const [path, lang, headline, kicker] of [
    ['/sandbox', 'en', 'Snap parts together. The engine says yes or no.', 'Assemble'],
    ['/de/sandbox', 'de', 'Teile zusammenstecken. Die Engine sagt Ja oder Nein.', 'Zusammenbauen'],
  ]) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('#top h1')).toHaveText(headline);
    await expect(page.locator('#walls li')).toHaveCount(3);
    await expect(page.locator('#loop li')).toHaveCount(3);
    await expect(page.locator('#loop')).toContainText(kicker);
    await expect(page.locator('#gate .hmc-stat')).toHaveCount(3);
    await expect(page.locator('#access a[href^="mailto:"]')).toHaveCount(1);
  }
});

test('the landing page teases the sandbox instead of being it', async ({ page }) => {
  await page.goto('/');
  await page.locator('#products h3 a').click();
  await expect(page).toHaveURL(/\/sandbox\/$/);
});

test('each locale renders its own copy, all four sections, and links to the other', async ({
  page,
}) => {
  for (const [path, lang, headline, contact, sibling] of [
    ['/', 'en', 'The next generation of robots starts here.', 'Talk to us', 'DE'],
    ['/de/', 'de', 'Die nächste Generation von Robotern beginnt hier.', 'Kontakt', 'EN'],
  ]) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('#top h1')).toHaveText(headline);
    await expect(page.locator('#products li')).toHaveCount(3);
    await expect(page.locator('#products')).toContainText('BuilderLayer');
    await expect(page.locator('#challenge')).toBeVisible();
    await expect(page.locator('#contact')).toContainText(contact);
    await expect(page.locator('#contact a[href^="mailto:"]')).toHaveCount(1);
    // Exact: "Design Challenge" also contains "DE".
    await page.getByRole('link', { name: sibling, exact: true }).click();
    // The EN link off /de/ lands on the site root, whatever port it is on.
    await expect(page).toHaveURL(path === '/' ? /\/de\/$/ : /^https?:\/\/[^/]+\/$/);
  }
});

test('canonical, alternates and og:image are absolute and locale-correct', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `${SITE}/de/`);
  await expect(page.locator('link[hreflang=en]')).toHaveAttribute('href', `${SITE}/`);
  await expect(page.locator('link[hreflang=de]')).toHaveAttribute('href', `${SITE}/de/`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${SITE}/assets/og-cover.png`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'de_DE');
});

test('the theme switcher persists across a reload on /de/', async ({ page }) => {
  await page.goto('/de/');
  await page.getByRole('button', { name: /verdant/i }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-hmc-theme', 'verdant');
});

test('no horizontal overflow at 390 px, either locale', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/de/', '/sandbox/', '/de/sandbox/']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
