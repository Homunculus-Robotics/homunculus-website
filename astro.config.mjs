// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://homunculusrobotics.com', // apex domain, public/CNAME + DNS A records
  output: 'static', // D4: Pages now; flip to 'server' + per-route prerender in 1.2
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    // D2: tokens are imported out of design-system/, never copied
    server: { fs: { allow: ['..'] } },
  },
});
