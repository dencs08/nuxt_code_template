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
// import apollo from "./config/apollo"

export default defineNuxtConfig({
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
    i18n,
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

    app: {
        pageTransition: { name: "page", mode: "out-in" },
        // layoutTransition: { name: 'layout', mode: 'out-in' }
    },

    // ssr: false, //uncomment for client-side generation (disables server-side rendering)

    // nitro: {
    //   prerender: {
    //     routes: ["/"],
    //   },
    // },
});