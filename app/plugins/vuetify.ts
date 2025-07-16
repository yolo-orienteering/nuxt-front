// import this after install `@mdi/font` package
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#264653',
            secondary: '#F4A261',
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
