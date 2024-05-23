import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import Vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'

const { APP_HOST, APP_PORT, APP_SITE, APP_BASE } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  '',
)

const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/`

// https://astro.build/config
export default defineConfig({
  server: {
    host: APP_HOST,
    port: +APP_PORT,
  },
  site: APP_SITE,
  base: basePath,
  integrations: [
    Vue({ appEntrypoint: '/src/pages/_app' }),
    UnoCSS({ injectReset: true }),
  ],
  vite: {
    plugins: [mkcert()],
    css: {
      transformer: 'lightningcss',
    },
  },
})
