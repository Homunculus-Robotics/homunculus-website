# Mission — Homunculus Website

> **One sentence:** The public face of Homunculus Robotics — a brand site that
> makes "intelligence born into whatever body the task demands" legible to
> industry, investors and researchers, and a **Design Challenge platform** where
> anyone can upload a robot embodiment they invented, defend it in three
> questions, and have the public vote on it.

---

## The Problem

Homunculus Robotics builds three halves of one product — a browser sandbox where
you snap robot parts together like LEGO ([BuilderLayer](../Homunculus_Robotics/BuilderLayer/Mission.md)),
a learner that teaches any assembled body to move ([Homunculus_AI](../Homunculus_Robotics/Homunculus_AI/Mission.md)),
and a keyed physical module kit ([Hardware](../Homunculus_Robotics_Hardware/Mission.md)).
None of them are public yet. Today the company has:

1. **No public surface.** Four `.dc.html` design prototypes on a laptop. An
   investor, a partner or a hire who hears the name finds nothing to read.
2. **No proof anyone wants non-humanoid embodiments.** The entire thesis is that
   the human form is one solution among many. That is currently an assertion, not
   evidence. A corpus of designs invented by strangers is evidence.
3. **No top-of-funnel.** No mailing list, no community, no reason for a student
   who would love this to ever hear about it.

The Design Challenge solves 2 and 3 with one mechanism: ask the internet to
invent a body, make the submissions public, let people vote. The cost of being
wrong is a quiet gallery; the cost of not asking is building a sandbox for
morphologies nobody wanted.

---

## The User

**Primary persona: the submitter.** A student, maker, industrial designer or
robotics researcher who has an idea for a robot that is not a humanoid and no
place to put it.

They have:
- A design — a sketch, a CAD file, a render, a video of a prototype.
- An opinion about *why that body*, which nobody has ever asked them for.
- Roughly 20 minutes of goodwill before a signup flow loses them.

They lack:
- A venue where a weird embodiment is the point rather than a novelty.
- Any confidence that their email and files will be handled properly.
- Patience for account creation, passwords, or a form that eats their upload.

They need:
- Upload in one sitting: media in, three answers, done, visible.
- The ability to come back later and fix it.
- A visible, fair vote — and to be told plainly what happens with their data.

**Secondary: the voter.** Arrives from a link, browses the gallery, votes with an
email address, maybe ticks the newsletter box. Must never be forced to register.

**Tertiary: the evaluator.** Investor, industry partner, potential hire. Reads
Home/About/Products, judges seriousness in ~90 seconds, and treats the Design
Challenge as proof the company can ship something public that works.

---

## The Solution

Two surfaces on one design system:

**The brand site** — Home, About, the three product lines (Sandbox, Learner,
Hardware Kit), Knowledge. Static, fast, bilingual DE/EN, deployable to GitHub
Pages next to the robotics repos.

**The Design Challenge platform** — the part with a database behind it:

```
PARTICIPATE                          VOTE (no account)
  magic-link login (no password)       browse gallery
  → upload 1..n images                 → open a design
  → 1 video (opt)                      → vote: email + consent checkbox
  → 1 3D model (opt, GLB/GLTF)         → one vote per email per design
  → 3 texts:  What is your design?
              Why this embodiment?
              How does it interact with the world and make it better?
  → LIVE in the gallery immediately
  → come back any time and edit
```

**What makes it different from "just use a Google Form + a Notion gallery":**
the three questions are the product. A form collects files; this collects
*arguments about embodiment*, publicly, with a 3D model you can rotate in the
browser and a vote count under it. That corpus is the thing the company actually
needs, and it is not something an off-the-shelf tool produces.

---

## Phase 1 Focus

**One submission survives the whole pipeline.**

Log in with a magic link → upload images, a video and a GLB → answer the three
questions → the PII is encrypted at rest and linked to the design by an opaque id
→ the design renders on a public detail page → last night's backup restores into
a scratch database and the design is still there.

