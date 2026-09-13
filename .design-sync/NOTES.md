# design-sync notes

- **Shape is `native`, not `storybook`/`package`.** `design-system/` is a
  downloaded Claude Design project and is already in the upload format
  (`styles.css` @import closure, `tokens/`, `guidelines/`,
  `components/<group>/<Name>.{jsx,d.ts,prompt.md}` + `<group>.card.html` with
  `@dsCard`). The converter (`package-build.mjs`) does not apply — the site is
  Astro, there is no React `dist/` to bundle.
- **Do not build `_ds_bundle.js`.** The cards reference `../../_ds_bundle.js`
  but neither local nor remote ships one: the app compiles it from the `.jsx`
  when the `_ds_needs_recompile` sentinel is written.
- **No `_ds_sync.json`.** The converter's hash recipe does not fit this shape,
  so there is no anchor; every sync re-uploads in full. That is correct here.
- **Never upload** `scraps/`, `screenshots/`, `uploads/` (design-phase
  scratch, see `design-system/AGENTS.md`) or the app-internal `.thumbnail` /
  `.image-slots.state.json`.
- Both repos carry a byte-identical `design-system/` (except git-ignored
  `uploads/`). Push from `Homunculus_Website_Public`; the other pin exists only
  so a sync started from this repo finds the same project instead of creating a
  duplicate.
- Stray empty project `58f49acd-99b8-48dc-b388-39f0fb763a92` ("Design System")
  is not ours to sync; safe to delete.
