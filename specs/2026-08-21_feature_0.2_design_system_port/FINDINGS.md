# Feature 0.2 — Design system port: Findings / Acceptance

**Status: DONE locally 2026-08-21 — 13 Astro components + 2 client islands, the
Home parity page, and a screenshot diff that re-derives its baseline from
`design-system/Home.dc.html` on every run. `astro check` clean, build green,
both visual tests pass. CI still has never run (no remote — inherited from 0.1).**

## Acceptance evidence

| Check | Result |
|---|---|
| `npx astro check` | ✅ 19 files, 0 errors / 0 warnings / 0 hints |
| `npm run build` | ✅ 1 page, 260 ms; `dist/index.html` 12 KB, CSS 24 KB |
| Visual diff vs `Home.dc.html` @ 1440×900 | ✅ **2113 of 4 821 760 px differ = 0.044%** (gate: 1%) |
| Both images the same height | ✅ 1440×3328 on both sides |
| 390×844 renders without horizontal overflow | ✅ `scrollWidth - clientWidth` = 0 |
| Theme switch applies + persists | ✅ click Verdant → `<html data-hmc-theme="verdant">`, `localStorage.hmc-theme="verdant"`, survives reload, `body` background = `#030803` |
| No flash of the default theme | ✅ attribute already correct at the first evaluable moment after navigation (inline blocking script, D3) |
| `aria-pressed` tracks the active theme | ✅ `['false','false','true']` |
| Mosaic runs once, then cleans up | ✅ 460 tiles at 150 ms → 0 tiles at 2.1 s |
| `prefers-reduced-motion: reduce` | ✅ 0 tiles ever built; chroma drift and status-dot flicker disabled in CSS |
| Page renders with JS disabled | ✅ `<h1>` present, theme falls back to `phosphor` |
| No token values copied into `src/` | ✅ `global.css` still `@import`s `design-system/styles.css` only |
| Raw hex colours in `src/` | ⚠️ 2, both verbatim from the `.jsx` specimens — see Deviations |

Diff artefacts on failure land in `test-results/` and are uploaded by CI.

## What the 2113 differing pixels are

Three known, deliberate spots — all documented below, none structural:

1. **Careers CTAs** — the prototype uses `padding: 15px 30px` there and
   `15px 28px` in the hero. `Button` has one `lg` size; it uses the hero's.
2. **Hero primary CTA text** — sub-pixel horizontal shift from `inline-flex`
   centring vs the prototype's blockified flex item.
3. **Theme-switcher dots** — antialiasing on three 15 px circles.

## Deviations from Roadmap / from the `.jsx` specimens

- **`ThemeSwitcher` and `MosaicLoader` ship as `.ts` + a thin `.astro` wrapper**,
  not `.ts` alone. The Roadmap names only the `.ts`; markup still has to live
  somewhere, and putting it in a sibling `.astro` keeps the logic importable and
  testable on its own. Same for `LangSwitch`, which the Roadmap already lists as
  `.astro`.
- **`Button`'s `outline` variant is signal-tinted, not green.** `Button.jsx` has
  `color: var(--green-200); borderColor: var(--line-green)`. Every secondary
  button on the shipped Home page is `border: 1px solid var(--line-signal)`.
  `readme.md` says the `.dc.html` pages are "where new patterns get proven
  before they're formalized below", so the page won. A fifth variant,
  `outline-signal`, covers the careers CTA, which is the same pattern with the
  label in `--signal` instead of `--text-hi`.
- **`Button` has no transparent border on the filled variants.** `Button.jsx`
  sets `border: 1px solid transparent` on every variant to keep sizes equal;
  that made every button 2 px taller and wider than the prototype's. The
  prototype relies on flex `align-items: stretch` to equalise a bordered
  secondary against an unbordered primary, and so does the port now.
- **`Button`'s `lg` size is `15px 28px` / `--fs-body` / `--lh-body`**, not
  `16px 30px` / `17px` / `line-height: 1`. Same reason: the page is the
  authority, and the old numbers put an 8 px error into every section below the
  hero.
- **`Input` has no focus state in JS.** `Input.jsx` holds a `useState` purely to
  recolour the label on focus; `.hmc-field:has(input:focus) label` does it with
  no island at all.
- **`GlitchText` is only `inline-block` in its `span` form.** As a heading it
  must be a block — `inline-block` adds the parent's line-box leading beneath
  it, which pushed the careers CTA row 16 px down.
- **Two raw hex values remain in `src/`:** `#ffb0a8` (Badge, error tone) and
  `#2a1c00` (Button, text on gold). Both are copied from the `.jsx` specimens
  and have no token to point at. The fix belongs in the design tool: add
  `--text-on-error` and `--text-on-signal` to `design-system/tokens/colors.css`,
  then these become `var()` like everything else. Marked with a `ponytail:`
  comment in `Badge.astro`.
