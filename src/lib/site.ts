import { getRelativeLocaleUrl } from 'astro:i18n';

// ponytail: /knowledge (Knowledge Bits) and /about belong to this repo.
// /designchallenge/* is the *other* repo (private, `Website.git`) once that app
// is deployed behind this domain. Until then the bare /designchallenge landing
// (the partner pitch) is static and lives here; it moves over with Roadmap 2.1.
export const NAV_LINKS = [
  { href: '/sandbox', label: { en: 'Sandbox', de: 'Sandkasten' } },
  { href: '/designchallenge', label: { en: 'Design Challenge', de: 'Design Challenge' } },
  { href: '/knowledge', label: { en: 'Knowledge Bits', de: 'Wissensbits' } },
  { href: '/about', label: { en: 'About', de: 'Über uns' } },
];

/** Locale-prefixed href. On /de/ every internal link has to stay on /de/. */
export const navHref = (href: string, locale: string) =>
  getRelativeLocaleUrl(locale === 'de' ? 'de' : 'en', href);

/**
 * The locale-agnostic path: `/de/about` and `/about` both collapse to `/about`.
 * Nav uses it to mark the current link, LangSwitch to point each locale at the
 * same page — they must strip identically or the two disagree on what page
 * this is.
 */
export const localePath = (pathname: string) => pathname.replace(/^\/de(?=\/|$)/, '') || '/';
