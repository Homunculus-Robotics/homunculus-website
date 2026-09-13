# Roadmap — Homunculus Website

Goal: deliver a bilingual brand site plus a public Design Challenge platform —
upload, gallery, voting, encrypted PII, verified backups — that survives a viral
traffic spike and a hostile visitor. No fixed launch date: **the challenge goes
public only after Phase 3 passes.** This roadmap names exact files, signatures,
commands and acceptance criteria so an agent or a developer can start on any
feature without asking a question first.

> **Status:** Features 0.1, 0.2 and 0.3 **COMPLETE locally** (0.3 on 2026-08-22)
> — the real bilingual landing page renders from `src/content/`, Lighthouse is
> 99/100/100/100 on both `/` and `/de/`, and the components still match
> `design-system/Home.dc.html` to 0.079% of pixels. Open: GitHub Pages has to be
> pointed at Actions and the apex DNS records set before the site is actually
> live (0.3 FINDINGS, Open items); CI has never run.
>
> **The repo split (2026-09-13):** Phase 1 and everything after it — the Design
> Challenge — is built in the **private** repo, not here. This repo's remaining
> roadmap is the Sandbox page, Knowledge and About. The phases below are kept
> whole so one document still describes the whole product; each one says which
> repo owns it.

## Quick conventions used below

- **Repos:** two, split by path on one domain.
  - `homunculus-website` (**public**, this repo) — `/`, `/sandbox`,
    `/knowledge`, `/about`. Static → GitHub Pages, owns the apex
    `homunculusrobotics.com`. Live.
  - `Website` (**private**) — everything under `/designchallenge`, its API
    included: login, the participant account, uploads, Supabase, the PII vault.
    Node adapter → Fly.io `fra`, behind a Cloudflare route on the same apex.
    Not deployed yet.

  No route exists in both. Nothing that needs a login, a database or a secret
  belongs in this repo — it builds to static files and has no server to keep
  one. Layout here:
  ```
  src/{pages,components,layouts,lib,content,styles}   ← the brand site
  public/   tests/e2e/   specs/
  design-system/     ← the portable brand skill, wrapped verbatim: SKILL.md,
                       readme.md, tokens/, assets/, guidelines/, components/,
                       ui_kits/ and the four frozen *.dc.html prototypes.
                       Site code imports its tokens; nothing else edits it.
  ```
- **Owners:** Marcus (product/design/decisions) + Claude Code (implementation).
  One person and one agent — no hand-offs, so "owner" below means who decides.
- **Effort:** rough person-hours, assuming agent-assisted implementation.
- **Gate discipline:** a phase is not done until its acceptance commands exit 0.
- Every implemented feature gets a spec folder:
  `specs/<date>_feature_<X.Y>_<name>/{requirements,plan,FINDINGS}.md`.

---

## PHASE 0 — Foundation (Weeks 1–2)

Focus: the repo exists, the brand renders on the real stack, something is public.

### Feature 0.1 — Repo, CI, and the frozen prototype (owner: Marcus) — 4h — ✅ COMPLETE (local) · [FINDINGS](specs/2026-08-20_1808_feature_0.1_repo_and_ci/FINDINGS.md)

- **Objective:** turn this folder into a git repo on GitHub with CI, without
  losing the design work already in it.
- **Deliverables:**
  - `git init` + push to `github.com/<org>/homunculus-website`
  - `design-system/` — **done 2026-08-20**: the entire previous repo root moved
    down one level, byte for byte, so every sibling-relative path in the
    prototypes (`styles.css`, `./support.js`, `assets/…`) still resolves and the
    Claude design tool keeps working on the folder unchanged.
  - `package.json`, `tsconfig.json`, `astro.config.mjs` (i18n: `en` default, `de`)
  - `.github/workflows/ci.yml` — typecheck + build on every push
  - `.gitignore` — `node_modules`, `dist`, `.env*`, `design-system/uploads/`
