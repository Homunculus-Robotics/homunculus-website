# Feature 0.3 — Landing page live on GitHub Pages: Requirements

> **One sentence:** A real URL exists — `https://homunculusrobotics.com` serves a
> bilingual landing page built from the 0.2 components, with its copy in
> `src/content/` instead of hard-coded in the page.

---

## Context

After 0.2 the site is one page: `src/pages/index.astro`, a pixel-parity clone of
`design-system/Home.dc.html` with its copy inlined as two arrays and its
sections chosen by the prototype (hero · embodiments · thesis · specs · careers).
It is a port artefact, not a landing page: no German route, no product lines, no
contact, no deploy.

0.3 turns it into the real Home and puts it on the internet.

## Scope (from Roadmap Feature 0.3)

1. `src/pages/index.astro` + `src/pages/de/index.astro` — hero, the three
   product lines (Sandbox · Learner · Hardware Kit), Design Challenge teaser,
   contact.
2. `src/content/` — copy as Markdown, DE + EN. Replaces the filler.
3. `.github/workflows/pages.yml` — build + deploy to GitHub Pages.
4. `public/assets/` — logo marks, `robots.txt`, favicon.

## Requirements

### R1 — One markup, two locales
The German page is not a copy of the English page. Both `/` and `/de/` render
the same Astro component; only the content entry differs. A section added once
appears in both languages or fails the build (schema).

### R2 — Copy lives in `src/content/`, not in the page
`src/content/home/{en,de}.md`, validated by a Zod schema in
`src/content.config.ts`. Structured strings (headlines, CTA labels, the three
product cards) are frontmatter; the "why we exist" prose is the Markdown body
and renders through `render()`. Adding a language later is one file.

### R3 — The chrome is bilingual too
Nav and Footer labels and hrefs are locale-aware: on `/de/` every internal link
points at `/de/…`. `LangSwitch` already maps a page to its sibling locale and
must keep doing so from every route.

### R4 — Real product copy, sourced
The three product lines are described from the product repos' own Mission docs
(`BuilderLayer`, `Homunculus_AI`, `Homunculus_Robotics_Hardware`). No claim on
the page that those docs do not support — the same rule Roadmap 4.1 sets for the
full product pages.

### R5 — Deployable, and deployed by pushing
`astro build --site https://homunculusrobotics.com` → GitHub Pages via
`.github/workflows/pages.yml` on push to `master`. Apex domain, so `public/CNAME`
carries `homunculusrobotics.com` and HTTPS is GitHub's enforced certificate.

### R6 — The design-system regression guard survives
0.2's pixel diff against `Home.dc.html` must keep running after the real Home
diverges from the prototype. The frozen markup moves to a `noindex` parity route
and `test:visual` follows it; the guard then protects the *components*, which is
what it was ever able to protect.

### R7 — Performance and correctness gates
- Lighthouse performance ≥ 95 on the built page.
- Both `/` and `/de/` render, and each links to the other.
- Theme switcher persists across a reload on both routes.
- No horizontal overflow at 390 px.
- `robots.txt` allows the site and excludes the parity route.

## Out of scope

- The pages behind the nav (`/challenge`, `/knowledge`, `/about`) — 2.1, 4.2, 4.2.
- A sitemap (no second page to index yet), analytics (3.4), legal pages (3.4).
- Self-hosting the webfonts was out of scope until measured — the measurement
  put it back in scope. See FINDINGS.

## Acceptance

| # | Check | Command |
|---|---|---|
| A1 | Build is clean | `npx astro check && npm run build` |
| A2 | Landing behaviour, both locales | `npx playwright test tests/e2e/landing.spec.ts` |
| A3 | Components still match the design system | `npm run test:visual` |
| A4 | Lighthouse performance ≥ 95 | `npx lighthouse http://localhost:4321/ --only-categories=performance` |
| A5 | Live over HTTPS on the custom domain | `curl -sI https://homunculusrobotics.com` |
