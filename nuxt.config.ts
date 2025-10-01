// nuxt.config.ts
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
    '@pinia/nuxt',
    // Remove '@sidebase/nuxt-auth' completely
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  // Remove the auth configuration completely
  // auth: { ... } <- Remove this entire block

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    keycloakIssuer: process.env.KEYCLOAK_ISSUER,
    public: {
      authUrl: process.env.AUTH_ORIGIN || 'http://localhost:3001' || 'http://localhost:3000'
    }
  },

  build: {
    transpile: ['vuetify']
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    plugins: [
      vuetify({ autoImport: true })
    ]
  }
})