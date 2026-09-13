# Techstack — Homunculus Website

> **Governing principle:** every choice must justify itself against "a plain
> `.astro` file and a SQL query." Nothing here exists to be modern. Two hard
> constraints override taste: **EU-only data residency (DSGVO)** and **bilingual
> DE/EN from day one**.

---

## Architecture Overview

```
                        ┌───────────────────────────────────────────┐
   visitor ──▶ Cloudflare (free plan: CDN cache, WAF, rate limits, Turnstile)
                        └───────┬───────────────────────┬───────────┘
                                │ static                │ dynamic
                                ▼                       ▼
                 GitHub Pages                    Fly.io  fra (Frankfurt)
                 repo: homunculus-website        repo: Website (private)
                 (public — this one)             Astro SSR (Node adapter)
                 Home · Sandbox · About          /designchallenge/*
                 Knowledge · legal               auto start/stop machines
                 (output: 'static')              (output: 'server')     │
                                                         │ service-role key
                                                         ▼
                        ┌────────────────────────────────────────────┐
                        │      Supabase   (EU / eu-central-1)        │
                        │  Auth      magic link, no passwords        │
                        │  Postgres  designs · votes · submitters    │
                        │            RLS on every table              │
                        │  Storage   images · video · glb (S3 API)   │
                        │  PITR      point-in-time recovery          │
                        └───────────────┬────────────────────────────┘
                                        │ nightly, encrypted (age)
                        ┌───────────────┴────────────────┐
                        ▼                                ▼
             Hetzner Storage Box (EU)          Backblaze B2 (EU-central)
             pg_dump + storage mirror          second copy, different vendor
                                               ↑ 3-2-1: 3 copies, 2 vendors, 1 offsite
```

**The boundary that matters:** anonymous traffic (gallery, design pages, brand
site) must be servable from cache with **zero** database reads. Only login,
upload, edit and vote touch Postgres. A viral spike is then a bandwidth bill, not
an outage.

---

## Choices

| Layer | Choice | Why (vs. the obvious alternative) |
|---|---|---|
| Language / runtime | TypeScript on Node 22 LTS | One language front to back; Node 22 is what Fly and Astro's adapter both target without surprises. |
| Site framework | **Astro 5** | Ships zero JS by default — the brand pages become plain HTML, which is exactly what GitHub Pages wants. Islands cover the four interactive spots (upload, vote, theme switcher, 3D viewer). Next.js would ship a React runtime to a page that is a paragraph and a picture. |
| i18n | Astro's built-in i18n routing (`/de/*`, `/en/*`) | It's in the framework. `next-intl`/`i18next` would be a dependency for what `astro.config` does in eight lines. |
| Styling | The existing `design-system/tokens/*.css` custom properties, plain CSS | The design system is already CSS variables and it works. Tailwind would mean re-expressing a finished token system in a second vocabulary. |
| Interactive islands | **Web components / vanilla TS**, React only if an island exceeds ~200 lines | Four islands do not justify a framework runtime on every page. |
| 3D viewer | `<model-viewer>` (one `<script type=module>`, GLB/GLTF) | Google's element wraps three.js, handles camera/lighting/AR/lazy-load. Hand-rolling a three.js scene is a week and a maintenance burden. |
| Video | Native `<video>`, MP4/H.264 ≤ 200 MB ≤ 2 min, served through CF cache | No transcoding pipeline until a real upload actually fails to play. |
| Auth | **Supabase Auth, magic link only** | No passwords → no hashing choice, no reset flow, no credential-stuffing surface, and email confirmation comes free with the login. |
| Data store | **Supabase Postgres (eu-central-1)** | Relational data (designs → media → votes) with row-level security enforced in the database, so an app bug cannot leak another user's draft. RLS is the reason this beats Firebase; EU region is the reason it beats most US-default hosts. |
| File storage | Supabase Storage (S3-compatible), private buckets + signed URLs | Same vendor, same auth, same backup story. Public reads go through a CDN-cached signed proxy route so cost doesn't scale with popularity. |
| Dynamic hosting | **Fly.io, `fra` region**, machines auto start/stop | EU region, scale-to-zero when idle (~€0 nights), scales out under a spike, one `fly deploy`. Vercel would cost more per GB of video egress and adds a US processor. |
| Static hosting | **GitHub Pages** from this public repo | The user asked for the landing page to live with the GitHub project, and Pages is free only from a public repo — which is why the Design Challenge is a second, private repo rather than a folder here. This one owns the apex domain; Cloudflare routes `/designchallenge/*` to the other. |
| Edge / WAF / bot check | **Cloudflare free plan + Turnstile** | Caching, rate-limit rules and a bot check that isn't reCAPTCHA (better DSGVO story, no Google consent banner). Public media only through cache — never a PII response. |
| PII encryption | `node:crypto` AES-256-GCM + HMAC-SHA256 pepper | Stdlib. libsodium/`pgsodium` would add a dependency and a build step for a 40-line module. Key lives in Fly secrets, **never** in Postgres. |
| Email | **Resend** (EU region) or Postmark, via Supabase SMTP | Magic links and challenge notifications need real deliverability; Supabase's built-in sender is rate-limited and not for production. |
| E2E tests | **Playwright** | Also drives the upload flow with real files, which is the part most likely to break. |
| Load tests | **k6** | Scriptable spike profiles (0→2000 VU), runs in CI, plain JS. |
| Security tests | **OWASP ZAP baseline** in CI + a manual checklist + `pgTAP`-style RLS assertions | ZAP catches header/config regressions; the RLS tests catch the ones that actually leak data. |
| CI/CD | GitHub Actions | Repo is on GitHub; Pages deploy and Fly deploy are both one action each. |
| Analytics | **Plausible** (EU, cookieless) — self-host if budget bites | No cookie banner, no PII, no Google. |
| Error tracking | **Sentry** with `sendDefaultPii: false` and a scrubber on `email`/`name` | See Principle 1 in Mission: PII must not exist in a third-party error report. |