- **Acceptance:** `npm run build` produces `dist/`; CI green on `main`.
- **Test:** `npm run build && npx astro check`

### Feature 0.2 — Design system port (owner: Marcus) — 12h — ✅ COMPLETE (local) · [FINDINGS](specs/2026-08-21_feature_0.2_design_system_port/FINDINGS.md)

- **Objective:** the tokens and components become real, reusable Astro pieces.
- **Deliverables** (`src/`):
  - `src/styles/global.css` — `@import '../../design-system/tokens/*.css'`.
    **Tokens are never copied into `src/`** — one source of truth, so a token
    edited in the design tool changes the live site and the specimens together
  - `layouts/Base.astro` — html shell, `data-hmc-theme`, DE/EN `<html lang>`, meta/OG
  - `components/Nav.astro`, `Footer.astro`, `ThemeSwitcher.ts` (3 themes,
    `localStorage.hmc-theme`), `LangSwitch.astro`
  - `components/{Button,Badge,Card,Input,GlitchText,StatReadout}.astro`
  - `components/MosaicLoader.ts` — the triangle-dissolve intro, once, not thrice
- **Acceptance:** a page built only from these components is visually
  indistinguishable from `design-system/Home.dc.html` at 1440px and 390px.
  **Met at 1440px: 0.044% of pixels differ.** At 390px the prototype has no
  media queries and overflows, so the port is held to "no horizontal overflow"
  instead of a diff — see FINDINGS, Deviations.
- **Test:** `npm run test:visual`. The baseline is **re-captured from
  `Home.dc.html` on every run**, not committed — a prototype edit fails the
  test instead of drifting past a stale PNG.

### Feature 0.3 — Landing page live on GitHub Pages (owner: Marcus) — 6h — ✅ COMPLETE (local) · [FINDINGS](specs/2026-08-21_feature_0.3_landing_page/FINDINGS.md)

- **Objective:** a real URL exists.
- **Deliverables:**
  - `src/pages/index.astro` + `src/pages/de/index.astro` — hero, the three
    product lines (Sandbox · Learner · Hardware Kit), Design Challenge teaser,
    contact
  - `src/content/` — copy as Markdown, DE + EN (current text is filler; replace)
  - `.github/workflows/pages.yml` — `astro build --site https://…` → Pages
  - `public/assets/` — logo marks + `robots.txt` + `favicon`
- **Acceptance:** page loads over HTTPS on the custom domain, Lighthouse
  performance ≥ 95, both `/` and `/de/` render, theme switcher persists.
  **Met locally: performance 99** (a11y/best-practices/SEO 100) on both routes,
  theme persists, no overflow at 390 px. The custom domain
  (`homunculusrobotics.com`) is configured — `site`, `public/CNAME`, `pages.yml`
  — but Pages and the apex DNS are console steps, so HTTPS-on-the-domain is the
  one criterion still open.
- **Test:** `npx playwright test tests/e2e/landing.spec.ts && npx lighthouse <url>`

---

## PHASE 1 — Submission pipeline end-to-end (Weeks 3–6)

Focus: **one design survives upload → storage → public page → backup restore.**
This is the Mission's Phase 1 focus. Nothing in Phase 2 starts until it holds.

### Feature 1.1 — Schema, RLS, and the PII vault (owner: Marcus) — 10h

- **Objective:** the data model from `Techstack.md` exists, and a stolen dump is
  worthless without the key.
- **Deliverables:**
  - `supabase/migrations/0001_init.sql` — `designs`, `design_media`, `submitters`,
    `votes`; media-count trigger; `updated_at` trigger
  - `supabase/migrations/0002_rls.sql` — RLS on all four tables: anon reads
    `designs` where `status='live'` only; `submitters` has **no** anon policy at all
  - `src/lib/pii.ts` — `emailHmac`, `sealPii`, `openPii`, `rotateKey`
  - `src/lib/db.ts` — typed client; service-role key used only in `/api/*`