> [!IMPORTANT]
> We do **not** build the marketing site, the voting flow, the admin dashboard or
> the leaderboard in Phase 1. Phase 1 is **one design, uploaded, stored, shown,
> and provably recoverable**. Everything else is worthless if that path is
> broken, and everything else is easy once it is not.

---

## Success Metric

> **100 valid design submissions by challenge close** — valid = at least one
> image plus all three text answers, from a confirmed email address.

Secondary metrics:
- ≥ 1,000 unique voters (one vote per email per design).
- ≥ 40% of submitters and voters opt in to further contact.
- p95 gallery page load < 1.5 s under a 2,000-concurrent-user spike.
- Zero PII in any log line, error report, backup that isn't encrypted, or
  analytics event. This is a pass/fail number, not a target.

---

## Architectural Principles

1. **PII lives in exactly one table, encrypted, and nothing else joins to it by
   email.** Designs, votes and public pages reference an opaque `submitter_id`.
   Name, email and institution exist only as AES-256-GCM ciphertext plus an HMAC
   of the email for lookup and de-duplication. A full database dump leaked to the
   internet must expose zero identities without the key, which lives outside the
   database.
2. **A backup that has never been restored is not a backup.** The restore drill is
   a roadmap feature with an acceptance test, not a good intention.
3. **The gallery is static-cacheable.** Anonymous reads of the challenge must be
   servable from CDN cache, so a traffic spike costs bandwidth, not database.
4. **Design system is shared, not copied.** The tokens and components in this repo
   are the same ones the product apps will use. One source of truth for the brand.

---

## Explicit Non-Goals (Phase 1)

| Non-Goal | Why Not Now |
|---|---|
| Passwords, OAuth, social login | Magic link only. No password = no password breach, no reset flow, no hashing decisions. |
| Video transcoding / adaptive streaming | One `<video>` tag, a 200 MB / 2 min cap, browser-native codecs. Add Mux/CF Stream when a real video actually fails to play. |
| STL / STEP / FBX 3D support | GLB/GLTF only — `<model-viewer>` handles it with one script tag. Other formats need a converter and a viewer we'd have to own. |
| Comments, likes, follows, profiles | It is a challenge, not a social network. Voting is the only public interaction. |
| Live embedded BuilderLayer sandbox | The product isn't public yet. The site links to it when it is. |
| Custom CMS | Content is Markdown in the repo. If a non-developer needs to publish, revisit. |
| Prize logistics / jury tooling / payouts | Out of scope until the challenge rules are legally finalised. |
| Native apps, PWA offline mode | It's a website. |

---

## Repo Discipline

| Repository | Purpose |
|---|---|
| **homunculus-website** (public — this repo) | The brand site: Landing page, Sandbox, Knowledge, About. Deploys to GitHub Pages and owns `homunculusrobotics.com`. Holds the authoritative copy of `design-system/` (the portable brand skill — invocable from other projects, and the tokens both sites import). |
| **Website** (private) | The Design Challenge platform: everything under `/designchallenge`, its API, the Supabase schema and the PII vault. Deploys to Fly.io Frankfurt, behind this repo's apex domain. Not deployed yet. |
| **Homunculus_Robotics/BuilderLayer** | The sandbox product. This site links to it and embeds nothing from it. |
| **Homunculus_Robotics/Homunculus_AI** | The learner. Source of the training-montage clips the site may show. |
| **Homunculus_Robotics_Hardware** | The physical kit. Source of CAD renders and specs for the hardware product page. |

The website never imports code from the product repos and the product repos never
import from the website. Assets cross as files, copied deliberately.

The same rule holds between the two website repos: **no route exists in both.**
They meet only on the domain, split by path — `/designchallenge/*` private,
everything else here. `design-system/` is the one file tree kept in both, and
this repo is the copy to edit.

---

*Stand: August 2026*