---

## Key Interfaces / Contracts

### The PII boundary (the one contract everything else respects)

```sql
-- Public. Cacheable. Contains no identity.
create table designs (
  id            uuid primary key default gen_random_uuid(),
  submitter_id  uuid not null references submitters(id) on delete cascade,
  slug          text unique not null,
  title         text not null,
  q_design      text not null,   -- "Explain your robot design"
  q_embodiment  text not null,   -- "Why did you choose this specific embodiment"
  q_world       text not null,   -- "How does it interact with the world and make it a better place"
  status        text not null default 'live'
                check (status in ('draft','live','reported','removed')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table design_media (
  id         uuid primary key default gen_random_uuid(),
  design_id  uuid not null references designs(id) on delete cascade,
  kind       text not null check (kind in ('image','video','model')),
  path       text not null,          -- storage object path
  bytes      bigint not null,
  mime       text not null,
  sort       int not null default 0
);
-- enforced by trigger: max 1 'video', max 1 'model', max 8 'image' per design

-- PRIVATE. Never selected by an anonymous request. Never joined to by email.
create table submitters (
  id                 uuid primary key default gen_random_uuid(),
  auth_user_id       uuid unique references auth.users(id) on delete set null,
  email_hmac         bytea unique not null,  -- HMAC-SHA256(email_lower, PEPPER)
  pii_ciphertext     bytea not null,         -- AES-256-GCM({name,email,institution})
  pii_nonce          bytea not null,
  key_version        int  not null default 1,
  consent_newsletter boolean not null default false,
  agb_version        text not null,
  agb_accepted_at    timestamptz not null,
  created_at         timestamptz not null default now()
);

-- One vote per email per design, without storing the email in this table.
create table votes (
  design_id   uuid not null references designs(id) on delete cascade,
  email_hmac  bytea not null,
  voter_id    uuid references submitters(id),  -- set only if they opted in
  created_at  timestamptz not null default now(),
  primary key (design_id, email_hmac)
);
```

### The crypto module — `src/lib/pii.ts`

```ts
// Keys come from env (Fly secrets): PII_KEY (32B base64), PII_PEPPER (32B base64).
// They are never written to Postgres, never logged, never sent to Sentry.
export type Pii = { name: string; email: string; institution: string | null };

export function emailHmac(email: string): Buffer;            // lowercase+trim, then HMAC-SHA256
export function sealPii(p: Pii): { ct: Buffer; nonce: Buffer; keyVersion: number };
export function openPii(ct: Buffer, nonce: Buffer, keyVersion: number): Pii;
export function rotateKey(fromVersion: number, toVersion: number): Promise<number>; // rows re-sealed
```

