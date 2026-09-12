# Feature 0.1 — Plan

## Files

| File | Content |
|---|---|
| `design-system/` | the entire previous repo root, moved down one level verbatim — **done 2026-08-20** (D1) |
| `design-system/AGENTS.md` | "This folder is the brand skill and the visual authority for Feature 0.2. The Claude design tool owns it. Site code imports `tokens/` and edits nothing here." |
| `package.json` | astro ^5, @astrojs/node ^9, typescript; scripts `dev`/`build`/`check`/`test` |
| `tsconfig.json` | extends `astro/tsconfigs/strict` |
| `astro.config.mjs` | `i18n: { defaultLocale: 'en', locales: ['en','de'], routing: { prefixDefaultLocale: false } }`, `output: 'static'` (D4); `vite.server.fs.allow` must include `design-system/` (D2) |
| `.nvmrc` | `22` (D5) |
| `.gitignore` | `node_modules/`, `dist/`, `.env*`, `design-system/uploads/`, `.astro/`, `*.log` (D3) |
| `.github/workflows/ci.yml` | node 22 → `npm ci` → `npx astro check` → `npm run build` |
| `README.md` | run instructions + pointer to Mission/Roadmap/Techstack + "brand authority = `design-system/readme.md` and the four `.dc.html` files" |
| `src/pages/index.astro` | placeholder importing `styles/global.css`, proves the build (replaced in 0.3) |
| `src/styles/global.css` | `@import '../../design-system/tokens/*.css'` — imported, never copied (D2) |

## Order

1. ~~Wrap the old root into `design-system/`~~ — **done 2026-08-20**, before git,
   so the move is not a diff anyone has to review.
2. `git init`, `.gitignore` first — before any `npm install` creates `node_modules`.
3. `npm create astro@latest -- --template minimal --typescript strict` into a temp
   dir, copy the four config files over rather than letting it scaffold into a
   non-empty directory.
4. Wire `src/styles/global.css` → `design-system/tokens/`, add the placeholder
   page. Confirm Vite resolves an import that climbs out of `src/` (D2) — this is
   the one step in the feature that can genuinely surprise you.
5. CI workflow.
6. First commit, create the GitHub repo, push, confirm CI green.
7. Tests, lint.
8. Live acceptance: `npm run build && npx astro check` exit 0; CI badge green.
9. FINDINGS.md + mark 0.1 DONE in Roadmap.md.

## Test flow

```bash
npm ci
npx astro check          # 0 errors, 0 warnings
npm run build            # writes dist/index.html
grep -c "var(--void)" dist/index.html   # >0 → design-system tokens actually linked
git status --porcelain   # empty; nothing untracked that should be committed
gh run list --limit 1    # latest CI run: success
```

Expected observable output: `dist/index.html` exists, references the token custom
properties, and CI is green on `main`. The four prototype files still open in a
browser from `design-system/` with styles, logos and cross-links intact — open
`design-system/Home.dc.html` and click through to About and Design Challenge.

---

*Feature 0.1 · Stand: 2026-08-20*
