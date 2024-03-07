// config/modules.ts

export default [
    //development
    "@nuxt/devtools",
    
    //seo
    '@nuxtjs/web-vitals',
    "@nuxtjs/robots",
    "nuxt-simple-sitemap",
    
    //core
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxt/content",
    "@nuxt/image",
    "nuxt-icon",
    "nuxt-primevue",
    "@formkit/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",

    //optional
    // "@vite-pwa/nuxt", //uncomment for generating a PWA for mobiles.
    // "nuxt-gtag", //uncomment for adding gtag integration
];
