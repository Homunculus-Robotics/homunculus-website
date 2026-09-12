# Feature 0.3 — Landing page: Findings / Acceptance

**Status: DONE locally 2026-08-22 — the real bilingual landing page renders from
`src/content/home/{en,de}.md`, `/` and `/de/` both build, 9 Playwright tests pass,
Lighthouse is 99 / 100 / 100 / 100 on both locales. Not yet live: the Pages
workflow and `public/CNAME` are committed, but GitHub Pages and the apex DNS
records are a console/registrar step — see Open items.**

## Acceptance evidence

| Check | Result |
|---|---|
| `npx astro check` | ✅ 25 files, 0 errors / 0 warnings / 0 hints |
| `npm run build` | ✅ 3 pages (`/`, `/de/`, `/parity/home`) in 621 ms |
| `npx playwright test` | ✅ 7 passed (5 landing + 2 parity) |
| Lighthouse `/` (2 runs) | ✅ **perf 99**, a11y 100, best-practices 100, SEO 100 |
| Lighthouse `/de/` (2 runs) | ✅ **perf 99**, a11y 100, best-practices 100, SEO 100 |
| CLS | ✅ **0** (was 0.261 before the font work) |
| FCP / LCP | ✅ 0.9 s / 2.0 s (Lighthouse mobile emulation, local preview) |
| Both locales render + cross-link | ✅ `/` EN, `/de/` DE, `DE`/`EN` switch round-trips |
| Every internal link on `/de/` stays on `/de/` | ✅ asserted over all nav + footer links |
| Theme persists across reload on `/de/` | ✅ |
| No horizontal overflow at 390 px, both locales | ✅ |
| Components still match `Home.dc.html` | ✅ **3829 of 4 821 760 px = 0.079%** (gate 1%) |
| No third-party request on page load | ✅ 0 hits for `fonts.googleapis`/`gstatic` in `dist/` |

## The performance work (the part that was not free)

The first measurement was **perf 86 / CLS 0.261**, and Lighthouse attributed the
shift to `hmc-mosaic-loader` with the cause `Web font loaded` — i.e. the hero
reflowed when Iceland and Chakra Petch swapped in. Two changes fixed it:

1. **Self-hosted the webfonts** (`design-system/assets/fonts/`, 5 latin-subset
   woff2, 64 KB total: Chakra Petch 400/500/600 + 400 italic, Iceland 400). `design-system/tokens/fonts.css` was a single
   `@import url(https://fonts.googleapis.com/…)`: render-blocking, cross-origin,
   and a Google request from every visitor's browser — which a German site
   cannot make without consent. The `@font-face` rules now use paths relative to
   `tokens/fonts.css`, so the `.dc.html` prototypes still render from `file://`
   unchanged (the parity diff proves it).
2. **Preloaded the three faces the hero paints with** (Iceland 400, Chakra Petch
   400 and 400-italic) from `Base.astro` via `?url` imports, so Vite's hashed
   filenames stay correct. Self-hosting alone left CLS at 0.261 — the browser
   still discovered the fonts only after parsing the CSS. With the preloads,
   **CLS 0, FCP 1.6 s → 0.9 s, perf 86 → 99.**

Accessibility was 92 on the first run; both failures were in 0.2 chrome
components and are fixed at the source, so every future page inherits the fix:

- `LangSwitch`'s inactive locale link was `--text-faint` — **2.62:1** on
  `--void`, below AA for 11 px text. Now `--text-low` (**5.19:1**), the darkest
  token that passes.
- `ThemeSwitcher`'s swatches were 15×15 buttons; WCAG 2.2 wants 24×24. The
  button is now 24×24 and the 15 px swatch is drawn by `::before`, so the hit
  area grew and the visual did not.
- `<main>` was missing (`landmark-one-main`), added to both the landing layout
  and the parity page.

## Deviations from the Roadmap

- **`design-system/tokens/fonts.css` was edited**, against the standing rule that
  the site only reads from `design-system/`. The plan's D6 made this conditional
  on measurement and the measurement came back against the remote `@import`
  (perf 86, and a third-party request on every visit). The change is inside the
  design system rather than worked around in `src/`, so the prototypes and the
  site keep the same fonts and the parity test stays meaningful. Recorded as a
  new rule in `design-system/AGENTS.md` so the design tool does not revert it.
- **`public/assets/` holds `og-cover.png`, not "logo marks".** The marks are
  already imported from `design-system/assets/` and hashed into `_astro/` by the
  build; copying 400 KB of duplicates into `public/` would create a second
  source of truth for the logo. `og-cover.png` (1200×630, the mark on `--void`)
  and `favicon.png` (180×180) are generated from `logo-mark-light.png`.
