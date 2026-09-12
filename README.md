# Homunculus Website

Brand site + Design Challenge platform. Astro 5, TypeScript, i18n `en` (default) / `de`.

## Run

```bash
nvm use            # Node 22 (.nvmrc)
npm ci
npm run dev        # http://localhost:4321
npm run check      # astro check — 0 errors
npm run build      # → dist/
```

## Where things live

| Path | What |
|---|---|
| `Mission.md` · `Roadmap.md` · `Techstack.md` | why, what next, with what |
| `specs/<date>_feature_<X.Y>_<name>/` | requirements + plan + findings per feature |
| `design-system/` | **the brand authority** — `readme.md` and the four `*.dc.html` prototypes. Also a portable Agent Skill (`SKILL.md`). Read `design-system/AGENTS.md` before touching it. |
| `src/` | the website |

The site **imports** `design-system/styles.css` (which owns the token import
order); tokens are never copied into `src/`. One colour change in the design tool
changes the live site.

## Status

Phase 0, Feature 0.1 — repo skeleton. See `Roadmap.md`.
