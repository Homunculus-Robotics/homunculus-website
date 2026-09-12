# Feature 0.1 — Repo, CI, and the frozen prototype: Findings / Acceptance

**Status: DONE locally 2026-08-20 — skeleton builds, `astro check` clean, commit
`bd9f243`. One item open: no GitHub remote yet (scope item 1), so CI has never
run. Needs the org name to `gh repo create` and push.**

## Acceptance evidence

| Check | Result |
|---|---|
| `npx astro check` | ✅ 3 files, 0 errors / 0 warnings / 0 hints |
| `npm run build` → `dist/index.html` | ✅ 1 page, 217 ms |
| `grep -c "var(--void)" dist/index.html` > 0 | ✅ 1; `dist/_astro/index.*.css` carries the full ramp (`--green-950:#021a08`) |
| `git status --porcelain` empty after commit | ✅ no `node_modules/`, no `dist/` |
| CI green on `main` | ⛔ **blocked — no remote.** Workflow written, never executed |
| `design-system/` wrap loses no files | ✅ `find . -mindepth 1 \| wc -l` = 125 before, 125 after |
| No prototype path points outside its own folder | ✅ grepped every `src=`/`href=` in the 4 `.dc.html`: all siblings (`styles.css`, `./support.js`, `assets/…`, `*.dc.html`) |
| `.image-slots.state.json` survives the move | ✅ stores inline base64 data URIs, no filesystem paths |
| `design-system/*.dc.html` render unchanged in a browser | — (open and click through) |

## Notes for later features

- **Feature 0.2:** the screenshot baseline lives in `design-system/screenshots/`;
  the diff target is `design-system/Home.dc.html` (D1). The existing baseline was
  captured at an unknown viewport — re-capture at 1440×900 and 390×844 before
  trusting the diff.
- **Feature 0.2:** tokens are imported out of `design-system/`, never copied
  (D2). If the Astro build cannot climb out of `src/`, the fix is
  `vite.server.fs.allow`, **not** a copy.
- **Feature 1.2:** flipping to hybrid rendering is `output: 'server'` +
  `export const prerender = true` on the brand pages (D4).

## Deviations from Roadmap

- **`src/styles/global.css` imports `design-system/styles.css`, not the seven
  token files individually.** The design system already ships that entry point
  ("Consumers link ONLY this file. Keep it @import lines only.") and it owns the
  token import order — `fonts → colors → typography → spacing → effects → themes
  → base`. Listing the seven files in `src/` would have duplicated that ordering
  as a second thing to keep in sync, which is the exact drift D2 exists to
  prevent. Same rule, one hop shorter.
- **`typescript` is pinned to `^6`, not latest.** TypeScript 7's native compiler
  does not yet expose the programmatic API `astro check` uses, so `npm i -D
  typescript` (which resolved 7.0.2) breaks the check step outright — this will
  bite CI and any fresh clone until the Astro side lands support
  (withastro/roadmap#1321). Revisit when it does.
- **`tsconfig.json` excludes `design-system/`.** `astro check` walked into the
  design tool's `components/*.jsx` specimens and reported diagnostics on files
  the site never imports and `src/` is forbidden to edit (AGENTS.md). Excluded
  rather than fixed: the design tool owns those files.
- **`vite.server.fs.allow: ['..']` was added per plan D2 but was not needed for
  the build** — Vite resolves the climb-out `@import` at build time regardless.
  It is kept for `astro dev`, which does enforce fs.allow.
