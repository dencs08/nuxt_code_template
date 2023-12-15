// https://nuxt.com/docs/api/configuration/nuxt-config

import supabase from './config/supabase';
import i18n from './config/i18n';
import runtime from './config/runtime';
import modules from './config/modules';
import components from './config/components';
import hooks from './config/hooks';
import pwa from './config/pwa';
import auth from './config/auth'; //this is sidebase auth

export default defineNuxtConfig({
  runtime,
  supabase,
  modules,
  components,
  i18n,
  hooks,
  // pwa, //when using nuxt pwa module
  // auth, //when using nuxt auth module

  css: [
      '@/assets/css/main.css',
      '@/assets/css/primeVue_theme.css',
      'primeicons/primeicons.css',
      // '@sfxcode/formkit-primevue/dist/sass/formkit-prime-inputs.scss',
      // '@sfxcode/formkit-primevue/dist/sass/formkit-primevue.scss'
  ],

  build: {
    transpile: ["primevue"]
  },
  primevue: {
    config: {
      ripple: false
    }
  },

  //for sitemap generation
  site: {
    url: import.meta.env.APP_URL,
  },

  devtools: {
    enabled: true
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  // nitro: {
  //   prerender: {
  //     routes: ["/"],
  //   },
  // },

  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true  },
    '/contact': { prerender: true  },
    // Product page generated on-demand, revalidates in background
    // '/products/**': { swr: 3600 },
    // // Blog post generated on-demand once until next deploy
    // '/blog/**': { isr: true },
    // // Admin dashboard renders only on client-side
    // '/admin/**': { ssr: false },
    // // Add cors headers on API routes
    // '/api/**': { cors: true },
    // // Redirects legacy urls
    // '/old-page': { redirect: '/new-page' }
  },

  // ssr: false,

  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },

  imports: {
    dirs:['pinia']
  }
})
