// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import svelte from '@astrojs/svelte';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // No server-side session state yet, so stop the Cloudflare adapter from
  // injecting its default KV session driver. Remove this if stage 3 adds
  // accounts and needs Astro.session.
  session: false,

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      // Transactional email (Resend). Not yet configured: the contact
      // endpoint logs submissions instead of sending while this is a
      // placeholder. See todo.md.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),

      // Where form submissions are delivered.
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'public' }),

      // Turnstile (spam protection). Currently Cloudflare's published
      // "always passes" test pair, which needs no account.
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' })
    }
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin']
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo Black',
      cssVariable: '--font-archivo-black',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin']
    }
  ],

  adapter: cloudflare({
    imageService: 'compile'
  }),

  integrations: [svelte(), react()]
});