- **The 0.2 parity page moved to `/parity/home`** rather than being deleted with
  its test. It is `noindex` + `Disallow: /parity/`. Consequence: its nav no
  longer marks "Sandbox" as the current page, which together with the two a11y
  fixes moved the parity diff from 0.044% to 0.079% — still an eighth of the gate.
- **No sitemap.** `@astrojs/sitemap` for a two-page site is a dependency for
  nothing; `robots.txt` + `hreflang` alternates cover it. Add it when the
  gallery lands (2.1) and there are hundreds of URLs.
- **Copy is frontmatter-first, Markdown-body-second.** Only the thesis paragraphs
  are the Markdown body; everything else is schema-validated frontmatter, so a
  string missing from `de.md` fails the build instead of rendering an empty
  heading. Roadmap said "copy as Markdown" — this is that, minus the pretence
  that a CTA label wants prose.
- **`zod` is now an explicit devDependency.** `astro:content`'s re-exported `z`
  is deprecated in Astro 7 and `astro check` hinted on every use of it.

## Assumptions

- **`hello@homunculusrobotics.com`** is the contact address on the page. Nothing
  in the repo names one; change `contact.email` in both content files if it is
  wrong. It is the only invented fact on the page.
- Product claims come from the product repos' own Mission docs (`BuilderLayer`,
  `Homunculus_AI`, `Homunculus_Robotics_Hardware`) — the status line
  "PPO learns since August 2026" is `Homunculus_AI/Mission.md`'s
  "PPO learns as of Feature 2.0 (2026-08-11)". No claim on the page goes past them.

## Open items (cannot be closed from a laptop)

1. **GitHub Pages must be switched to "GitHub Actions" as its source** in the
   repo settings, once, before `pages.yml` can deploy.
2. **Apex DNS for `homunculusrobotics.com`**: four A records to `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and the AAAA
   equivalents), plus `www` as a CNAME to `<org>.github.io`. Then tick "Enforce
   HTTPS" after the certificate is issued.
3. **Acceptance A5** (`curl -sI https://homunculusrobotics.com` → 200) stays open
   until 1 and 2 are done. Everything that can be verified locally is verified.
4. CI has still never run — inherited from 0.1/0.2; the remote now exists, so the
   first push closes it.

## Review pass (2026-08-22, pre-commit)

Accepted, in this order of size: four unused `@font-face` blocks and the Rubik
Glitch face deleted (10 files / 163 KB → 5 files / 64 KB — nothing in `src/` or
in the four prototypes renders weight 300, italic 500/600, or `--font-glitch`,
which falls back to Iceland by its own token stack); the ten `unicode-range`
lines deleted (they gate per-subset downloads, and there is one latin file per
weight); `Allow: /` dropped from `robots.txt` (the default); `export type
Locale` and `navLabel` dropped (`const lang = Astro.currentLocale === 'de' ?
'de' : 'en'` narrows once, and `l.label[lang]` then typechecks at both call
sites); the three `hreflang` links folded into one map; the two Playwright tests
that both walked `/` and `/de/` folded into one. Re-measured after: parity diff
**unchanged at 3829 px**, Lighthouse **unchanged at 99/100/100/100, CLS 0**.

Two suggestions declined:

- **Delete `/parity/home` and its supports.** The argument was that both sides
  of the diff are frozen so it can only fail when a component or token changes —
  which is the trigger it exists for: the design tool edits
  `design-system/tokens/` outside this repo's review, and nothing else notices.
  The real `/` cannot replace it: it has no baseline, and giving it one means
  committing a PNG, which is the drift 0.2 deliberately avoided. The proposed
  40-line component strip has the same problem — the baseline is a full-page
  screenshot of `Home.dc.html`, so a strip has nothing to be compared against.
  The ~100 duplicated CSS lines are the freeze: sharing them with `Home.astro`
  would make the guard fail every time the landing page is restyled, which is
  exactly the false positive that gets a test deleted. `noindex` and
  `Disallow: /parity/` stay because they are what keeps the fixture out of
  Google; only the test asserting them was dropped (static markup, nothing to
  regress).
- **Delete the `test:visual` script.** `Roadmap.md` (0.2) and this feature's
  requirements both name it as the acceptance command. One line in
  `package.json` is cheaper than editing two documents to say
  `npx playwright test tests/e2e/visual.spec.ts` instead.
