import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  build: {
    transpile: ['vuetify'] // Important for Nuxt 3 with Vuetify
  },
  css: [
    'vuetify/lib/styles/main.sass', // Or 'vuetify/styles' depending on version
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    plugins: [
      vuetify({ autoImport: true }) // If using vite-plugin-vuetify
    ]
  }
})