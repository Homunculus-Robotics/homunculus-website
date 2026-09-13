# Homunculus Website

The public brand site: Landing page, Sandbox, Knowledge, About. Astro 7,
TypeScript, i18n `en` (default) / `de`. Static — GitHub Pages serves it on
`homunculusrobotics.com`.

**The Design Challenge is not in this repo.** Login, the participant account and
the upload editor live in the private repo — see [The two repos](#the-two-repos).

## Run

```bash
nvm use            # Node 22 (.nvmrc)
npm ci
npm run dev        # http://localhost:4321
npm run check      # astro check — 0 errors
npm run build      # → dist/
```

## The two repos

One domain, split by path.

| | **`homunculus-website`** (public — this one) | **`Website`** (private) |
|---|---|---|
| Serves | `/`, `/sandbox`, `/knowledge`, `/about` (+ `/de/…`) | everything under `/designchallenge` (+ `/de/designchallenge/…`) |
| Build | `output: 'static'` → GitHub Pages | node adapter, `output: 'server'` → Fly |
| Domain | **owns** `homunculusrobotics.com` (`public/CNAME` + apex A records) | none of its own; reached through that same host |
| Deployed | yes — live | **not yet** |
| Holds | brand copy, the content collections, the landing/sandbox layouts | auth, the PII vault, Supabase migrations, uploads, the editor |

The rule: **no route exists in both repos.** If one does, that is the bug — it
is how the landing-page copy drifted in September 2026. Nothing that needs a
login, a database or a secret belongs here; this repo builds to static files and
has no server to keep one.

The `Design Challenge` link in the header points at `/designchallenge`, which
404s until the private app is deployed behind this domain (a Cloudflare proxy in
front of the apex: `/designchallenge/*` → Fly, everything else → Pages).

`design-system/` is mirrored in both repos on purpose — it is the brand
authority both sides import tokens from. **This repo is the copy to change**;
the private one gets a copy of it.

## Where things live

| Path | What |
|---|---|
| `Mission.md` · `Roadmap.md` · `Techstack.md` | why, what next, with what |
| `specs/<date>_feature_<X.Y>_<name>/` | requirements + plan + findings per feature |
| `design-system/` | **the brand authority** — `readme.md` and the `*.dc.html` prototypes. Also a portable Agent Skill (`SKILL.md`). Read `design-system/AGENTS.md` before touching it. |
| `src/content/` | the page copy, one Markdown file per locale |
| `src/pages/` | the routes |

The site **imports** `design-system/styles.css` (which owns the token import
order); tokens are never copied into `src/`. One colour change in the design tool
changes the live site.

## Status

Landing page and Sandbox live. Knowledge and About are Roadmap 4.2 and land
here. See `Roadmap.md`.
