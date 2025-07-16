// import this after install `@mdi/font` package
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({})
  app.vueApp.use(vuetify)
})