- **`tsconfig.json` gained `compilerOptions.types: ["node"]`.** `astro check`
  covers `**/*`, which now includes `playwright.config.ts` and the spec's
  `node:fs` / `node:path` / `node:url` imports. `@types/node` added as a
  devDependency.
- **The 390 px case is an overflow assertion, not a screenshot diff.** The
  prototype has no media queries at all — its grids are fixed `repeat(2, …)` and
  `repeat(3, …)` and it overflows below ~760 px. A pixel diff there would be a
  test that the port is *also* broken. The port adds one breakpoint at 760 px
  (grids collapse to one column) and one at 900 px (the nav wraps its link row);
  the honest check is that it fits.

## Review pass (2026-08-21, post-`ddbc9ce`)

An over-engineering review of the commit found eight cuts; all eight applied:
**+42 / -69 across 10 files, net -27.** Pixel diff, tile count, theme
persistence, reduced-motion and no-JS behaviour all re-verified byte-identical
afterwards (2113 px, 460 → 0 tiles).

- `readTheme()` deleted — exported, zero callers. `Base.astro`'s inline script
  reads storage itself and the switcher syncs off the DOM attribute, so nothing
  replaced it.
- `MosaicLoader`'s `side`/`rows`/`cols` props, their `data-*` round-trip and the
  `MosaicOptions` interface deleted — one call site, `<MosaicLoader />`, passing
  nothing. The four numbers are module constants now and `connectedCallback` is
  `buildMosaic(this)`.
- `Card`'s `padding` prop deleted — a raw CSS string piped through an inline
  `--card-pad` custom property that no caller ever set. A caller needing
  different padding passes `class`.
- `Button` uses `class:list` like all five siblings, not a hand-rolled
  `.filter(Boolean).join(' ')`. It works on the dynamic tag.
- **`NAV_LINKS` and the `/^\/de(?=\/|$)/` strip moved to `src/lib/site.ts`.**
  The link array was duplicated verbatim in `Nav.astro` and `Footer.astro`, and
  the regex in `Nav.astro` and `LangSwitch.astro` — both would have diverged
  silently the moment `/challenge` landed. The regex duplication was the worse
  of the two: Nav uses it to decide which link is current and LangSwitch to
  decide which page each locale points at, so they have to strip *identically*
  or the two disagree about what page the visitor is on.
- `trace: 'on-first-retry'` deleted from the Playwright config — no `retries`
  configured and CI passes no `--retries`, so it could never fire. Failure
  artefacts still upload the snapshot diffs.

**Kept deliberately:** `Button`'s `signal` / `ghost` variants and `sm` size have
no caller yet. Cutting them was offered and declined: D5 makes preserving the
specimen prop APIs a standing rule, and Badge's four tones, Card's `grid` /
`glow` / `corners`, Input's `mono` / `hint` and StatReadout's tones are all
equally unused — those five components render nowhere on Home and are in scope
anyway per requirements §4. Trimming three of Button's options while keeping
every option on its siblings buys ~6 lines and costs the port its internal
consistency. Revisit as one pass across all six primitives, or not at all.

## Notes for later features

- **The visual baseline is never committed.** `tests/e2e/visual.spec.ts`
  screenshots `Home.dc.html` at the start of every run and writes it to
  `tests/e2e/__screenshots__/` (git-ignored). A prototype edit therefore *fails*
  this test rather than drifting past a stale PNG — and CI needs no font
  determinism, because both sides render in the same browser in the same run.
- **The intro mosaic must be hidden, not frozen, in any screenshot test.**
  `hmc-tile-out` is held open by `animation-fill-mode: forwards`; the usual
  `animation: none !important` drops that fill and pins all 460 tiles at
  opacity 1, which hides the hero on *both* pages and silently excludes it from
  the diff. The spec hides `span[style*="clip-path"]` instead — that selector
  catches the prototype's tiles and `MosaicLoader`'s alike.
- **Feature 0.3:** `Nav.astro` and `Footer.astro` already point at `/challenge`,
  `/knowledge` and `/about`, and `LangSwitch` at `/de/`. All four 404 until the
  pages exist. The `EMBODIMENTS` / `PILLARS` arrays in `index.astro` are the
  prototype's filler copy and move to `src/content/` unchanged.
- **Feature 0.3:** `Base.astro` omits `og:image` and the favicon entirely rather
  than pointing at files `public/` does not have yet. Both land with
  `public/assets/`.
- **Feature 0.3:** `tokens/fonts.css` `@import`s Google Fonts, so every visitor
  makes a third-party request on first paint. Self-hosting the three faces is
  the Lighthouse ≥ 95 lever and removes the render-blocking cross-origin hop.
- **The logo is imported, not copied:** `import logo from
  '../../design-system/assets/logo-mark-light.png'` runs through Astro's asset
  pipeline and emits a hashed file. Same one-source-of-truth rule as the tokens
  (D2 in 0.1), and it needs no `public/` duplicate.
