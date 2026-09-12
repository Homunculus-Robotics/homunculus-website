# Feature 0.2 — Plan

## Files

| File | Content |
|---|---|
| `src/layouts/Base.astro` | `<html lang>` from `Astro.currentLocale`, meta/OG/canonical, the pre-paint theme script (D3), `global.css`, slot |
| `src/lib/site.ts` | `NAV_LINKS` + `localePath()` — shared by `Nav`, `Footer` and `LangSwitch` |
| `src/components/ThemeSwitcher.ts` | `applyTheme` + a `<hmc-theme-switcher>` custom element wrapping the three dots |
| `src/components/ThemeSwitcher.astro` | markup for the three dots; loads the `.ts` island |
| `src/components/LangSwitch.astro` | EN / DE pair, current locale lit in `--accent` |
| `src/components/Nav.astro` | sticky, blurred, logo + links + ThemeSwitcher + LangSwitch |
| `src/components/Footer.astro` | logo, `© 2026`, mono link row |
| `src/components/Button.astro` | `variant` primary/signal/outline/outline-signal/ghost, `size` sm/md/lg, `mono`, `glow`, `href` → `<a>` |
| `src/components/Badge.astro` | `tone` green/gold/neutral/error, `live` dot |
| `src/components/Card.astro` | `grid`, `glow`, `corners` |
| `src/components/Input.astro` | `label`, `hint`, `mono`; focus state in CSS, not JS |
| `src/components/GlitchText.astro` | `as`, `font` display/glitch/serif, `always`; hover RGB-split |
| `src/components/StatReadout.astro` | `value`, `unit`, `label`, `tone`, `align` |
| `src/components/MosaicLoader.ts` | triangle tiling + dissolve, `prefers-reduced-motion` aware (D4) |
| `src/components/MosaicLoader.astro` | the `aria-hidden` host element + the island; no props |
| `src/pages/index.astro` | the Home parity page (D2) — replaces the 0.1 placeholder |
| `tests/e2e/visual.spec.ts` | 1440×900 screenshot diff vs `Home.dc.html`, 1% threshold; 390×844 overflow assertion (see Risks) |
| `playwright.config.ts` | webServer `npm run build && npm run preview`, chromium, deterministic snapshot path |

> The table above tracks the files as shipped. The **Order** and **Risks**
> sections below are the plan as written before the work and are left as-is —
> what actually happened, and why it diverged, is `FINDINGS.md`'s job.

## Order

1. `Base.astro` + theme island — everything else renders inside it.
2. Primitives (`Button`, `Badge`, `Card`, `Input`, `GlitchText`, `StatReadout`)
   ported one-for-one from the `.jsx` prop APIs (D5).
3. `Nav` / `Footer` / `LangSwitch` / `MosaicLoader`.
4. `index.astro` — assemble the five Home sections from the above.
5. Playwright config + visual spec; capture baselines at both viewports.
6. `astro check`, `build`, then FINDINGS.

## Risks

- **The prototype needs `support.js` to render.** If it will not render from
  `file://` in headless chromium, the diff target becomes a committed baseline
  screenshot captured from the prototype in a real browser instead.
- **Google Fonts is a network dependency** (`tokens/fonts.css` `@import`s it).
  A screenshot diff in CI without network will differ everywhere. Mitigation:
  the visual spec is a local gate, not a CI gate, until 0.3 self-hosts fonts.
- **The prototype is not responsive.** Its grids are fixed `repeat(2, …)` /
  `repeat(3, …)` with no media queries, so at 390px it overflows. The port
  adds media queries — meaning the 390px diff will *not* match, by design.
  Recorded as a deviation, not a failure; 1440px is the real parity gate.
