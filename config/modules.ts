// config/modules.ts

export default [
    //development
    "@nuxt/devtools",
    '@nuxtjs/device',
    'nuxt-typed-router',
    // "@nuxtjs/storybook", //right now breaks the app (enabling porbably forces ssr:false)

    //core (required for most template features)
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@formkit/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    // "nuxtjs/apollo", //uncomment when using wordpress backend with graphql
    
    //seo
    '@nuxtjs/web-vitals',
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    'nuxt-link-checker',
    'nuxt-schema-org',
    'nuxt-og-image',
    // "nuxt-gtag", //uncomment for adding gtag integration
    
    //ui/ux
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@nuxt/image",
    "nuxt-icon",
    "@nuxt/fonts",
    
    //optional
    // "@vite-pwa/nuxt", //uncomment for generating a PWA for mobiles.

    // "@nuxtjs/google-fonts", //migrating to official module nuxt-fonts probaly will be removed in future.
];
