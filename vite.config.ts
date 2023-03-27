import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  plugins: [
    vue(),
    Pages({
      importMode: 'async',
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
    Components({ dts: 'src/components.d.ts', directoryAsNamespace: true }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, '**/__mocks__/**', '**/__tests__/**'],
    globals: true,
    environment: 'jsdom',
  },
})
