// Core
import runtimeConfig from "./app/config/runtime";
import modules from "./app/config/modules";
import components from "./app/config/components";
import hooks from "./app/config/hooks";

// Development
import storybook from "./app/config/storybook";
import linkChecker from "./app/config/linkChecker";
import device from "./app/config/device";

// SEO
import robots from "./app/config/robots";
import ogImage from "./app/config/ogImage";

// UI/UX
import primevue from "./app/config/primevue";
import fonts from "./app/config/fonts";
import pwa from "./app/config/pwa";

// Other imports
import supabase from "./app/config/supabase";
import i18n from "./app/config/i18n";
import content from "./app/config/content";
import image from "./app/config/image";
import webVitals from "./app/config/webVitals";
import site from "./app/config/site";
import routeRules from "./app/config/routeRules";
import turnstile from "./app/config/turnstile";
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
