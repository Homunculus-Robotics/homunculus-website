# design-system/ — do not reorganise

This folder is two things at once:

1. **A portable Agent Skill** (`SKILL.md` → `readme.md`). It can be copied or
   symlinked into `~/.claude/skills/` and invoked from any project to generate
   branded Homunculus output.
2. **The visual authority for the website**, in `readme.md` and the four
   `*.dc.html` prototypes, which the Claude design tool still owns and edits.

Rules for anything touching this repo:

- **Every path in the `.dc.html` files is sibling-relative** (`styles.css`,
  `./support.js`, `assets/…`, `About.dc.html`). Do not introduce subfolders,
  do not rename, do not "tidy". The layout is load-bearing.
- **The site imports these tokens, it does not copy them.**
  `src/styles/global.css` → `@import '../../design-system/tokens/*.css'`.
  One source of truth: a colour changed here changes the live site.
- Site code (`src/`) reads from here. Nothing in `src/` writes here.
- **The webfonts are self-hosted in `assets/fonts/` and referenced relative to
  `tokens/fonts.css`.** Do not put the `fonts.googleapis.com` `@import` back: it
  cost the landing page its Lighthouse budget (perf 86, CLS 0.26) and sends
  every visitor's IP to Google, which a German site cannot do without consent.
  The prototypes render from `file://` with the local files exactly as before.
- `uploads/`, `screenshots/`, `scraps/` are design-phase scratch. `uploads/` is
  git-ignored.

See `../specs/2026-08-20_1808_feature_0.1_repo_and_ci/requirements.md` D1–D3.
