// https://nuxt.com/docs/api/configuration/nuxt-config

import i18n from './config/i18n';
import auth from './config/auth';
import runtime from './config/runtime';
import modules from './config/modules';
import components from './config/components';
import hooks from './config/hooks';

export default defineNuxtConfig({
  runtime,
  modules,
  components,
  i18n,
  auth,
  hooks,

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
