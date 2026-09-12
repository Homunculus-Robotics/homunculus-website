# Feature 0.3 — Plan

## Decisions

- **D1 — Two thin pages over one catch-all route.** `src/pages/index.astro` and
  `src/pages/de/index.astro` are three lines each and both render
  `src/layouts/Home.astro`. A `[...locale]` catch-all would be one file but
  swallows every future 404, and the Roadmap names both paths.
- **D2 — Frontmatter for structure, body for prose.** The landing copy is mostly
  short strings (headlines, CTA labels, three cards); those are frontmatter with
  a Zod schema, so a missing German string is a build error rather than an empty
  `<h2>`. The one genuinely long passage is the thesis, and that is the Markdown
  body — the only part that benefits from being Markdown at all.
- **D3 — Nav hrefs are built with `getRelativeLocaleUrl`.** `NAV_LINKS` keeps
  locale-agnostic paths and per-locale labels; Nav and Footer prefix them. One
  place decides, so the two can never disagree (they already share `localePath`).
- **D4 — The parity page moves, the test follows.** `src/pages/parity/home.astro`
  holds 0.2's frozen markup verbatim and is `noindex` + `Disallow`. Deleting the
  test instead would remove the only automated link between the components and
  `Home.dc.html`.
- **D5 — Apex domain via `public/CNAME`.** `homunculusrobotics.com`; DNS A
  records to GitHub's four Pages IPs are a manual step recorded in FINDINGS.
- **D6 — Fonts stay on Google Fonts until measured.** `design-system/tokens/fonts.css`
  is the design system's file and is not edited from the site. If Lighthouse
  misses 95 because of the remote `@import`, that is the finding that justifies
  changing it — not a guess beforehand.

## Steps

1. `src/content.config.ts` + `src/content/home/{en,de}.md` — schema and copy.
2. `src/layouts/Home.astro` — hero · products · thesis · challenge · contact,
   styles lifted from the 0.2 index (they already match the brand).
3. `src/pages/index.astro`, `src/pages/de/index.astro` — three lines each.
4. `src/pages/parity/home.astro` — 0.2's markup, `noindex`; `Base.astro` gains
   the `noindex` prop.
5. `src/lib/site.ts` — per-locale labels + `navHref()`; Nav and Footer use it.
6. `public/` — `CNAME`, `robots.txt`, `favicon.svg`, `assets/og-cover.png`.
7. `astro.config.mjs` — `site`.
8. `.github/workflows/pages.yml` — build + deploy on push to `master`.
9. `tests/e2e/landing.spec.ts`; retarget `tests/e2e/visual.spec.ts` at `/parity/home`.
10. Measure: `astro check`, build, both specs, Lighthouse. Write FINDINGS.

## Risks

- **The parity screenshot shifts because the nav is on a different route.** The
  "Sandbox" link loses its `current` underline at `/parity/home`. Measured
  against the 1% gate rather than assumed harmless; if it eats the budget, the
  parity page passes the flag explicitly.
- **Lighthouse ≥ 95 with a render-blocking Google Fonts `@import`.** Three
  families, one chained request. Fallback if it fails: `<link rel=preconnect>`
  in `Base.astro`, then self-hosting as a design-system change.
- **Pages + apex DNS is the one step that cannot be verified locally.** The
  workflow and CNAME land in this feature; A-record propagation is recorded as
  an open item, not claimed as done.
