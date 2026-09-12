# Humunculus Robotics — Design System

Physical-AI & robotics company building **super-human embodiments** — intelligence born into whatever body a task demands, beyond the humanoid form. Dark-first, blueprint-and-phosphor visual language rooted in the brand's da-Vinci–derived Vitruvian-robot mark.

> **This design system is a visual style reference only.** Example copy (embodiments, stats, taglines) is illustrative brand voice, not factual product claims.

---

## Sources given
- **Brand direction (from founder):** name "Humunculus Robotics"; seed colors green `#006818` + gold `#FCC454`; requested display fonts *Iceland* and *Glitch Goblin*; personality futuristic/sci-fi + organic/living; dark-first, high glitch appetite; bilingual DE/EN; audiences = industry/enterprise, investors, research; first deliverable = marketing website.
- **Logo:** `uploads/logo_file-*.png` — a Vitruvian-man-style robot inside sacred-geometry linework. Copied and recolored into `assets/`.
- No codebase, Figma, or slide deck was provided; the system is authored from brand direction.

---

## Font substitution — ACTION NEEDED
*Glitch Goblin* is **not freely web-hostable**. The glitch accent uses **Rubik Glitch** (Google Fonts), the nearest free glitch face. All other faces are Google Fonts (Iceland, Chakra Petch). **If you have a Glitch Goblin licence, send the webfont files and I'll swap it into `tokens/fonts.css`.** I cannot draw a bespoke typeface — that needs a type designer.

---

## CONTENT FUNDAMENTALS (voice & tone)
- **Quietly radical, never hyped.** State a new truth plainly; let the idea be the drama. ✅ "The human form is one solution. We build the others." ❌ "Revolutionary AI-powered next-gen robotics!"
- **Precise & technical.** Numbers have units (`0.8 ms`, `24 DOF`, `∞ form factors`). Mono, uppercased, wide-tracked labels read like instrument panels.
- **Renaissance ↔ future tension.** Editorial/philosophical lines are set in the serif (Instrument Serif), often with an italic phrase in gold or green; machine statements are set in Iceland, uppercased.
- **"We", addressing "you".** First-person plural for the company; second person for the reader. Confident, not salesy.
- **Bilingual DE/EN.** Copy should translate cleanly; avoid idioms that break across languages. German set with the same type roles.
- **No emoji.** Iconography is geometry, Roman numerals (Ⅰ–Ⅳ), status dots, and hairline ticks — not pictograms or emoji.

## THE SITE (current, canonical)
- The real reference implementation is the four DC pages at the project root — **Home** (sandbox landing), **About** (founder bio + partners), **Design Challenge** (voting gallery), **Portrait Options** (an image-treatment exploration, not shipped). They're ahead of `ui_kits/marketing/` and are where new patterns get proven before they're formalized below.
- **Three color themes** ship today, not just one: **Phosphor** (green accent / violet signal — the default), **Ultraviolet** (violet base, green trace signal), **Verdant** (green forward, violet held to hairlines). Switched via a three-dot picker in the nav (`data-hmc-theme` on the page wrapper + `localStorage.hmc-theme`). See `tokens/themes.css` and the new `guidelines/color-themes.html` specimen.

