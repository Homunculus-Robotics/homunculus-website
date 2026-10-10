import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// astro:content's re-exported `z` is deprecated in Astro 7 — zod 4 directly.
import { z } from 'zod';

const cta = z.object({ label: z.string(), href: z.string() });
const tone = z.enum(['accent', 'signal']);
const contact = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  body: z.string(),
  email: z.email(),
});

// One schema, two locales: a string missing from de.md is a build error, not an
// empty heading in production.
const home = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/home' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string(),
      lede: z.string(),
      ledeEm: z.string(),
      ctas: cta.array().length(2),
    }),
    products: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      aside: z.string(),
      items: z
        .object({
          num: z.string(),
          tone,
          kicker: z.string(),
          title: z.string(),
          body: z.string(),
          status: z.string(),
          /** Present → the card title links to that page. */
          href: z.string().optional(),
        })
        .array()
        .length(3),
    }),
    // `pull` is the frontmatter headline; the paragraphs under it are this
    // file's Markdown body — the only copy on the page long enough to want it.
    thesis: z.object({ eyebrow: z.string(), pull: z.string(), pullAccent: z.string() }),
    challenge: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctas: cta.array().length(2),
    }),
    contact,
  }),
});

// The Sandbox product page. Same two-locale rule as `home`: a string missing
// from de.md is a build error.
const sandbox = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sandbox' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string(),
      lede: z.string(),
      ledeEm: z.string(),
      status: z.string(),
      ctas: cta.array().length(2),
    }),
    walls: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      aside: z.string(),
      items: z.object({ num: z.string(), title: z.string(), body: z.string() }).array().length(3),
    }),
    loop: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      aside: z.string(),
      items: z
        .object({
          num: z.string(),
          tone,
          kicker: z.string(),
          title: z.string(),
          body: z.string(),
          status: z.string(),
        })
        .array()
        .length(3),
    }),
    // `note` is the measured-vs-target caveat; the Markdown body under it is
    // the long-form explanation, same arrangement as home's thesis.
    gate: z.object({
      eyebrow: z.string(),
      pull: z.string(),
      pullAccent: z.string(),
      stats: z
        .object({
          value: z.string(),
          unit: z.string().optional(),
          label: z.string(),
          tone: z.enum(['green', 'gold', 'plain']),
        })
        .array()
        .length(3),
      note: z.string(),
    }),
    contact,
  }),
});

// The About page: the company in one line, the founder in two, partners, contact.
const heading = { eyebrow: z.string(), heading: z.string() };
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string(),
      lede: z.string(),
      ledeEm: z.string(),
      role: z.string(),
    }),
    founder: z.object({ label: z.string(), body: z.string() }),
    partners: z.object({
      ...heading,
      aside: z.string(),
      items: z
        .object({
          name: z.string(),
          category: z.string(),
          body: z.string(),
          href: z.url(),
          /** File in design-system/assets/; absent → the name stands in for it. */
          logo: z.string().optional(),
        })
        .array()
        .min(1),
      visit: z.string(),
    }),
    contact: z.object({
      ...heading,
      locationLabel: z.string(),
      location: z.string(),
      email: z.email(),
      linkedin: z.url(),
    }),
  }),
});

// The Design Challenge landing, for now only its partner pitch (the PDF flyer,
// ported). `support`'s intro is the Markdown body. The gallery, voting and
// submit flow are the private repo's (Roadmap 2.1).
const designchallenge = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/designchallenge' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string(),
      lede: z.string(),
      ledeEm: z.string(),
      status: z.string(),
      cta,
      /** Captions of the four faces the hero mark cycles through, in order. */
      roles: z.string().array().length(4),
    }),
    support: z.object({
      ...heading,
      glance: z.object({
        eyebrow: z.string(),
        items: z.object({ label: z.string(), body: z.string() }).array().min(1),
      }),
      why: z.object({
        eyebrow: z.string(),
        items: z.object({ num: z.string(), title: z.string(), body: z.string() }).array().length(3),
      }),
      packages: z.object({
        ...heading,
        contributeLabel: z.string(),
        getLabel: z.string(),
        items: z
          .object({ num: z.string(), name: z.string(), contribute: z.string(), get: z.string() })
          .array()
          .min(1),
        note: z.string(),
        noteEm: z.string(),
      }),
      team: z.object({
        eyebrow: z.string(),
        label: z.string(),
        people: z.object({ name: z.string(), role: z.string() }).array().min(1),
      }),
    }),
    contact: z.object({ ...heading, name: z.string(), email: z.email() }),
  }),
});

export const collections = { home, sandbox, about, designchallenge };
