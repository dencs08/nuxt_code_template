// Core
import runtimeConfig from "./config/runtime";
import modules from "./config/modules";
import components from "./config/components";
import hooks from "./config/hooks";

// Development
import storybook from "./config/storybook";
import linkChecker from "./config/linkChecker";
import device from "./config/device";

// SEO
import robots from "./config/robots";
import ogImage from "./config/ogImage";

// UI/UX
import primevue from "./config/primevue";
import fonts from "./config/fonts";
import pwa from "./config/pwa";

// Other imports
import supabase from "./config/supabase";
import i18n from "./config/i18n";
import content from "./config/content";
import image from "./config/image";
import webVitals from "./config/webVitals";
import site from "./config/site";
import routeRules from "./config/routeRules";
import turnstile from "./config/turnstile";
// import auth from "./app/config/auth";
// import apollo from "./app/config/apollo"

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  // srcDir: ".",

  // dir: {
  //   app: "app",
  // },

  // experimental: {
  //   sharedPrerenderData: false,
  //   compileTemplate: true,
  //   resetAsyncDataToUndefined: true,
  //   templateUtils: true,
  //   relativeWatchPaths: true,
  //   defaults: {
  //     useAsyncData: {
  //       deep: true,
  //     },
  //   },
  // },

  // unhead: {
  //   renderSSRHeadOptions: {
  //     omitLineBreaks: false,
  //   },
  // },

  // Core
  runtimeConfig,

  modules,
  components,
  hooks,
  routeRules,
  supabase,
  content,
  image,
  site,
  turnstile,
  i18n,

  // auth,
  // apollo,

  // Development
  devtools: {
    enabled: true,
  },

  storybook,
  device,

  // SEO
  robots,

  ogImage,
  linkChecker,

  // UI/UX
  primevue,

  fonts,
  pwa,
  webVitals,

  // ssr: false, //uncomment for client-side generation (disables server-side rendering)
  // nitro: {
  //   prerender: {
  //     routes: ["/"],
  //   },
  // },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  compatibilityDate: "2024-07-23",
});
