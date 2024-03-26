// config/modules.ts

export default [
    //development
    "@nuxt/devtools",
    
    //seo
    '@nuxtjs/web-vitals',
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    
    //core
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/fonts",
    "nuxt-icon",
    "nuxt-primevue",
    "@formkit/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",

    // "@nuxtjs/google-fonts", //migrating to official module nuxt-fonts

    //optional
    // "@vite-pwa/nuxt", //uncomment for generating a PWA for mobiles.
    // "nuxt-gtag", //uncomment for adding gtag integration
];