- **Acceptance:** with an anon key, `select * from submitters` returns 0 rows and
  no error leak; `openPii(sealPii(p)) === p`; changing one ciphertext byte throws
  (GCM tag check); a `pg_dump` grepped for a test email address finds nothing.
- **Test:** `npm run test:rls` (`tests/security/rls.spec.ts`) and
  `node --test src/lib/pii.test.ts`

### Feature 1.2 — Magic-link auth + participant account (owner: Marcus) — 8h

- **Objective:** log in with an email, no password, and land on your own page.
- **Deliverables:**
  - `src/pages/challenge/participate.astro` — the signup/login form: name, email,
    institution, newsletter consent checkbox, **AGB checkbox (required, records
    version + timestamp)**, Turnstile widget
  - `src/pages/api/auth/magic-link.ts` — Turnstile verify → rate limit →
    `signInWithOtp` → upsert `submitters` (seal PII on first sight)
  - `src/pages/challenge/callback.astro` — session exchange → `/challenge/my`
  - `src/lib/ratelimit.ts` — per-IP + per-email token bucket
- **Acceptance:** a second login with the same email reuses the same
  `submitter_id`; AGB unchecked → 400; Turnstile missing → 403; 6 requests in a
  minute from one IP → 429.
- **Test:** `npx playwright test tests/e2e/auth.spec.ts`

### Feature 1.3 — Upload: images, one video, one 3D model (owner: Marcus) — 16h

- **Objective:** the part most likely to break, built carefully.
- **Deliverables:**
  - `src/pages/challenge/my/[id].astro` — the editor: drag-drop, progress,
    thumbnails, reorder, delete, replace
  - `src/pages/api/designs/[id]/media.ts` — multipart → **magic-byte sniff**
    (`file-type`) → size/count caps → Supabase Storage → `design_media` row
  - `src/components/UploadZone.ts` — island; resumable via chunked PUT for video
  - `src/components/ModelViewer.astro` — `<model-viewer>` wrapper, lazy, sandboxed
- **Acceptance:** a `.exe` renamed to `.png` is rejected on magic bytes; a 250 MB
  video is rejected before the body is buffered; a second video replaces the
  first rather than adding one; a 40 MB GLB rotates in the browser; a dropped
  connection mid-upload leaves no orphan row.
- **Test:** `npx playwright test tests/e2e/upload.spec.ts` (fixtures in
  `tests/fixtures/`: valid glb, oversize mp4, disguised exe, 12 images)

### Feature 1.4 — The three questions + public design page (owner: Marcus) — 10h

- **Objective:** the corpus the company actually wants.
- **Deliverables:**
  - Editor form fields: *Explain your robot design* · *Why did you choose this
    specific embodiment* · *How does it interact with the world and make it a
    better place* — 200–2000 chars each, autosave draft, live counter
  - `src/pages/api/designs/[id].ts` — POST/PUT, Zod-validated, owner-only
  - `src/pages/challenge/[slug].astro` — public detail page: media, 3D viewer,
    the three answers, submitter display name, vote button (inert until 2.2)
  - `Cache-Control: public, s-maxage=3600, stale-while-revalidate` on public reads
- **Acceptance:** publishing requires ≥1 image + all three answers; the page is
  live immediately after publish; editing it later updates the public page; the
  page renders with JS disabled (3D viewer degrades to its poster image).
- **Test:** `npx playwright test tests/e2e/submit-flow.spec.ts` — the full
  Mission Phase-1 path in one test, run with `--repeat-each=3`.

### Feature 1.5 — Backups + a restore that is actually proven (owner: Marcus) — 10h

- **Objective:** the server burns down and nothing is lost.
- **Deliverables:**
  - Enable Supabase PITR (Pro plan)
  - `infra/backup.sh` — `pg_dump` + storage mirror → `age`-encrypted → Hetzner
    Storage Box **and** Backblaze B2 EU; writes `manifest.json` (sha256 + row counts)
  - `infra/restore-drill.sh` — restores the latest into a scratch project,
    asserts row counts against the manifest, renders one known design, exits
    non-zero on any mismatch
  - `.github/workflows/backup.yml` (nightly) + `restore-drill.yml` (monthly)
  - `infra/RUNBOOK.md` — the disaster procedure, written for a bad day
