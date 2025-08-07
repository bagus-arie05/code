import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { defineNuxtPlugin } from 'nuxt/app'
import { md2 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md2
  })
  app.vueApp.use(vuetify)
})