## VISUAL FOUNDATIONS
- **Colors.** Dark-first. Surfaces are a *warm green-tinted near-black* (`--void` `#050705` → `--surface-4`), never pure `#000` or neutral gray. The deep brand green `#006818` is too dark for text on black, so an OKLCH-lifted **phosphor** ramp carries interactive/accent use (`--green-300 #2fbf5e` is the UI default). Gold `#FCC454` is a **signal** color — one highlight per view, for a single CTA or emphasis, never large fills. Max 1–2 background tones per surface.
- **Type.** Two fonts: **Iceland** (techno display — heroes, numerals, big statements) and **Chakra Petch** (everything else — body/UI at weights 300–600, sleek/technical, never bold; its italic carries the renaissance/organism editorial lines and pull-quotes that used to be a separate serif). **Rubik Glitch** remains a rare decorative accent (≤3 words) on the logotype, not a reading font. Eyebrows/labels are Chakra Petch, uppercase, `0.22em` tracking.
- **Backgrounds.** Blueprint grid (`--blueprint-grid`, 32px), CRT scanlines (`--scanlines`), and a radial phosphor vignette (`--field-glow`). The Vitruvian mark appears large, low-opacity, sometimes slowly rotating, as a hero motif. No photographic imagery by default; no aggressive multi-stop gradients.
- **Depth = light, not elevation.** Shadows are tight and near-black; "raised" reads as phosphor **glow** (`--glow-green`, `--glow-gold`), not soft gray drop-shadows.
- **Motion.** Restrained easing (`--ease-out`, `--ease-snap`), 120–480ms. Signature effects: RGB-split **glitch** on hero words / hover, status-dot **flicker**, slow logo rotation. Never glitch body copy.
- **Borders & corners.** Hairline "blueprint" lines (`--line-soft/mid/strong`, plus green/gold tints). Radii are **restrained** (2–14px; sharp is on-brand) — softness comes from glow, not fat corners. Cards carry optional corner ticks.
- **Cards.** Dark surface + hairline border + optional blueprint grid + corner ticks; glow on hover/emphasis.
- **Hover / press.** Hover lifts (`translateY(-1..-4px)`), brightens to green-300, or intensifies glow. Focus = `--focus-ring` (void gap + green ring).
- **Transparency/blur.** Sticky nav uses `backdrop-filter: blur` over a translucent void. Otherwise blur is rare.

## ICONOGRAPHY
- **No icon set / icon font is bundled.** The brand's visual "icons" are: the **Vitruvian-robot mark** (`assets/logo-mark-*.png` in light / gold / green / dark-line), **Roman numerals** (Ⅰ Ⅱ Ⅲ Ⅳ) for cataloguing embodiments, **status dots** (flickering phosphor), and **hairline corner ticks**. No emoji, no pictogram library.
- If a future product surface needs UI glyphs, add a thin-stroke CDN set (e.g. Lucide) and document it here — chosen to match the hairline/technical weight. Flagged as not-yet-decided.
- Never redraw the logo by hand; recolor the provided PNG (see `assets/`).

---

## Index / manifest
- `styles.css` — entry point; `@import`s everything below.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `themes.css`, `base.css`.
- `assets/` — `logo-mark-dark.png` (original black linework), `-light.png` (for dark bg), `-gold.png`, `-green.png`, plus `founder-marcus-roeper.jpg` and `partner-robotics-collective.png` used on About.
- `guidelines/` — foundation specimen cards (Colors incl. the 3-theme specimen, Type, Spacing, Brand).
- `components/` — `core/` (Button, Badge, Card), `forms/` (Input), `brand/` (GlitchText, StatReadout, ThemeSwitcher, PortraitFrame, MosaicLoader).
- `ui_kits/marketing/` — the original single-page landing concept (`index.html`). **Legacy**: kept for its tweak-panel patterns (palette/texture/density switches), but superseded by `Home.dc.html` as the real site.
- `Home.dc.html`, `About.dc.html`, `Design Challenge.dc.html` — the current site, and the canonical reference for how the system is actually used in product. `Portrait Options.dc.html` is a shelved image-treatment exploration (see PortraitFrame below).
- `SKILL.md` — portable Agent-Skill wrapper.

### Intentional additions
No source defined a component inventory, so a small from-scratch set was authored, sized to the brand: **Button, Badge, Card, Input** (standard primitives) plus brand-specific **GlitchText** and **StatReadout** (signature motifs). Three more were extracted from patterns proven on the live site pages: **ThemeSwitcher** (the Phosphor/Ultraviolet/Verdant dot picker), **PortraitFrame** (corner-tick / real-vs-sim twin-split / sim-viewport-chrome image treatments), and **MosaicLoader** (the triangle-dissolve intro, previously copy-pasted across three pages). Add more (Select, Switch, Dialog…) as product surfaces demand.
