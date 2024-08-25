// config/modules.ts

export default [
  //development
  "@nuxt/devtools",
  "@nuxtjs/device",
  "nuxt-typed-router",
  // "@nuxtjs/storybook", //right now breaks the app (enabling porbably forces ssr:false)

  //core (required for most template features)
  "@nuxtjs/supabase",
  "@nuxtjs/i18n",
  "@nuxt/content",
  "@formkit/nuxt",
  "@pinia/nuxt",
  "@vueuse/nuxt",
  // "@prisma/nuxt", //uncomment when using database other than supabase,
  // "nuxtjs/apollo", //uncomment when using wordpress backend with graphql

  //auth
  // "@sidebase/nuxt-auth",

  //ui/ux
  "@nuxtjs/tailwindcss",
  "@nuxtjs/turnstile",
  "@nuxt/image",
  "@nuxt/fonts",
  "nuxt-icon",
  "@primevue/nuxt-module",
  // "nuxt-primevue",

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
];
