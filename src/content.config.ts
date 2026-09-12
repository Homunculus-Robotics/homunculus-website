import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// astro:content's re-exported `z` is deprecated in Astro 7 — zod 4 directly.
import { z } from 'zod';

const cta = z.object({ label: z.string(), href: z.string() });
const tone = z.enum(['accent', 'signal']);

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
    contact: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      email: z.email(),
    }),
  }),
});

export const collections = { home };
