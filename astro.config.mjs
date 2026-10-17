// @ts-check
import { defineConfig } from 'astro/config';

// URL publique du site : utilisée pour les QR codes des étiquettes.
// À définir dans Cloudflare Pages (Settings → Environment variables → SITE_URL).
const site = process.env.SITE_URL ?? 'https://maison.example.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
