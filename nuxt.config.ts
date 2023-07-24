// https://nuxt.com/docs/api/configuration/nuxt-config

import i18n from './config/i18n';
import runtime from './config/runtime';
import modules from './config/modules';
import components from './config/components';
import hooks from './config/hooks';
import pwa from './config/pwa';
import auth from './config/auth'; //this is sidebase auth

export default defineNuxtConfig({
  runtime,
  modules,
  components,
  i18n,
  hooks,
  // pwa,
  // auth,

  css: ['@/assets/css/main.css'],

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

  nitro: {
    prerender: {
      routes: ["/"],
    },
  },

  ssr: false,

  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
})
