import supabase from "./config/supabase";
import i18n from "./config/i18n";
import content from "./config/content";
import image from "./config/image";
import webVitals from "./config/webVitals";
import site from "./config/site";
import turnstile from "./config/turnstile";
import robots from "./config/robots";
import ogImage from "./config/ogImage";
import primevue from "./config/primevue";
import fonts from "./config/fonts";
import pwa from "./config/pwa";
import apollo from "./config/apollo";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  supabase,
  content,
  image,
  site,
  turnstile,
  i18n,
  robots,
  ogImage,
  primevue,
  fonts,
  pwa,
  webVitals,
  // apollo,

  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@formkit/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    // "@prisma/nuxt", //uncomment when using database other than supabase,
    // "nuxtjs/apollo", //uncomment when using wordpress backend with graphql

    //ui/ux
    "@nuxtjs/tailwindcss",
    "@nuxtjs/turnstile",
    "@nuxt/image",
    "@nuxt/fonts",
    "nuxt-icon",
    "@primevue/nuxt-module",

    //seo
    "@nuxtjs/web-vitals",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-link-checker",
    "nuxt-schema-org",
    // "nuxt-og-image", //crashes the 4 compoatibility version right now
    // "nuxt-gtag", //uncomment for adding gtag integration
    //optional
    // "@vite-pwa/nuxt", //uncomment for generating a PWA for mobiles.
    // "@nuxtjs/google-fonts", //migrating to official module nuxt-fonts probaly will be removed in future.
  ],

  components: [
    {
      path: "./components",
      pathPrefix: false,
    },
  ],
});
