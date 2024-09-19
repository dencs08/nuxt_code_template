// Core
import runtimeConfig from "./config/runtime";
import modules from "./config/modules";
import components from "./config/components";
import hooks from "./config/hooks";
import storybook from "./config/storybook";
import linkChecker from "./config/linkChecker";
import device from "./config/device";
import routeRules from "./config/routeRules";
import delayHydration from "./config/delayHydration";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig,
  modules,
  components,
  hooks,
  routeRules,
  linkChecker,
  storybook,
  device,
  delayHydration,
  devtools: {
    enabled: true,
  },

  nitro: {
    appConfigFiles: ["./nitro.config.ts"],
  },

  //for some reason have to be here instead of in core config
  pinia: {
    storesDirs: [
      "./app/auth/stores/**",
      "./app/core/stores/**",
      "./app/dashboard/stores/**",
      "./app/enduser/stores/**",
      "./app/auth/stores/**",
    ],
  },

  ssr: true,

  extends: ["./app/core", "./app/auth", "./app/dashboard", "./app/enduser"],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  compatibilityDate: "2024-09-19",
});
