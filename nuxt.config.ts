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

// import apollo from "./app/config/apollo"
// import auth from "./app/config/auth";
import robots from "./config/robots";
import ogImage from "./config/ogImage";
import primevue from "./config/primevue";
import fonts from "./config/fonts";
import pwa from "./config/pwa";
import supabase from "./config/supabase";
// import i18n from "./config/i18n";
import content from "./config/content";
import image from "./config/image";
import webVitals from "./config/webVitals";
import site from "./config/site";
import turnstile from "./config/turnstile";

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

  // auth,
  // apollo,
  robots,
  webVitals,
  ogImage,
  pwa,
  primevue,
  fonts,
  supabase,
  content,
  image,
  site,
  turnstile,
  // i18n,

  ssr: true,
  // nitro: {
  //   prerender: {
  //     routes: ["/"],
  //   },
  // },

  extends: ["./app/core", "./app/auth", "./app/dashboard", "./app/enduser"],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  compatibilityDate: "2024-07-23",
});