- **Acceptance:** delete the production project in a staging rehearsal and
  rebuild it from backup alone; the Phase-1 design is present and its media
  loads. Drill exit code 0.
- **Test:** `bash infra/restore-drill.sh` (CI, monthly, must be green)

> **GATE 1:** Features 1.1–1.5 green ⇒ one design is uploadable, public, private
> where it must be, and recoverable. Only now does Phase 2 start.

---

## PHASE 2 — Gallery and voting (Weeks 7–9)

### Feature 2.1 — Public gallery (owner: Marcus) — 10h

- **Deliverables:** `src/pages/challenge/index.astro` — grid of live designs,
  filter (has-3D / has-video / institution-type), sort (newest / most-voted /
  random), keyboard-navigable, lazy media, `<300 KB` initial payload.
- **Acceptance:** 500 seeded designs render with p95 TTFB < 200 ms **from cache**
  and exactly zero database queries for an anonymous request (verified in
  Supabase query logs).
- **Test:** `npx playwright test tests/e2e/gallery.spec.ts && npm run seed -- 500`

### Feature 2.2 — Voting (owner: Marcus) — 10h

- **Deliverables:**
  - `src/pages/api/designs/[id]/vote.ts` — email + newsletter-consent checkbox +
    Turnstile → `email_hmac` → insert into `votes` (PK collision = already voted)
  - Double-opt-in email confirming the vote (also the newsletter DOI, one mail)
  - `src/components/VoteButton.ts` — optimistic count, honest error states
- **Acceptance:** same email twice on one design → count unchanged, friendly
  message; the raw email appears in **no** table (only `email_hmac`, and the
  encrypted vault if they opted in); vote counts survive a cache purge.
- **Test:** `npx playwright test tests/e2e/vote.spec.ts && npm run test:rls`

### Feature 2.3 — Leaderboard + share cards (owner: Marcus) — 6h

- **Deliverables:** ranked view (materialized view refreshed every 5 min, not a
  live `count(*)`); per-design OG image generated at build/publish time.
- **Acceptance:** leaderboard is a single indexed read; a shared link previews
  with the design's own image in Slack/WhatsApp/X.
- **Test:** `npx playwright test tests/e2e/leaderboard.spec.ts`

---

## PHASE 3 — Hardening (Weeks 10–12) — the gate before going public

### Feature 3.1 — Moderation: report button + admin kill switch (owner: Marcus) — 8h

- **Deliverables:** `POST /api/designs/:id/report`; `src/pages/admin/*` behind an
  allow-listed email + magic link; unpublish/restore in one click; automated
  NSFW/format scan on upload; audit log of every admin action.
- **Acceptance:** an unpublished design 404s within 60 s (cache purge included)
  and its media signed URLs stop resolving.
- **Test:** `npx playwright test tests/e2e/moderation.spec.ts`

### Feature 3.2 — Load & spike testing (owner: Marcus) — 8h

- **Deliverables:** `tests/load/{browse,spike,upload}.js` (k6). Profiles: steady
  500 VU · spike 0→2000 VU in 60 s · 50 concurrent 100 MB uploads.
- **Acceptance:** spike profile — p95 < 1.5 s, error rate < 1%, no 5xx from
  Postgres, Fly stays within `max-machines`, projected cost of the run < €5.
- **Test:** `k6 run tests/load/spike.js`

### Feature 3.3 — Security testing (owner: Marcus) — 12h

