# Feature 0.2 — Design system port: Requirements

> **One sentence:** Turn the four frozen `.dc.html` prototypes into real,
> reusable Astro components that render the brand from the same tokens the
> design tool edits, so the site and the specimens can never drift apart.

---

## Context

`design-system/` holds the visual authority: seven token files behind one
entry point (`styles.css`), nine React specimen components under
`components/`, and four `*.dc.html` prototypes written in the Claude design
tool's dialect (`<x-dc>`, `{{ }}` bindings, `style-hover=` attributes,
`support.js`). The prototypes are ahead of `ui_kits/marketing/` and are the
canonical reference for how the system is used in product (`readme.md`).

None of it is runnable as a website. The `.jsx` specimens are React and the
site is Astro-with-no-framework; the `.dc.html` files need a 67 KB runtime to
render at all. This feature translates both into Astro components without
copying a single token value.

## Scope (from Roadmap Feature 0.2)

1. `src/styles/global.css` — already imports `design-system/styles.css` (done
   in 0.1). **Tokens are never copied into `src/`** (D2 in 0.1).
2. `src/layouts/Base.astro` — html shell, `data-hmc-theme`, DE/EN `<html lang>`,
   meta/OG.
3. `src/components/Nav.astro`, `Footer.astro`, `ThemeSwitcher.ts`,
   `LangSwitch.astro`.
4. `src/components/{Button,Badge,Card,Input,GlitchText,StatReadout}.astro`.
5. `src/components/MosaicLoader.ts` — the triangle-dissolve intro, one
   implementation, not the three copies in the prototypes.

## Out of scope

- Real bilingual copy, the `/de/` route, content collections, the Pages
  workflow — all Feature 0.3.
- The About and Design Challenge prototypes. Only `Home.dc.html` is the parity
  target; the other two reuse the same components in later features.
- `PortraitFrame` (shelved exploration, `Portrait Options.dc.html`).

## Acceptance

- A page built only from these components is visually indistinguishable from
  `design-system/Home.dc.html` at 1440×900 and 390×844.
- `npx astro check` clean, `npm run build` green.
- Theme switch persists across a reload and applies before first paint (no
  flash of the default theme).
- Reduced-motion users get no mosaic dissolve and no chroma drift.
- Every colour, size and easing on the page resolves to a token from
  `design-system/tokens/` — `grep -c '#[0-9a-fA-F]\{6\}' src/` outside of
  documented exceptions is 0.

## Test

`npx playwright test tests/e2e/visual.spec.ts` — screenshot diff of the built
page against the prototype, threshold 1%.

## Decisions

- **D1 — Astro `<style>` blocks with classes, not the prototype's inline
  styles.** The prototype inlines everything because the design tool has no
  stylesheet of its own, and it fakes hover with a `style-hover=` attribute
  that only `support.js` understands. Both are tool artefacts, not brand
  decisions. Scoped `<style>` gives real `:hover`, `:focus-visible` and media
  queries, and keeps the HTML readable.
- **D2 — parity page is `src/pages/index.astro`.** The acceptance criterion
  needs "a page built only from these components" that matches
  `Home.dc.html`; 0.3 needs a landing page at `/`. Building one page serves
  both — 0.3 then only adds the copy, the `/de/` route and deployment.
- **D3 — theme applied by a blocking inline script in `<head>`.** Any deferred
  or module script paints the default theme first. Four lines inline, before
  the stylesheet's first use, is the only way to avoid the flash without SSR
  cookies (and `output: 'static'` has no request to read).
- **D4 — MosaicLoader builds its tiles client-side.** 460 `<span>`s server-
  rendered is ~40 KB of markup for a half-second decoration on a page whose
  0.3 budget is `<300 KB`. It is also purely decorative (`aria-hidden`), so JS
  is an acceptable dependency: no JS = no loader = the page underneath, which
  is the correct degraded state.
- **D5 — the specimen `.jsx` files are read, not imported.** They are React,
  the site ships no framework, and `design-system/` is read-only to `src/`
  (AGENTS.md). Their prop APIs are preserved so the two stay comparable.
