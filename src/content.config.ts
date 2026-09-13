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

export const collections = { home, sandbox };
