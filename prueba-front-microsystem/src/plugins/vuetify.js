/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2', // Azul principal
          secondary: '#424242',
          accent: '#0D47A1', // Azul más oscuro
          error: '#FF5252',
          info: '#2196F3', // Azul información
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#F5F5F5',
        },
      },
    },
  },
})
