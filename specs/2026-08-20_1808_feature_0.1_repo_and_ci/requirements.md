# Feature 0.1 — Repo, CI, and the frozen prototype: Requirements

> **One sentence:** Turn this design-system folder into a version-controlled
> Astro project on GitHub with CI, without destroying the prototype work that is
> currently the only specification of how the brand looks.

---

## Context

Today the folder holds four `.dc.html` files written in an artifact-prototype
dialect (`{{ }}` bindings, `<x-dc>`, `support.js`), a finished CSS token system,
and component/guideline specimens. The prototypes **are** the design spec — they
are ahead of `design-system/ui_kits/marketing/` and were signed off visually. They are also not
runnable as a website: no build, no routing, no server.

This feature creates the container everything else lands in. The one careful
part — wrapping the whole previous root into `design-system/` — was done on
2026-08-20, before the Astro skeleton, so that nothing had to be re-pathed twice.
Feature 0.2 ports the prototypes into Astro components and diffs against them.

## Scope (from Roadmap Feature 0.1)

1. `git init`, first commit, push to `github.com/<org>/homunculus-website`.
2. **DONE 2026-08-20** — move the entire previous repo root into
   `design-system/`, verbatim (D1).
3. Astro 5 + TypeScript skeleton: `package.json`, `tsconfig.json`,
   `astro.config.mjs` with i18n (`en` default, `de`), Node SSR adapter installed
   but output `static` until Phase 1 needs otherwise.
4. `.github/workflows/ci.yml` — install, `astro check`, `astro build`.
5. `.gitignore` covering `node_modules`, `.env*`, `dist`, `design-system/uploads/`.
6. `README.md` — how to run it, where the design authority lives.

Out of scope: any port of the prototypes (0.2), any deployed URL (0.3), any
Supabase resource (1.1), any content rewrite — all current copy is filler and
stays filler until Feature 0.3.

## Decisions

### D1: The design system is wrapped verbatim, not reorganised

Everything that was at the repo root — `SKILL.md`, `readme.md`, `tokens/`,
`assets/`, `guidelines/`, `components/`, `ui_kits/`, the four `*.dc.html`
prototypes, `support.js`, `image-slot.js`, `.image-slots.state.json`,
`.thumbnail`, `uploads/`, `screenshots/`, `scraps/` — moved into
`design-system/` with its internal layout untouched.

Two reasons, and the second one killed the first draft of this spec:

1. **It is an Agent Skill.** `SKILL.md` + `readme.md` make the folder invocable
   from any project to generate branded output. Dissolving it into `src/` would
   destroy that; wrapping it makes it *more* portable than before, because the
   skill root no longer drags `specs/` and `supabase/` along with it.
2. **Every prototype reference is sibling-relative.** `styles.css`,
   `./support.js`, `./image-slot.js`, `assets/logo-mark-light.png`,
   `About.dc.html`. An earlier draft proposed a `design-system/prototypes/`
   subfolder — that would have broken all of them, and with them the Claude
   design tool's ability to keep editing the pages. Verified by grepping every
   `src=`/`href=` in the four files before moving; nothing points at `uploads/`,
   `screenshots/` or `scraps/`, and `.image-slots.state.json` stores images as
   inline base64 data URIs, not paths.

Verification of the move: `find . -mindepth 1 | wc -l` = 125 before, 125 after
(plus the new folder itself). Nothing edits `design-system/` from the site side
again, except the design tool.

### D2: The site imports the tokens, never copies them

`src/styles/global.css` does `@import '../../design-system/tokens/colors.css'`
and friends; Vite resolves it at build time. A copy under `src/styles/tokens/`
would be a second source of truth that silently drifts the first time a colour is
tweaked in the design tool. Cost of this choice: the site build depends on a
folder outside `src/`, which is unusual for Astro but entirely legal.

### D3: `design-system/uploads/` is git-ignored, `design-system/assets/` is committed

`uploads/` is the design phase's scratch pile (screenshots, a 40 MB screen
recording, generated renders). `assets/` holds the four deliberately recoloured
logo marks and the two real photos that pages actually reference. Committing the
scratch pile makes every clone slow for zero benefit; the files stay on disk.

### D4: `output: 'static'` now, adapter installed now

Phase 0 ships to GitHub Pages, which needs pure static. Phase 1 needs SSR for
`/challenge/*`. Installing `@astrojs/node` in 0.1 but not switching the output
mode means the Phase-1 switch is a two-line config change, not a dependency
negotiation mid-feature. Hybrid rendering (per-route `prerender`) is how both
targets coexist from Feature 1.2 onward.

### D5: Node 22 LTS, pinned in `.nvmrc` and in CI

The Fly runtime, the local dev environment and CI must agree, or the first
"works on my machine" bug lands in the upload path where it is hardest to debug.