- **Deliverables:** `tests/security/` — ZAP baseline in CI; explicit tests for
  **IDOR** (edit someone else's design), **RLS bypass** with a leaked anon key,
  **path traversal** in storage paths, **SSRF** via the GLB parser, **XSS** in
  the three free-text fields (they render user prose — this is the sharpest
  edge), **signed-URL expiry**, **rate-limit bypass** via `X-Forwarded-For`,
  **email enumeration** on the magic-link route. Plus CSP, HSTS, `frame-ancestors`,
  and a secrets scan (`gitleaks`) in CI.
- **Acceptance:** ZAP baseline zero high/medium; every listed attack has a test
  that fails when the mitigation is removed. `SECURITY.md` + disclosure contact.
- **Test:** `npm run test:security`

### Feature 3.4 — DSGVO surface (owner: Marcus) — 8h

- **Deliverables:** DE+EN Impressum, Datenschutzerklärung, AGB / challenge rules
  (versioned — `agb_version` in the DB points at a file in `src/content/legal/`);
  cookieless Plausible; **data export** and **delete-my-account** endpoints
  (delete = cascade designs + purge media + tombstone the vault row); DPAs filed
  for Supabase, Fly, Cloudflare, Resend; the processing register in `docs/`.
- **Acceptance:** a deletion request removes every trace within one run, and the
  next restore drill confirms it did not come back from backup.
- **Test:** `npx playwright test tests/e2e/gdpr.spec.ts`

### Feature 3.5 — Observability, alerts, kill switch (owner: Marcus) — 6h

- **Deliverables:** Sentry with a PII scrubber; uptime check; billing alerts at
  €60/€120; `CHALLENGE_READONLY` flag serving the cached gallery with uploads and
  votes disabled; a one-page cost dashboard.
- **Acceptance:** flipping the flag keeps the gallery up and returns 503 with a
  human message on every write route; an induced error in staging reaches Sentry
  with no email, name or institution anywhere in the payload.
- **Test:** `npm run test:killswitch`

> **GATE 3:** 3.1–3.5 green ⇒ **the Design Challenge may be announced publicly.**

---

## PHASE 4 — Brand site depth (Weeks 13+, parallel-safe)

### Feature 4.1 — Product pages (owner: Marcus) — 12h
`src/pages/{learner,hardware}.astro`, DE+EN — the morphology-agnostic PPO learner
and the keyed DYNAMIXEL XL330 module kit. **The sandbox page shipped early** at
`/sandbox` (+`/de/sandbox`), because the nav's "Sandbox" link pointed at the
landing page and the landing page carried the sandbox's pitch; these two follow
its shape (`layouts/Sandbox.astro` + a `src/content/<product>/{en,de}.md` pair). Content sourced from the product repos' Mission docs;
**no claim ships that those docs don't support.**
**Acceptance:** every technical number on the page cites a source doc and date.

### Feature 4.2 — About + Knowledge (owner: Marcus) — 10h
Founder/team, partners, contact; Markdown-driven Knowledge index with RSS.
**Acceptance:** a new post is one `.md` file, no code change.

### Feature 4.3 — GitHub integration (owner: Marcus) — 4h
Link the Homunculus GitHub org from the site; a build-time fetch of public repo
stars/last-commit rendered statically (**no client-side GitHub calls** — that is
a third-party request on every visit).
**Acceptance:** GitHub being down cannot break a page load.

---

## PHASE 5 — Launch operations (ongoing)

### Feature 5.1 — Challenge close & jury export (owner: Marcus) — 6h
Freeze voting at a deadline; export a jury packet (designs + answers + vote
counts, PII decrypted only into a locally-held encrypted file, never a URL).

### Feature 5.2 — Key rotation drill (owner: Marcus) — 4h
Run `rotateKey(1 → 2)` against production, verify every row re-seals, and that
`openPii` still works for both versions during the roll.

---

<!-- Feature numbering: PHASE.FEATURE. Each implemented feature gets its own spec
folder under specs/. When a feature is done, mark it COMPLETE here and link its
FINDINGS.md. Update the Status line at the top as you go. -->

*Stand: August 2026*
