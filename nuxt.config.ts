// https://nuxt.com/docs/api/configuration/nuxt-config

import supabase from "./config/supabase";
import i18n from "./config/i18n";
import runtimeConfig from "./config/runtime";
import modules from "./config/modules";
import components from "./config/components";
import hooks from "./config/hooks";
import primevue from "./config/primevue";
import content from "./config/content";
import image from "./config/image";
import googleFonts from "./config/googleFonts";
import webVitals from "./config/webVitals";
import site from "./config/site";
import robots from "./config/robots";
import routeRules from "./config/routeRules";
import pwa from "./config/pwa";

export default defineNuxtConfig({
    runtimeConfig,
    supabase,
    modules,
    components,
    i18n,
    hooks,
    primevue,
    content,
    image,
    googleFonts,
    webVitals,
    site,
    robots,
    routeRules,
    // pwa, //when using nuxt pwa module

    devtools: {
        enabled: true,
    },

    app: {
        pageTransition: { name: "page", mode: "out-in" },
        // layoutTransition: { name: 'layout', mode: 'out-in' }
    },

    // ssr: false, //for static site generation

    // nitro: {
    //   prerender: {
    //     routes: ["/"],
    //   },
    // },
});