### Public API (SSR routes, all under `/api/`)

```
POST /api/auth/magic-link      { email, turnstileToken }                  -> 204
POST /api/designs              { title, q_design, q_embodiment, q_world } -> { id, slug }   [auth]
PUT  /api/designs/:id          { ...same }                                -> 204            [auth, owner]
POST /api/designs/:id/media    multipart: file, kind                      -> { mediaId }    [auth, owner]
DEL  /api/designs/:id/media/:mediaId                                      -> 204            [auth, owner]
POST /api/designs/:id/vote     { email, consentNewsletter, turnstileToken}-> { total }
POST /api/designs/:id/report   { reason, turnstileToken }                 -> 204
GET  /api/media/:mediaId       -> 302 signed URL (Cache-Control: public, max-age=3600)
```

Every write route: Turnstile verified, Zod-validated body, per-IP token bucket,
and for uploads a **magic-byte sniff** (not the client-declared MIME) against the
allowlist `image/jpeg|png|webp`, `video/mp4|webm`, `model/gltf-binary`.

### Backup contract — `infra/backup.sh`, `infra/restore-drill.sh`

```
backup.sh        pg_dump --format=custom | age -r $BACKUP_PUBKEY  -> hetzner:/ AND b2:/
                 rclone sync storage bucket -> both targets
                 writes a manifest: {ts, dump_sha256, row_counts{designs,votes,submitters}}
restore-drill.sh restores latest into a scratch Supabase project, then ASSERTS
                 row_counts match the manifest and one known design renders.
                 Exits non-zero on mismatch. Runs monthly in CI.
```

---

## Cost Model

Two scenarios. **Prices are as known in Aug 2026 — re-verify before committing;
vendor pricing moves.** The dominant variable is media egress, which is why
Cloudflare sits in front of every media byte.

| Item | Quiet month (pilot: 100 designs, 5k visits) | Spike month (viral: 500 designs, 300k visits, 2 TB media) |
|---|---|---|
| GitHub Pages (static) | €0 | €0 |
| Cloudflare free (CDN/WAF/Turnstile) | €0 | €0 (bandwidth is unmetered on the free plan) |
| Fly.io `shared-cpu-1x` 512 MB, scale-to-zero | ~€2 | ~€15 (2–4 machines during the peak) |
| Supabase Pro (needed for PITR + 100 GB storage) | €25 | €25 |
| Supabase storage overage (~150 GB of video/GLB) | €0 | ~€1 |
| Supabase egress **behind CF cache** (assume 90% hit rate) | ~€0 | ~€18 (200 GB origin pull @ ~€0.09/GB) |
| Resend / Postmark email | €0 (free tier) | ~€10 |
| Backups: Hetzner Storage Box 1 TB + B2 EU | ~€4 | ~€6 |
| Domain | ~€1 | ~€1 |
| **Total** | **≈ €32 / month** | **≈ €76 / month** |

**Guardrails, because "unbounded" was the chosen scale:**
- Cloudflare cache rules on `/api/media/*` and all gallery pages (TTL 1 h) — the
  single most cost-effective line in this document.
- Upload caps: 8 images ≤ 10 MB, 1 video ≤ 200 MB, 1 model ≤ 50 MB → worst case
  ~330 MB per submission; 1,000 submissions ≈ 330 GB ≈ €7/month of storage.
- Fly `max-machines` cap + Supabase spend cap + a billing alert at €60 and €120.
- A **kill switch**: `CHALLENGE_READONLY=true` serves the cached gallery and
  disables uploads/votes, so the worst case is degraded, not a surprise invoice.

---

## Dependencies

Pinned in `package.json`; anything not listed here is a transitive dependency and
gets no special trust.

```
astro                    ^5
@astrojs/node            ^9      (SSR adapter for Fly)
@supabase/supabase-js    ^2
zod                      ^3      (every request body)
@google/model-viewer     ^4      (GLB/GLTF viewer island)
file-type                ^19     (magic-byte sniffing on upload)
@playwright/test         ^1      (dev)
k6                       binary  (dev, not npm)
```

Deliberately **not** used: Tailwind (tokens already exist), React/Vue (four
islands), an ORM (SQL + generated Supabase types), a CAPTCHA SDK (Turnstile is
one fetch), an i18n library (Astro has routing).

---

*Stand: August 2026*
